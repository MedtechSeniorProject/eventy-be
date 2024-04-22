import { log } from "console";
import eventService from "../modules/event/event.service";
import eventmanagerService from "../modules/eventmanager/eventmanager.service";
import superadminService from "../modules/superadmin/superadmin.service";
import QuestionType from "../modules/event/dto/add-question.dto";

export const seedDatabase = async () => {
  console.log("IS_SEEDER", process.env.IS_SEEDER);
  if (process.env.IS_SEEDER != "true") {
    console.log("Not permitted to seed");
    return;
  }
  console.log("Seeding database");
  const defaultAdmin = await superadminService.getSuperAdminByEmail(
    "superadmin@superadmin.com"
  );
  if (!defaultAdmin) {
    console.log("Creating default superadmin");
    superadminService.createSuperAdmin({
      name: "superadmin",
      email: "superadmin@superadmin.com",
      password: "superadmin",
    });
  } else {
    return "Database already seeded";
  }
  const defaultEventManager = await eventmanagerService.getEventManagerByEmail(
    "eventmanager@eventmanager.com"
  );

  if (!defaultEventManager) {
    console.log("Creating default event manager");
    await eventmanagerService.createEventManager({
      name: "event manager",
      email: "eventmanager@eventmanager.com",
      password: "eventmanager",
    });
  }

  const eventManager = await eventmanagerService.getEventManagerByEmail(
    "eventmanager@eventmanager.com"
  );
  const eventManagerId = eventManager!!.id;

  const events = await eventService.getEvents();
  if (events.length === 0) {
    const oneDay = 24 * 60 * 60 * 1000;
    console.log("Creating default events");
    await eventService.createEvent(
      {
        name: "event1",
        description: "description for event 1",
        startTime: new Date(),
        endTime: new Date(new Date().getTime() + oneDay),
        latitude: 36.84536,
        longitude: 10.269075,
        address:
          "Mediterranean School of Business, Les Berges du Lac 2, Tunis, Tunisia",
      },
      eventManagerId
    );
    await eventService.createEvent(
      {
        name: "event2",
        description: "description for event 2",
        startTime: new Date(new Date().getTime() + oneDay),
        endTime: new Date(new Date().getTime() + oneDay * 2),
        latitude: 36.84536,
        longitude: 10.269075,
        address:
          "Mediterranean Institute of Technology, Les Berges du Lac 2, Tunis, Tunisia",
      },
      eventManagerId
    );
    await eventService.createEvent(
      {
        name: "event3",
        description: "description for event 3",
        startTime: new Date(new Date().getTime() + oneDay * 3),
        endTime: new Date(new Date().getTime() + oneDay * 3 + 7200000),
        latitude: 36.84536,
        longitude: 10.269075,
        address:
          "Languages and Cultures Institute, Les Berges du Lac 2, Tunis, Tunisia",
      },
      eventManagerId
    );
    console.log("Adding attendees to events");
    const events = await eventService.getEvents();
    console.log(events);
    const event1Id = events[0].id;
    const event2Id = events[1].id;
    const event3Id = events[2].id;
    await eventService.addAttendees(event1Id, [
      {
        name: "Jon Snow",
        email: "Jon.Snow@NightsWatch.wall",
        phoneNumber: "12345678",
      },
      {
        name: "Daenerys Targaryen",
        email: "Dany.targaryen@queen.westeros",
        phoneNumber: "87654321",
      },
      {
        name: "Tyrion Lannister",
        email: "TyrionLannis.ter@birds.com",
        phoneNumber: "12348765",
      },
      {
        name: "Arya Stark",
        email: "NoOne@FacelessMen.braavos",
        phoneNumber: "56781234",
      },
      {
        name: "Sansa Stark",
        email: "Lady.Sansa@Winterfell.north",
        phoneNumber: "87651234",
      },
      {
        name: "Cersei Lannister",
        email: "CerseiLioness@ironthrone.king",
        phoneNumber: "34561278",
      },
    ]);
    await eventService.addAttendees(event2Id, [
      {
        name: "Rachel Green",
        email: "Rachel.Green@centralperk.nyc",
        phoneNumber: "98765432",
      },
      {
        name: "Ross Geller",
        email: "DrRoss@paleontology.museum",
        phoneNumber: "23456789",
      },
      {
        name: "Monica Geller",
        email: "ChefMonica@javaroom.nyc",
        phoneNumber: "54328976",
      },
      {
        name: "Chandler Bing",
        email: "ChanandlerBong@transponster.office",
        phoneNumber: "67891234",
      },
      {
        name: "Joey Tribbiani",
        email: "JoeyT@soapopera.nyc",
        phoneNumber: "45678923",
      },
      {
        name: "Phoebe Buffay",
        email: "PhoebeBuffay@smellycat.nyc",
        phoneNumber: "89123456",
      },
    ]);
    await eventService.addAttendees(event3Id, [
      {
        name: "Sheldon Cooper",
        email: "DrCooper@caltech.physics",
        phoneNumber: "12345678",
      },
      {
        name: "Leonard Hofstadter",
        email: "Leonard@caltech.physics",
        phoneNumber: "87654321",
      },
      {
        name: "Penny",
        email: "Penny@cheesecake.factory",
        phoneNumber: "23456789",
      },
      {
        name: "Howard Wolowitz",
        email: "Howard@NASA.space",
        phoneNumber: "34567891",
      },
      {
        name: "Rajesh Koothrappali",
        email: "Raj@astrophysics.lab",
        phoneNumber: "78912345",
      },
      {
        name: "Amy Farrah Fowler",
        email: "Amy@neurobiology.lab",
        phoneNumber: "45678912",
      },
    ]);
    console.log("updating questions");
    await eventService.updateQuestions(event1Id, [
      {
        question:
          "How would you describe your overall experience at this event?",
        type: QuestionType.Input,
        isRequired: true,
      },
      {
        question: "Would you recommend this event to a friend?",
        type: QuestionType.Radio,
        options: ["Yes", "No"],
        isRequired: true,
      },
      {
        question: "Which workshop did you participate in?",
        type: QuestionType.Checkbox,
        isRequired: false,
        options: ["Workshop 1", "Workshop 2", "Workshop 3"],
      },
    ]);
  }
};
