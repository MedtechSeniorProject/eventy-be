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
import { AddQuestionDto } from "./dto/add-question.dto";
import { updateResponseDto } from "./dto/update-response.dto";

@JsonController("/events")
export class EventController {
  @UseBefore(CheckAutheticated)
  @Get("/")
  getEvents() {
    return EventService.getEvents();
  }

  @UseBefore(CheckAutheticated)
  @Get("/withEventManagers")
  getEventsWithEventManagers() {
    return EventService.getEventsWithEventManagers();
  }

  @UseBefore(CheckAutheticated)
  @Get("/archived")
  getArchivedEvents(@Req() request: any) {
    return EventService.getArchivedEvents(request.user.userId);
  }

  @UseBefore(CheckAutheticated)
  @Get("/upcoming")
  getUpcomingEvents(@Req() request: any) {
    return EventService.getUpcomingEvents(request.user.userId);
  }

  @UseBefore(CheckAutheticated)
  @Get("/myEvents")
  getMyEvents(@Req() request: any) {
    return EventService.getMyEvents(request.user.userId);
  }

  @UseBefore(CheckAutheticated)
  @Get("/attendees/:id")
  getAttendees(@Param("id") id: string) {
    return EventService.getAttendeesById(id);
  }

  @Get("/questions/:eventId/:attendeeId")
  getQuestions(
    @Param("eventId") eventId: string,
    @Param("attendeeId") attendeeId: string
  ) {
    return EventService.getQuestions(eventId, attendeeId);
  }

  @UseBefore(CheckAutheticated)
  @Get("/:id")
  getEventById(@Param("id") id: string) {
    return EventService.getEventById(id);
  }
  @UseBefore(CheckAutheticated)
  @Patch("/toggleArchive/:id")
  toggleArchiveEvent(@Param("id") id: string) {
    return EventService.toggleArchiveEvent(id);
  }

  @UseBefore(CheckAutheticated)
  // @UseBefore(CheckRole([ROLES.deskagent]))
  @Patch("/attendee/:eventId/")
  checkInAttendee(
    @Param("eventId") eventId: string,
    @Body() attendeeId: CheckInAttendeeDto
  ) {
    return EventService.checkInAttendee(eventId, attendeeId);
  }

  @UseBefore(CheckAutheticated)
  @Patch("/sendInvites/:id")
  sendInvites(@Param("id") id: string) {
    return EventService.sendInvites(id);
  }

  @UseBefore(CheckAutheticated)
  @Patch("/sendEvaluation/:id")
  sendEvalForm(@Param("id") id: string) {
    return EventService.sendEvaluationForm(id);
  }

  @UseBefore(CheckAutheticated)
  @Patch("/:id")
  updateEvent(@Param("id") id: string, @Body() event: UpdateEventDto) {
    return EventService.updateEvent(id, event);
  }

  @UseBefore(CheckAutheticated)
  @Post("/")
  createEvent(@Body() event: CreateEventDto, @Req() request: any) {
    return EventService.createEvent(event, request.user.userId);
  }

  @UseBefore(CheckAutheticated)
  @Post("/attendees/:id") //Will be used by event manager
  addAttendees(
    @Param("id") id: string,
    @Body() attendees: AddSingleAttendeeDto[]
  ) {
    return EventService.addAttendees(id, attendees);
  }

  @UseBefore(CheckAutheticated) // @UseBefore(CheckRole([ROLES.deskagent]))
  @Post("/attendee/:eventId/") //Will be used by desk agent
  addAttendee(
    @Param("eventId") eventId: string,
    @Body() attendee: AddSingleAttendeeDto
  ) {
    //TODO: remove eventId from params and use it directly from the payload when deskagent entity is updated
    return EventService.addAttendee(eventId, attendee);
  }

  @UseBefore(CheckAutheticated)
  @Post("/delete/:eventId/") //POST instead of DELETE because it is prefereable to use POST for delete requests with body
  deleteAttendees(
    @Param("eventId") eventId: string,
    @Body() attendeeIds: string[]
  ) {
    return EventService.deleteAttendees(eventId, attendeeIds);
  }

  @UseBefore(CheckAutheticated)
  @Post("/questions/:eventId")
  updateQuestions(
    @Param("eventId") eventId: string,
    @Body() questions: AddQuestionDto[]
  ) {
    return EventService.updateQuestions(eventId, questions);
  }

  @Post("/responses/:eventId/:attendeeId")
  updateResponses(
    @Param("eventId") eventId: string,
    @Param("attendeeId") attendeeId: string,
    @Body() responses: updateResponseDto[]
  ) {
    return EventService.updateResponses(eventId, attendeeId, responses);
  }

  @UseBefore(CheckAutheticated)
  @Delete("/deleteAttendeesList/:id") //For testing purposes
  deleteAllAttendees(@Param("id") id: string) {
    return EventService.deleteAllAttendees(id);
  }

  @UseBefore(CheckAutheticated)
  @Delete("/:id")
  deleteEvent(@Param("id") id: string) {
    return EventService.deleteEvent(id);
  }
}
