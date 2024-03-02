import { UnauthorizedError } from "routing-controllers";
import { dataSource } from "../../database/database-source";
import eventmanagerService from "../eventmanager/eventmanager.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { Event } from "./event.entity";

class EventService {
  public eventRepository = dataSource.getRepository(Event);

  public async getEvents() {
    return await this.eventRepository.find();
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

}

export default new EventService() as EventService;
