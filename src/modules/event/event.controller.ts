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
    Req,
    UseBefore,
} from "routing-controllers";
import { CheckAutheticated } from "../auth/jwt.middleware";
import { CreateEventDto } from "./dto/create-event.dto";
import { AddSingleAttendeeDto } from "./dto/add-single-attendee.dto";

@JsonController("/events")
export class EventController {
    @Get("/")
    @UseBefore(CheckAutheticated)
    getEvents() {
        return EventService.getEvents();
    }

    @Get("/:id")
    @UseBefore(CheckAutheticated)
    getEventById(@Param("id") id: string) {
        return EventService.getEventById(id);
    }

    @Get("/withEventManagers")
    @UseBefore(CheckAutheticated)
    getEventsWithEventManagers() {
        return EventService.getEventsWithEventManagers();
    }

    @Get("/archived")
    @UseBefore(CheckAutheticated)
    getArchivedEvents() {
        return EventService.getArchivedEvents();
    }

    @Get("/upcoming")
    @UseBefore(CheckAutheticated)
    getUpcomingEvents() {
        return EventService.getUpcomingEvents();
    }

    @Get("/myEvents")
    @UseBefore(CheckAutheticated)
    getMyEvents(@Req() request: any) {
        return EventService.getMyEvents(request.user.userId);
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

    @Post("/addSingleAttendee/:id")
    @UseBefore(CheckAutheticated)
    addSingleAttendee(@Param("id") id: string, @Body() attendee: AddSingleAttendeeDto) {
        return EventService.addSingleAttendee(id, attendee);
    }

    @Delete("/deleteAllAttendees/:id")
    @UseBefore(CheckAutheticated)
    deleteAllAttendees(@Param("id") id: string) {
        return EventService.deleteAllAttendees(id);
    }

    @Delete("/deleteSingleAttendee/:eventId/:attendeeId")
    @UseBefore(CheckAutheticated)
    deleteSingleAttendee(@Param("eventId") eventId: string, @Param("attendeeId") attendeeId: string){
        return EventService.deleteSingleAttendee(eventId, attendeeId);
    }


}
