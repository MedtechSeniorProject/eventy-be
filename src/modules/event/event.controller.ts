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

    @Post("/")
    @UseBefore(CheckAutheticated)
    createEvent(@Body() event: any, @Req() request: any) {
        event.eventManager = request.user.userId;
        console.log("printing event:" + event);
        return EventService.createEvent(event);
    }
}
