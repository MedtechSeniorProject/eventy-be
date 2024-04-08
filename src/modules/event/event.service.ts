import { BadRequestError, UnauthorizedError } from "routing-controllers";
import { dataSource } from "../../database/database-source";
import eventmanagerService from "../eventmanager/eventmanager.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { Event } from "./event.entity";
import { AddSingleAttendeeDto } from "./dto/add-single-attendee.dto";
import { Attendee } from "./Attendee";
import { UpdateEventDto } from "./dto/update-event.dto";
import { CheckInAttendeeDto } from "./dto/checkin-attendee.dto";
import axios from "axios";
import QRCode from "qrcode";
import MailingService from "../mailing/mailing.service";
import { AddQuestionDto } from "./dto/add-question.dto";
import Question from "./Question";
import { updateResponseDto } from "./dto/update-response.dto";

class EventService {
  public eventRepository = dataSource.getRepository(Event);

  //Fetch address from coordinates
  public async fetchAddressFromCoordinates(
    latitude: number,
    longitude: number
  ) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
    try {
      const response = await axios.get(url);
      const address = response.data.display_name;
      return address;
    } catch (error) {
      throw new Error("Failed to fetch address from coordinates.");
    }
  }

  public async getEvents() {
    return await this.eventRepository.find();
  }

  public async getEventsWithEventManagers() {
    return await this.eventRepository.find({
      relations: ["eventManager"],
      select: [
        "id",
        "name",
        "description",
        "address",
        "startTime",
        "endTime",
        "isArchived",
      ],
    });
  }

  public async getArchivedEvents(userId: string) {
    const authenticatedUser = await eventmanagerService.getEventManagerById(
      userId
    );
    if (authenticatedUser === null) {
      throw new UnauthorizedError("Cannot find event manager.");
    }

    return await this.eventRepository.find({
      where: { eventManager: authenticatedUser, isArchived: true },
      relations: ["eventManager"],
      select: [
        "id",
        "name",
        "description",
        "address",
        "startTime",
        "endTime",
        "isArchived",
      ],
    });
  }

  public async getUpcomingEvents(userId: string) {
    const authenticatedUser = await eventmanagerService.getEventManagerById(
      userId
    );
    if (authenticatedUser === null) {
      throw new UnauthorizedError("Cannot find event manager.");
    }

    return await this.eventRepository.find({
      where: { eventManager: authenticatedUser, isArchived: false },
      relations: ["eventManager"],
      select: [
        "id",
        "name",
        "description",
        "address",
        "startTime",
        "endTime",
        "isArchived",
      ],
    });
  }

  public async getMyEvents(userId: string) {
    const authenticatedUser = await eventmanagerService.getEventManagerById(
      userId
    );
    if (authenticatedUser === null) {
      throw new UnauthorizedError("Cannot find event manager.");
    }
    return await this.eventRepository.find({
      where: { eventManager: authenticatedUser },
      relations: ["eventManager"],
      select: [
        "id",
        "name",
        "description",
        "address",
        "startTime",
        "endTime",
        "isArchived",
      ],
    });
  }

  public async getAttendeesById(id: string) {
    const event = await this.eventRepository.findOne({
      where: { id: id },
      select: ["attendees"],
    });
    if (event !== null) {
      return event.attendees;
    } else {
      throw new BadRequestError("Event not found");
    }
  }

  public async getQuestions(eventId: string, attendeeId: string) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      select: ["questions", "attendees"],
    });

    if (event == null) {
      throw new BadRequestError("Event or attendee not found");
    }

    const attendee = event.attendees.find(
      (attendee) => attendee.id === attendeeId
    );

    if (attendee == null) {
      throw new BadRequestError("Event or attendee not found");
    }

    if (!attendee.hasAttended) {
      throw new BadRequestError("Attendee has not attended the event");
    }

    if (attendee.responses && attendee.responses.length > 0) {
      throw new BadRequestError("Attendee has already answered the questions");
    }

    return event.questions;
  }

  public async getEventById(id: string) {
    return await this.eventRepository.findOne({
      where: { id: id },
      relations: ["deskAgents", "eventManager"],
    });
  }

  public async toggleArchiveEvent(id: string) {
    const event = await this.eventRepository.findOne({ where: { id: id } });
    if (event !== null) {
      event.isArchived = !event.isArchived;
      return this.eventRepository.save(event);
    } else {
      throw new BadRequestError("Event not found");
    }
  }

  public async checkInAttendee(
    eventId: string,
    attendeeId: CheckInAttendeeDto
  ) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });
    if (event !== null) {
      const attendee = event.attendees.find(
        (attendee) => attendee.id === attendeeId.attendeeId
      );
      if (attendee !== undefined) {
        if (attendee.hasAttended === false) {
          attendee.hasAttended = true;
          if (await this.eventRepository.save(event)) {
            return attendee;
          }
        } else {
          if (!attendee.phoneNumber) {
            attendee.phoneNumber = "00000000";
          }
          throw new BadRequestError(
            `Attendee has already been checked in. Attendee ID: ${attendeeId.attendeeId}, Attendee Name: ${attendee.name}, Attendee Email: ${attendee.email}, Attendee Phone Number: ${attendee.phoneNumber}`
          );
        }
      } else {
        throw new BadRequestError("Attendee not found");
      }
    } else {
      throw new BadRequestError("Event not found");
    }
  }

  public async updateQuestions(eventId: string, questions: AddQuestionDto[]) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });
    const newQuestions: Question[] = [];
    if (event !== null) {
      questions.forEach((question) => {
        const newQuestion = new Question(
          question.id,
          question.type,
          question.question,
          question.isRequired,
          question.options
        );
        newQuestions.push(newQuestion);
      });
      event.questions = newQuestions;
      return this.eventRepository.save(event);
    } else {
      throw new BadRequestError("Event not found");
    }
  }

  public async updateResponses(
    eventId: string,
    attendeeId: string,
    responses: updateResponseDto[]
  ) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (event == null) {
      throw new BadRequestError("Event not found");
    }

    const attendee = event.attendees.find(
      (attendee) => attendee.id === attendeeId
    );

    if (attendee == null) {
      throw new BadRequestError("Attendee not found");
    }

    if (attendee.responses && attendee.responses.length > 0) {
      throw new BadRequestError("Attendee has already answered the questions");
    }

    attendee.responses = responses;
    return this.eventRepository.save(event);
  }

  public async updateEvent(id: string, event: UpdateEventDto) {
    const eventToUpdate = await this.eventRepository.findOne({
      where: { id: id },
    });
    let isNewAddress: boolean = false;

    if (eventToUpdate === null) {
      throw new BadRequestError("Event not found");
    }
    if (event.name !== undefined) {
      eventToUpdate.name = event.name;
    }
    if (event.description !== undefined) {
      eventToUpdate.description = event.description;
    }
    if (event.startTime !== undefined) {
      eventToUpdate.startTime = event.startTime;
    }
    if (event.endTime !== undefined) {
      eventToUpdate.endTime = event.endTime;
    }
    if (event.longitude !== undefined) {
      eventToUpdate.longitude = event.longitude;
      isNewAddress = true;
    }
    if (event.latitude !== undefined) {
      eventToUpdate.latitude = event.latitude;
      isNewAddress = true;
    }

    if (event.emailTemplate !== undefined) {
      eventToUpdate.emailTemplate = event.emailTemplate;
    }

    if (isNewAddress) {
      const newAddress = await this.fetchAddressFromCoordinates(
        eventToUpdate.latitude,
        eventToUpdate.longitude
      );
      eventToUpdate.address = newAddress;
    }

    return await this.eventRepository.save(eventToUpdate);
  }

  public async createEvent(event: CreateEventDto, userId: string) {
    const newEvent = new Event();
    newEvent.name = event.name;
    newEvent.description = event.description;
    newEvent.startTime = event.startTime;
    newEvent.endTime = event.endTime;
    newEvent.latitude = event.latitude;
    newEvent.longitude = event.longitude;
    //Fetch address from coordinates
    const address = await this.fetchAddressFromCoordinates(
      event.latitude,
      event.longitude
    );
    newEvent.address = address;

    let eventCreator = await eventmanagerService.getEventManagerById(userId);
    if (eventCreator === null) {
      throw new UnauthorizedError("Event Manager not found");
    } else {
      newEvent.eventManager = eventCreator;
    }
    return await this.eventRepository.save(newEvent);
  }

  public async addAttendees(id: string, attendees: AddSingleAttendeeDto[]) {
    const event = await this.eventRepository.findOne({ where: { id: id } });
    if (event !== null) {
      attendees.forEach((attendee) => {
        const existingAttendee = event.attendees.find(
          (a) => a.email === attendee.email
        );
        if (existingAttendee) {
          return; // Skip if email is duplicate
        }
        const newAttendee = new Attendee(
          attendee.name,
          attendee.email,
          true,
          false,
          attendee.phoneNumber
        );
        event.attendees.push(newAttendee);
      });
      return this.eventRepository.save(event);
    } else {
      throw new BadRequestError("Event not found");
    }
  }

  public async addAttendee(eventId: string, attendee: AddSingleAttendeeDto) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });
    if (event !== null) {
      const existingAttendee = event.attendees.find(
        (a) => a.email === attendee.email
      );
      if (existingAttendee) {
        throw new BadRequestError("Attendee email already exists");
      }
      const newAttendee = new Attendee(
        attendee.name,
        attendee.email,
        false,
        true,
        attendee.phoneNumber
      );
      event.attendees.push(newAttendee);
      if (await this.eventRepository.save(event)) {
        return newAttendee;
      }
    } else {
      throw new BadRequestError("Event not found");
    }
  }

  public async deleteAttendees(eventId: string, aattendeeIds: string[]) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });
    if (event !== null) {
      event.attendees = event.attendees.filter(
        (attendee) => !aattendeeIds.includes(attendee.id)
      );
      return this.eventRepository.save(event);
    } else {
      throw new BadRequestError("Event not found");
    }
  }

  public async deleteEvent(id: string) {
    const event = await this.eventRepository.findOne({ where: { id: id } });
    if (event !== null) {
      const deletedEvent = await this.eventRepository.remove(event);
      if (deletedEvent) {
        return "Event deleted successfully";
      }
    } else {
      throw new BadRequestError("Event not found");
    }
  }

  public async deleteAllAttendees(id: string) {
    const event = await this.eventRepository.findOne({ where: { id: id } });
    if (event !== null) {
      event.attendees = [];
      return await this.eventRepository.save(event);
    } else {
      throw new BadRequestError("Event not found");
    }
  }

  public async sendInvites(id: string) {
    const event = await this.eventRepository.findOne({ where: { id: id } });
    if (event == null) {
      throw new BadRequestError("Event not found");
    }
    // Prepare Email from template
    let emailTemplate = event.emailTemplate;
    // find {{title}} and replace with event name
    emailTemplate = emailTemplate.replace("{{title}}", event.name);
    // find {{description}} and replace with event description
    emailTemplate = emailTemplate.replace("{{description}}", event.description);
    // find {{address}}
    emailTemplate = emailTemplate.replace("{{address}}", event.address);
    // find {{startTime}}
    emailTemplate = emailTemplate.replace(
      "{{startTime}}",
      new Date(event.startTime).toLocaleString("en-GB", {
        timeZoneName: "short",
      })
    );
    // find {{endTime}}
    emailTemplate = emailTemplate.replace(
      "{{endTime}}",
      new Date(event.endTime).toLocaleString("en-GB", { timeZoneName: "short" })
    );

    // Send invites to attendees
    event.attendees.forEach((attendee) => {
      // generate qr code
      QRCode.toDataURL(attendee.id, function (err, url) {
        //console.log(url);
        // append imnage to email template
        const emailTemplateWithQR =
          emailTemplate + `<br><img src="${url}" alt="QR Code" />`;
        // send email to attendee
        MailingService.sendMail(
          attendee.email,
          event.name + " Invitation",
          emailTemplateWithQR
        );
      });
      // Send email to attendee
      console.log(`Sending email to ${attendee.email}`);
      //
    });
    return "Invites sent successfully";
  }
}

export default new EventService() as EventService;
