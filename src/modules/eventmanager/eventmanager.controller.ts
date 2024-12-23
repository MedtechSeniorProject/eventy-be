import "reflect-metadata";
import EventManagerService from "./eventmanager.service";
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
import { CreateEventManagerDto } from "./dto/create-eventmanager.dto";
import { UpdateEventManagerDto } from "./dto/update-eventmanager.dto";
import { CheckAutheticated } from "../auth/jwt.middleware";
import { CheckRole } from "../auth/role.middleware";
import { ROLES } from "../auth/roles";

@JsonController("/eventmanagers")
@UseBefore(CheckAutheticated, CheckRole([ROLES.superadmin]))
export class EventManagerController {
  @Get("/")
  getEventManagers() {
    return EventManagerService.getEventManagers();
  }

  @Get("/:id")
  getEventManagerById(@Param("id") id: string) {
    return EventManagerService.getEventManagerById(id);
  }

  @Post("/")
  createEventManager(@Body() EventManager: CreateEventManagerDto) {
    return EventManagerService.createEventManager(EventManager);
  }

  @Patch("/:id")
  updateEventManager(
    @Param("id") id: string,
    @Body() eventManager: UpdateEventManagerDto
  ) {
    return EventManagerService.updateEventManager(id, eventManager);
  }

  @Delete("/:id")
  deleteEventManager(@Param("id") id: string) {
    return EventManagerService.deleteEventManager(id);
  }
}
