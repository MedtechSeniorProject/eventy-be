import "reflect-metadata";
import EventService from "./event.service";
import {
    Body,
    Delete,
    Get,
    JsonController,
    Param,
    Patch,
    Post,
} from "routing-controllers";
import { CreateEventDto } from "./dto/create-event.dto";
import { log } from "console";

@JsonController("/events")
export class EventController {
    @Get("/")
    getEvents() {
        return EventService.getEvents();
    }


    @Post("/")
    createEvent(@Body() event: CreateEventDto) {
        return EventService.createEvent(event);
    }

}
