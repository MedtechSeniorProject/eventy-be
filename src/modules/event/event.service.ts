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

class EventService {

  public eventRepository = dataSource.getRepository(Event);

  //Fetch address from coordinates
  public async fetchAddressFromCoordinates(latitude: number, longitude: number) {
    const url = `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}&api_key=${process.env.GEOCODE_API_KEY}`;
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
      select: ["id", "name", "description", "address", "startTime", "endTime", "isArchived"]
    });
  }

  public async getArchivedEvents(userId: string) {
    const authenticatedUser = await eventmanagerService.getEventManagerById(userId);
    if (authenticatedUser === null) {
      throw new UnauthorizedError("Cannot find event manager.");
    }

    return await this.eventRepository.find({
      where: { eventManager: authenticatedUser, isArchived: true },
      relations: ["eventManager"],
      select: ["id", "name", "description", "address", "startTime", "endTime", "isArchived"]
    });
  }

  public async getUpcomingEvents(userId: string) {
    const authenticatedUser = await eventmanagerService.getEventManagerById(userId);
    if (authenticatedUser === null) {
      throw new UnauthorizedError("Cannot find event manager.");
    }

    return await this.eventRepository.find({
      where: { eventManager: authenticatedUser, isArchived: false },
      relations: ["eventManager"],
      select: ["id", "name", "description", "address", "startTime", "endTime", "isArchived"]
    });
  }

  public async getMyEvents(userId: string) {
    const authenticatedUser = await eventmanagerService.getEventManagerById(userId);
    if (authenticatedUser === null) {
      throw new UnauthorizedError("Cannot find event manager.");
    }
    return await this.eventRepository.find({
      where: { eventManager: authenticatedUser },
      relations: ["eventManager"],
      select: ["id", "name", "description", "address", "startTime", "endTime", "isArchived"]
    });
  }

  public async getAttendeesById(id: string) {
    const event = await this.eventRepository.findOne({ where: { id: id }, select: ["attendees"] });
    if (event !== null) {
      return event.attendees;
    }
    else {
      throw new BadRequestError("Event not found");
    }
  }

  public async getEventById(id: string) {
    return await this.eventRepository.findOne({
      where: { id: id },
      relations: ["deskAgents", "eventManager"],
      select: ["id", "name", "description", "address", "startTime", "endTime", "isArchived", "attendees", "eventManager"]
    });
  }

  public async toggleArchiveEvent(id: string) {
    const event = await this.eventRepository.findOne({ where: { id: id } });
    if (event !== null) {
      event.isArchived = !event.isArchived;
      return this.eventRepository.save(event);
    }
    else {
      throw new BadRequestError("Event not found");
    }
  }

  public async checkInAttendee(eventId: string, attendeeId: CheckInAttendeeDto) {
    const event = await this.eventRepository.findOne({ where: { id: eventId } });
    if (event !== null) {
      const attendee = event.attendees.find(attendee => attendee.id === attendeeId.attendeeId);
      if (attendee !== undefined) {
        if (attendee.hasAttended === false) {
          attendee.hasAttended = true;
          if (await this.eventRepository.save(event)) {
            return attendee;
          }
        }
        else {
          throw new BadRequestError("Attendee already checked in");
        }
      }
      else {
        throw new BadRequestError("Attendee not found");
      }
    }
    else {
      throw new BadRequestError("Event not found");
    }
  }

  public async updateEvent(id: string, event: UpdateEventDto) {
    const eventToUpdate = await this.eventRepository.findOne({ where: { id: id } });
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

    if (isNewAddress) {
      const newAddress = await this.fetchAddressFromCoordinates(eventToUpdate.latitude, eventToUpdate.longitude);
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
    const address = await this.fetchAddressFromCoordinates(event.latitude, event.longitude);
    newEvent.address = address;

    let eventCreator = await eventmanagerService.getEventManagerById(userId);
    if (eventCreator === null) {
      throw new UnauthorizedError("Event Manager not found");
    }
    else {
      newEvent.eventManager = eventCreator;
    }
    return await this.eventRepository.save(newEvent);
  }

  public async addAttendees(id: string, attendees: AddSingleAttendeeDto[]) {
    const event = await this.eventRepository.findOne({ where: { id: id } });
    if (event !== null) {
      attendees.forEach(attendee => {
        const existingAttendee = event.attendees.find(a => a.email === attendee.email);
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
    }
    else {
      throw new BadRequestError("Event not found");
    }
  }

  public async addAttendee(eventId: string, attendee: AddSingleAttendeeDto) {
    const event = await this.eventRepository.findOne({ where: { id: eventId } });
    if (event !== null) {
      const existingAttendee = event.attendees.find(a => a.email === attendee.email);
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
    }
    else {
      throw new BadRequestError("Event not found");
    }
  }

  public async deleteAttendees(eventId: string, aattendeeIds: string[]) {
    const event = await this.eventRepository.findOne({ where: { id: eventId } });
    if (event !== null) {
      event.attendees = event.attendees.filter(attendee => !aattendeeIds.includes(attendee.id));
      return this.eventRepository.save(event);
    }
    else {
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
    }
    else {
      throw new BadRequestError("Event not found");
    }
  }

  public async deleteAllAttendees(id: string) {
    const event = await this.eventRepository.findOne({ where: { id: id } });
    if (event !== null) {
      event.attendees = [];
      return await this.eventRepository.save(event);
    }
    else {
      throw new BadRequestError("Event not found");
    }
  }

}

export default new EventService() as EventService;
