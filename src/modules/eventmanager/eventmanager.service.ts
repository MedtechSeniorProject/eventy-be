import { dataSource } from "../../database/database-source";
import { CreateEventManagerDto } from "./dto/create-eventmanager.dto";
import { UpdateEventManagerDto } from "./dto/update-eventmanager.dto";
import { EventManager } from "./eventmanager.entity";

class EventManagerService {
  public eventManagerRepository = dataSource.getRepository(EventManager);

  public async getEventManager() {
    return await this.eventManagerRepository.find();
  }

  public async createEventManager(eventmanager: CreateEventManagerDto) {
    return await this.eventManagerRepository.save(eventmanager);
  }

  public async updateEventManager(id: string, eventmanager: UpdateEventManagerDto) {
    return await this.eventManagerRepository.update(id, eventmanager);
  }

  public async deleteEventManager(id: string) {
    return await this.eventManagerRepository.delete(id);
  }

  public async getEventManagerById(id: string) {
    return await this.eventManagerRepository.findOne({
      where: { id: id },
    });
  }

  public async getEventManagerByEmail(email: string) {
    return await this.eventManagerRepository.findOne({ where: { email: email } });
  }
}

export default new EventManagerService();
