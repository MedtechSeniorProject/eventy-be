import "reflect-metadata";
import {
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Patch,
  Post,
  UseBefore,
} from "routing-controllers";
import { createDeskAgentDto } from "./dto/create-deskagent.dto";
import { UpdateDeskAgentDto } from "./dto/update-deskagent.dto";
import DeskAgentService from "./deskagent.service";
import { CheckAutheticated } from "../auth/jwt.middleware";
import { CheckRole } from "../auth/role.middleware";
import { ROLES } from "../auth/roles";


@JsonController("/deskagents")
export class DeskAgentController {
  @Get("/")
  getDeskAgents() {
    return DeskAgentService.getDeskAgent();
  }

  @Get("/:id")
  getDeskAgentById(@Param("id") id: string) {
    return DeskAgentService.getDeskAgentById(id);
  }

  @Post("/")
  createDeskAgent(@Body() deskAgent: createDeskAgentDto) {
    return DeskAgentService.createDeskAgent(deskAgent);
  }

  @Patch("/:id")
  updateDeskAgent(@Param("id") id: string, @Body() deskAgent: UpdateDeskAgentDto) {
    return DeskAgentService.updateDeskAgent(id, deskAgent);
  }

  @Delete("/:id")
  deleteDeskAgent(@Param("id") id: string) {
    return DeskAgentService.deleteDeskAgent(id);
  }
}
