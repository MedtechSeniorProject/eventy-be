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
import { UpdateEventDto } from "./dto/update-event.dto";
import { CheckRole } from "../auth/role.middleware";
import { ROLES } from "../auth/roles";
import { CheckInAttendeeDto } from "./dto/checkin-attendee.dto";

@JsonController("/events")
@UseBefore(CheckAutheticated)
export class EventController {
    @Get("/")
    getEvents() {
        return EventService.getEvents();
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

    @Get("/attendees/:id")
    getAttendees(@Param("id") id: string) {
        return EventService.getAttendeesById(id);
    }

    @Get("/:id")
    getEventById(@Param("id") id: string) {
        return EventService.getEventById(id);
    }

    @Patch("/toggleArchive/:id")
    toggleArchiveEvent(@Param("id") id: string) {
        return EventService.toggleArchiveEvent(id);
    }

    // @UseBefore(CheckRole([ROLES.deskagent]))
    @Patch("/attendee/:eventId/:attendeeId") //Will be used by desk agent to change hasAttended to true
    //TODO: remove eventId from params and use it directly from the payload
    checkInAttendee(
        @Param("eventId") eventId: string,
        @Body() attendeeId: CheckInAttendeeDto 
        ) {
        return EventService.checkInAttendee(eventId, attendeeId);
    }

    @Patch("/:id")
    updateEvent(@Param("id") id: string, @Body() event: UpdateEventDto) {
        return EventService.updateEvent(id, event);
    }

    @Post("/")
    createEvent(@Body() event: CreateEventDto, @Req() request: any) {
        return EventService.createEvent(event, request.user.userId);
    }

    @Post("/attendees/:id") //Will be used by event manager
    addAttendees(@Param("id") id: string, @Body() attendees: AddSingleAttendeeDto[]) {
        return EventService.addAttendees(id, attendees);
    }

    // @UseBefore(CheckRole([ROLES.deskagent]))
    @Post("/attendee/:eventId/") //Will be used by desk agent
    addAttendee(@Param("eventId") eventId: string, @Body() attendee: AddSingleAttendeeDto) {
        //TODO: remove eventId from params and use it directly from the payload when deskagent entity is updated
        return EventService.addAttendee(eventId, attendee);
    }


    @Post("/delete/:eventId/") //POST instead of DELETE because it is prefereable to use POST for delete requests with body
    deleteAttendees(@Param("eventId") eventId: string, @Body() attendeeIds: string[]) {
        return EventService.deleteAttendees(eventId, attendeeIds);
    }

    @Delete("/deleteAttendeesList/:id") //For testing purposes
    deleteAllAttendees(@Param("id") id: string) {
        return EventService.deleteAllAttendees(id);
    }

    @Delete("/:id")
    deleteEvent(@Param("id") id: string) {
        return EventService.deleteEvent(id);
    }

}
