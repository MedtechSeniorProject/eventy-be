import { BadRequestError, UnauthorizedError } from "routing-controllers";
import { dataSource } from "../../database/database-source";
import eventmanagerService from "../eventmanager/eventmanager.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { Event } from "./event.entity";
import { AddSingleAttendeeDto } from "./dto/add-single-attendee.dto";
import { Attendee } from "./Attendee";
import { UpdateEventDto } from "./dto/update-event.dto";
class EventService {
  public async addAttendee(eventId: string, attendee: AddSingleAttendeeDto) {
    const event = await this.eventRepository.findOne({ where: { id: eventId } });
    if (event !== null) {
      const newAttendee = new Attendee(
        attendee.name,
        attendee.email,
        false,
        true,
        attendee.phoneNumber
      );
      event.attendees.push(newAttendee);
      return this.eventRepository.save(event);
    }
    else {
      throw new BadRequestError("Event not found");
    }
  }
  public async addAttendees(id: string, attendees: AddSingleAttendeeDto[]) {
    const event = await this.eventRepository.findOne({ where: { id: id } });
    if (event !== null) {
      attendees.forEach(attendee => {
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

  public eventRepository = dataSource.getRepository(Event);

  public async getEvents() {
    return await this.eventRepository.find();
  }

  public async getEventsWithEventManagers() {
    return await this.eventRepository.find({
      relations: ["eventManager"],
      select: ["id", "name", "time", "isArchived"]
    });
  }

  public async getArchivedEvents(userId: string) {
    const authenticatedUser = await eventmanagerService.getEventManagerById(userId);
    if (authenticatedUser === null) {
      throw new UnauthorizedError("Cannot find event manager.");
    }

    return this.eventRepository.find({
      where: { eventManager: authenticatedUser, isArchived: true },
      relations: ["eventManager"],
      select: ["id", "name", "time"]
    });
  }

  public async getUpcomingEvents(userId: string) {
    const authenticatedUser = await eventmanagerService.getEventManagerById(userId);
    if (authenticatedUser === null) {
      throw new UnauthorizedError("Cannot find event manager.");
    }

    return this.eventRepository.find({
      where: { eventManager: authenticatedUser, isArchived: false },
      relations: ["eventManager"],
      select: ["id", "name", "time"]
    });
  }

  public async getEventById(id: string) {
    return await this.eventRepository.findOne({ where: { id: id } });
  }

  public async getMyEvents(userId: string) {
    const authenticatedUser = await eventmanagerService.getEventManagerById(userId);
    if (authenticatedUser === null) {
      throw new UnauthorizedError("Cannot find event manager.");
    }
    return this.eventRepository.find({
      where: { eventManager: authenticatedUser },
      relations: ["eventManager"],
      select: ["id", "name", "time", "isArchived",]
    });
  }


  public async createEvent(event: CreateEventDto, userId: string) {
    const newEvent = new Event();
    newEvent.name = event.name;
    newEvent.time = event.time;
    let eventCreator = await eventmanagerService.getEventManagerById(userId);
    if (eventCreator === null) {
      throw new UnauthorizedError("Event Manager not found");
    }
    else {
      newEvent.eventManager = eventCreator;
    }
    return await this.eventRepository.save(newEvent);
  }

  public async updateEvent(id: string, event: UpdateEventDto) {
    const eventToUpdate = await this.eventRepository.findOne({ where: { id: id } });

    if (eventToUpdate === null) {
      throw new BadRequestError("Event not found");
    }

    if (event.name !== undefined) {
      eventToUpdate.name = event.name;
    }

    if (event.time !== undefined) {
      eventToUpdate.time = event.time;
    }

    return await this.eventRepository.save(eventToUpdate);
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

  public async getAttendeesById(id: string) {
    const event = await this.eventRepository.findOne({ where: { id: id }, select: ["attendees"] });
    if (event !== null) {
      return event.attendees;
    }
    else {
      throw new BadRequestError("Event not found");
    }
  }

  public async deleteAllAttendees(id: string) {
    const event = await this.eventRepository.findOne({ where: { id: id } });
    if (event !== null) {
      event.attendees = [];
      return this.eventRepository.save(event);
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
}

export default new EventService() as EventService;
