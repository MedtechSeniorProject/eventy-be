import { dataSource } from "../../database/database-source";
import { CreateEventManagerDto } from "./dto/create-eventmanager.dto";
import { UpdateEventManagerDto } from "./dto/update-eventmanager.dto";
import { EventManager } from "./eventmanager.entity";
import * as bcrypt from "bcrypt";

class EventManagerService {
  public eventManagerRepository = dataSource.getRepository(EventManager);

  public async getEventManagers() {
    return await this.eventManagerRepository.find();
  }

  public async createEventManager(eventmanager: CreateEventManagerDto) {
    const password = eventmanager.password;
    const passwordHash = await bcrypt.hash(password, 10);
    const { password: createdPassword, ...createdEventManager } =
      await this.eventManagerRepository.save({
        ...eventmanager,
        password: passwordHash,
      });
    return createdEventManager;
  }

  public async updateEventManager(
    id: string,
    eventmanager: UpdateEventManagerDto
  ) {
    if (eventmanager.password) {
      const passwordHash = await bcrypt.hash(eventmanager.password, 10);
      await this.eventManagerRepository.update(id, {
        ...eventmanager,
        password: passwordHash,
      });
    } else await this.eventManagerRepository.update(id, eventmanager);
    return await this.getEventManagerById(id);
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
    return await this.eventManagerRepository.findOne({
      where: { email: email },
    });
  }

  public async getEventManagerWithPasswordByEmail(email: string) {
    return await this.eventManagerRepository
      .createQueryBuilder("eventmanager")
      .addSelect("eventmanager.password")
      .where("eventmanager.email = :email", { email })
      .getOne();
  }
}

export default new EventManagerService() as EventManagerService;
