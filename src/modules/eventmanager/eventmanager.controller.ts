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
} from "routing-controllers";
import { CreateEventManagerDto } from "./dto/create-eventmanager.dto";
import { UpdateEventManagerDto } from "./dto/update-eventmanager.dto";
import { EventManager } from "./eventmanager.entity";


@JsonController("/eventmanager") // TODO: Compare this with the @Controller() decorator from SuperAdminController
export class EventManagerController {
  @Get("/")
  getEventManagers() {
    return EventManagerService.getEventManager();
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
  updateEventManager(@Param("id") id: string, @Body() eventManager: UpdateEventManagerDto) {
    return EventManagerService.updateEventManager(id, eventManager);
  }

  @Delete("/:id")
  deleteEventManager(@Param("id") id: string) {
    return EventManagerService.deleteEventManager(id);
  }
}
