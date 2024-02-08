import { dataSource } from "../../database/database-source";
import { DeskAgent } from "./deskagent.entity";
import { createDeskAgentDto } from "./dto/create-deskagent.dto";
import { UpdateDeskAgentDto } from "./dto/update-deskagent.dto";

class DeskAgentService {
  public deskAgentRepository = dataSource.getRepository(DeskAgent);

  public async getDeskAgent() {
    return await this.deskAgentRepository.find();
  }

  public async createDeskAgent(deskAgent: createDeskAgentDto) {
    return await this.deskAgentRepository.save(deskAgent);
  }

  public async updateDeskAgent(id: string, deskAgent: UpdateDeskAgentDto) {
    return await this.deskAgentRepository.update(id, deskAgent);
  }

  public async deleteDeskAgent(id: string) {
    return await this.deskAgentRepository.delete(id);
  }

  public async getDeskAgentById(id: string) {
    return await this.deskAgentRepository.findOne({
      where: { id: id },
    });
  }

  public async getDeskAgentByEmail(email: string) {
    return await this.deskAgentRepository.findOne({ where: { email: email } });
  }
}

export default new DeskAgentService();

