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
import { request } from "http";
import { UpdateEventDto } from "./dto/update-event.dto";

@JsonController("/events")
@UseBefore(CheckAutheticated)
export class EventController {
    @Get("/")
    getEvents() {
        return EventService.getEvents();
    }

    @Get("/id/:id")
    getEventById(@Param("id") id: string) {
        return EventService.getEventById(id);
    }

    @Get("/withEventManagers")
    getEventsWithEventManagers() {
        return EventService.getEventsWithEventManagers();
    }

    @Get("/archived")
    getArchivedEvents(@Req() request: any) {
        return EventService.getArchivedEvents(request.user.userId);
    }

    @Get("/upcoming")
    getUpcomingEvents(@Req() request: any) {
        return EventService.getUpcomingEvents(request.user.userId);
    }

    @Get("/myEvents")
    getMyEvents(@Req() request: any) {
        return EventService.getMyEvents(request.user.userId);
    }

    @Post("/")
    createEvent(@Body() event: CreateEventDto, @Req() request: any) {
        return EventService.createEvent(event, request.user.userId);
    }

    @Patch("/:id")
    updateEvent(@Param("id") id: string, @Body() event: UpdateEventDto) {
        return EventService.updateEvent(id, event);
    }

    @Delete("/delete/:id")
    deleteEvent(@Param("id") id: string) {
        return EventService.deleteEvent(id);
    }

    @Patch("/toggleArchive/:id")
    toggleArchiveEvent(@Param("id") id: string) {
        return EventService.toggleArchiveEvent(id);
    }

    @Get("/attendees/:id")
    getAttendees(@Param("id") id: string) {
        return EventService.getAttendeesById(id);
    }

    @Post("/addSingleAttendee/:id")
    addSingleAttendee(@Param("id") id: string, @Body() attendee: AddSingleAttendeeDto) {
        return EventService.addSingleAttendee(id, attendee);
    }

    @Delete("/deleteAllAttendees/:id")
    deleteAllAttendees(@Param("id") id: string) {
        return EventService.deleteAllAttendees(id);
    }

    @Delete("/deleteSingleAttendee/:eventId/:attendeeId")
    deleteSingleAttendee(@Param("eventId") eventId: string, @Param("attendeeId") attendeeId: string){
        return EventService.deleteSingleAttendee(eventId, attendeeId);
    }


}
