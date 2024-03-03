import "reflect-metadata";
import EventService from "./event.service";
import {
    Body,
    Get,
    JsonController,
    Param,
    Patch,
    Post,
    Req,
    UseBefore,
} from "routing-controllers";
import { CheckAutheticated } from "../auth/jwt.middleware";
import { CreateEventDto } from "./dto/create-event.dto";

@JsonController("/events")
export class EventController {
    @Get("/")
    // @UseBefore(CheckAutheticated)
    getEvents(){
        return EventService.getEvents();
    }

    @Get("/withEventManagers")
    // @UseBefore(CheckAutheticated)
    getEventsWithEventManagers(){
        return EventService.getEventsWithEventManagers();
    }

    @Get("/archived")
    // @UseBefore(CheckAutheticated)
    getArchivedEvents(){
        return EventService.getArchivedEvents();
    }
    
    @Get("/upcoming")
    // @UseBefore(CheckAutheticated)
    getUpcomingEvents(){
        return EventService.getUpcomingEvents();
    }

    @Post("/")
    @UseBefore(CheckAutheticated)
    createEvent(@Body() event: CreateEventDto, @Req() request: any) {
        return EventService.createEvent(event, request.user.userId);
    }

    @Patch("/toggleArchive/:id")
    @UseBefore(CheckAutheticated)
    toggleArchiveEvent(@Param("id") id: string) {
        return EventService.toggleArchiveEvent(id);
    }

    @Get("/attendees/:id")
    @UseBefore(CheckAutheticated)
    getAttendees(@Param("id") id: string) {
        return EventService.getAttendeesById(id);
    }


}
