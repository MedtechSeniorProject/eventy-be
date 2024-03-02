import "reflect-metadata";
import EventService from "./event.service";
import {
    Body,
    Get,
    JsonController,
    Post,
    Req,
    UseBefore,
} from "routing-controllers";
import { CheckAutheticated } from "../auth/jwt.middleware";
// ... existing imports
// ... existing imports

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
    createEvent(@Body() event: any, @Req() request: any) {
        event.eventManager = request.user.userId;
        return EventService.createEvent(event);
    }

}
