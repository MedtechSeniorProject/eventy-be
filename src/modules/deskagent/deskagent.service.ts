import { BadRequestError, NotFoundError } from "routing-controllers";
import { dataSource } from "../../database/database-source";
import eventService from "../event/event.service";
import { DeskAgent } from "./deskagent.entity";
import { createDeskAgentDto } from "./dto/create-deskagent.dto";
import { UpdateDeskAgentDto } from "./dto/update-deskagent.dto";
import * as bcrypt from "bcrypt";

class DeskAgentService {
  public deskAgentRepository = dataSource.getRepository(DeskAgent);

  public async getDeskAgent() {
    return await this.deskAgentRepository.find();
  }

  public async getDeskAgentWithPasswordByUsername(username: string) {
    return await this.deskAgentRepository
      .createQueryBuilder("deskagent")
      .addSelect("deskagent.password")
      .leftJoinAndSelect("deskagent.event", "event")
      .where("deskagent.username = :username", { username: username })
      .getOne();
  }

  public async createDeskAgent(deskAgent: createDeskAgentDto) {
    const eventId = deskAgent.eventId;
    const event = await eventService.getEventById(eventId);
    if (!event) {
      throw new NotFoundError("Event not found");
    }
    const oldDeskAgent = await this.deskAgentRepository.findOne({
      where: { username: deskAgent.username },
    });
    if (oldDeskAgent) {
      throw new BadRequestError("Username already taken");
    }
    const password = deskAgent.password;
    const passwordHash = await bcrypt.hash(password, 10);
    const { password: createdPassword, ...createdDeskAgent } =
      await this.deskAgentRepository.save({
        ...deskAgent,
        password: passwordHash,
        event: event,
      });
    return createdDeskAgent;
  }

  public async updateDeskAgent(id: string, deskAgentDto: UpdateDeskAgentDto) {
    const deskAgent = await this.deskAgentRepository.findOne({
      where: { id: id },
    });
    if (!deskAgent) {
      throw new NotFoundError("Desk Agent not found");
    }
    if (deskAgentDto.username) {
      const oldDeskAgent = await this.deskAgentRepository.findOne({
        where: { username: deskAgentDto.username },
      });
      if (oldDeskAgent) {
        throw new BadRequestError("Username already taken");
      }
    }
    const { password, ...rest } = deskAgentDto;
    if (password) {
      const passwordHash = await bcrypt.hash(password, 10);
      await this.deskAgentRepository.update(id, {
        ...rest,
        password: passwordHash,
      });
    } else await this.deskAgentRepository.update(id, rest);
    return await this.getDeskAgentById(id);
  }

  public async deleteDeskAgent(id: string) {
    return await this.deskAgentRepository.delete(id);
  }

  public async getDeskAgentById(id: string) {
    return await this.deskAgentRepository.findOne({
      where: { id: id },
    });
  }

  public async getDeskAgentByEventId(eventId: string) {
    return await this.deskAgentRepository.find({
      where: { event: { id: eventId } },
    });
  }
}

export default new DeskAgentService() as DeskAgentService;
