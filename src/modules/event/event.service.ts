import { dataSource } from "../../database/database-source";
import { CreateEventDto } from "./dto/create-event.dto";
import { Event } from "./event.entity";

class EventService {
  public eventRepository = dataSource.getRepository(Event);

  public async getEvents() {
    return await this.eventRepository.find();
  }

public async createEvent(event: CreateEventDto) {
    return await this.eventRepository.save(event);
}

}

export default new EventService() as EventService;
