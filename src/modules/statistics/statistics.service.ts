import { BadRequestError, NotFoundError } from "routing-controllers";
import { dataSource } from "../../database/database-source";
import { Event } from "../event/event.entity";
import { EventManager } from "../eventmanager/eventmanager.entity";

class StatisticsService {
  private eventRepository = dataSource.getRepository(Event);
  private eventManagerRepository = dataSource.getRepository(EventManager);

  public async getEventStatistics(eventId: string) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });
    if (!event) {
      throw new NotFoundError("Event not found");
    }

    const numberOfAttendees = event.attendees.filter(
      (attendee) => attendee.checkedInAt !== null
    ).length;
    const numberOfInvitees = event.attendees.filter(
      (attendee) => attendee.isInvited
    ).length;

    const attendanceRate = this.getAttendanceRate(event);
    const onSpotAttendees = this.getOnSpotAttendees(event);
    const eventTimeline = this.getEventTimeline(event);

    return {
      numberOfAttendees,
      numberOfInvitees,
      attendanceRate,
      onSpotAttendees,
      eventTimeline,
    };
  }

  public async getEventManagerStatistics(
    eventManagerId: string,
    startingDate: Date,
    endingDate: Date
  ) {
    if (new Date(startingDate) > new Date(startingDate))
      throw new BadRequestError(
        "Starting date cannot be greater than ending date"
      );

    const eventManager = await this.eventManagerRepository.findOne({
      where: { id: eventManagerId },
      relations: ["events"],
    });
    if (!eventManager) {
      throw new NotFoundError("Event Manager not found");
    }
    const events = eventManager.events.filter(
      (event) =>
        new Date(event.createdAt) >= new Date(startingDate) &&
        new Date(event.createdAt) <= new Date(endingDate)
    );

    const numberOfEvents = events.length;
    const numberOfAttendees = events.reduce(
      (acc, event) =>
        acc +
        event.attendees.filter((attendee) => attendee.checkedInAt != null)
          .length,
      0
    );
    const numberOfInvitees = events.reduce(
      (acc, event) =>
        acc + event.attendees.filter((attendee) => attendee.isInvited).length,
      0
    );
    const averageAttendanceRate =
      events.reduce((acc, event) => acc + this.getAttendanceRate(event), 0) /
      events.length;
    const onSpotAttendees = events.reduce(
      (acc, event) => acc + this.getOnSpotAttendees(event).length,
      0
    );
    const top3EventsByNumberOfAttendees = events
      .filter(
        (event) =>
          event.attendees.filter((attendee) => attendee.checkedInAt != null)
            .length > 0
      )
      .sort((a, b) => {
        return (
          b.attendees.filter((attendee) => attendee.checkedInAt != null)
            .length -
          a.attendees.filter((attendee) => attendee.checkedInAt != null).length
        );
      })
      .map((event) => {
        return {
          name: event.name,
          id: event.id,
          numberOfAttendees: event.attendees.filter(
            (attendee) => attendee.checkedInAt != null
          ).length,
        };
      });

    return {
      numberOfEvents,
      numberOfAttendees,
      numberOfInvitees,
      averageAttendanceRate,
      onSpotAttendees,
      top3EventsByNumberOfAttendees,
    };
  }

  getAttendanceRate(event: Event) {
    const invitees = event.attendees.filter((attendee) => attendee.isInvited);
    const attendedInvitees = invitees.filter(
      (invitee) => invitee.checkedInAt != null
    );
    return parseFloat(attendedInvitees.length.toFixed(2)) / invitees.length;
  }
  getOnSpotAttendees(event: Event) {
    return event.attendees.filter((attendee) => !attendee.isInvited);
  }

  getEventTimeline(event: Event) {
    const attendees = event.attendees.filter(
      (attendee) => attendee.checkedInAt != null
    );
    const timeline = attendees.map((attendee) => {
      return attendee.checkedInAt;
    });
    return timeline;
  }
}

export default new StatisticsService() as StatisticsService;
