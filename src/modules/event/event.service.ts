import { BadRequestError, UnauthorizedError } from "routing-controllers";
import { dataSource } from "../../database/database-source";
import eventmanagerService from "../eventmanager/eventmanager.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { Event } from "./event.entity";
import { AddSingleAttendeeDto } from "./dto/add-single-attendee.dto";
import { Attendee } from "./Attendee";
class EventService {

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

  getArchivedEvents() {
    return this.eventRepository.find({
      where: { isArchived: true },
      relations: ["eventManager"],
      select: ["id", "name", "time"]
    });
  }

  getUpcomingEvents() {
    return this.eventRepository.find({
      where: { isArchived: false },
      relations: ["eventManager"],
      select: ["id", "name", "time"]
    });
  }

  getEventById(id: string) {
    return this.eventRepository.findOne({ where: { id: id } });
  }

  public async getMyEvents(userId: any) {
    const authenticatedUser = await eventmanagerService.getEventManagerById(userId);
    if (authenticatedUser === null) {
      throw new UnauthorizedError("Cannot find event manager.");
    }
    return this.eventRepository.find({
      where: { eventManager: userId },
      relations: ["eventManager"],
      select: ["id", "name", "time", "isArchived", "attendees"]
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

  public async addSingleAttendee(id: string, attendee: AddSingleAttendeeDto) {
    const event = await this.eventRepository.findOne({ where: { id: id } });
    if (event !== null) {
      const newAttendee = new Attendee(
        attendee.name,
        attendee.email,
        true,
        false,
        attendee.phoneNumber
      )
      event.attendees.push(newAttendee);
      return this.eventRepository.save(event);
    } else {
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

  public async deleteSingleAttendee(eventId: string, aattendeeId: string) {
    const event = await this.eventRepository.findOne({ where: { id: eventId } });
    if (event !== null) {
      const prevLength = event.attendees.length;
      event.attendees = event.attendees.filter(attendee => attendee.id !== aattendeeId);
      this.eventRepository.save(event);
      if (prevLength === event.attendees.length) {
        throw new BadRequestError("Attendee not found");
      }
      else {
        return event;
      }
    }
    else {
      throw new BadRequestError("Event not found");
    }
  }
}

export default new EventService() as EventService;
