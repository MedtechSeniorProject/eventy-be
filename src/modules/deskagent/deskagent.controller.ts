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
import { deleteDeskAgentsDto } from "./dto/delete-deskagents.dto";

@JsonController("/deskagents")
@UseBefore(CheckAutheticated, CheckRole([ROLES.eventmanager]))
export class DeskAgentController {
  @Get("/")
  getDeskAgents() {
    return DeskAgentService.getDeskAgent();
  }

  @Get("/event/:eventId")
  getDeskAgentsByEventId(@Param("eventId") eventId: string) {
    return DeskAgentService.getDeskAgentByEventId(eventId);
  }

  @Get("/:id")
  getDeskAgentById(@Param("id") id: string) {
    return DeskAgentService.getDeskAgentById(id);
  }

  @Post("/")
  createDeskAgents(@Body() deskAgent: createDeskAgentDto) {
    return DeskAgentService.createDeskAgent(deskAgent);
  }

  @Post("/delete")
  deleteDeskAgents(@Body() deskAgent: deleteDeskAgentsDto) {
    return DeskAgentService.deleteDeskAgents(deskAgent);
  }

  @Patch("/:id")
  updateDeskAgent(
    @Param("id") id: string,
    @Body() deskAgent: UpdateDeskAgentDto
  ) {
    return DeskAgentService.updateDeskAgent(id, deskAgent);
  }

  @Delete("/event/:eventId")
  deleteDeskAgentByEventId(@Param("eventId") eventId: string) {
    return DeskAgentService.deleteDeskAgentsByEventId(eventId);
  }

  @Delete("/:id")
  deleteDeskAgent(@Param("id") id: string) {
    return DeskAgentService.deleteDeskAgent(id);
  }

}
