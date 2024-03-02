import { BadRequestError, UnauthorizedError } from "routing-controllers";
import { dataSource } from "../../database/database-source";
import eventmanagerService from "../eventmanager/eventmanager.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { Event } from "./event.entity";
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

  public async createEvent(event: CreateEventDto) {
    const newEvent = new Event();
    newEvent.name = event.name;
    newEvent.time = event.time;
    let eventCreator = await eventmanagerService.getEventManagerById(event.eventManager);
    if (eventCreator === null) {
      throw new UnauthorizedError("User not found");
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

}

export default new EventService() as EventService;
