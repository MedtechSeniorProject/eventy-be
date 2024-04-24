import eventService from "../modules/event/event.service";
import eventmanagerService from "../modules/eventmanager/eventmanager.service";
import superadminService from "../modules/superadmin/superadmin.service";
import QuestionType from "../modules/event/dto/add-question.dto";
import dotenv from "dotenv";

export const seedDatabase = async () => {
  const superadminPassword = process.env.SUPERADMIN_PASSWORD || "superadmin";
  const eventManagerPassword = process.env.EVENT_MANAGER_PASSWORD || "eventmanager";
  const superadminEmail = process.env.SUPERADMIN_EMAIL || "superadmin@superadmin.com";
  const eventManagerEmail = process.env.EVENT_MANAGER_EMAIL || "eventmanager@eventmanager.com";
  const superadminName = process.env.SUPERADMIN_NAME || "supeadmin";
  const eventManagerName = process.env.EVENT_MANAGER_NAME || "eventmanager";
  const responses = {
    0: [
      ["It was good"],
      ["It was bad"],
      ["I like it"],
      ["I hate it"],
      ["It was fun"],
      ["It was horrible"],
    ],
    1: [["Yes"], ["No"]],
    2: [
      ["Workshop 1"],
      ["Workshop 2"],
      ["Workshop 3"],
      ["Workshop 1", "Workshop 2"],
      ["Workshop 1", "Workshop 3"],
      ["Workshop 2", "Workshop 3"],
      ["Workshop 1", "Workshop 2", "Workshop 3"],
    ],
  };

  console.log("IS_SEEDER", process.env.IS_SEEDER);
  if (process.env.IS_SEEDER != "true") {
    console.log("Not permitted to seed");
    return;
  }
  console.log("Seeding database");
  const defaultAdmin = await superadminService.getSuperAdminByEmail(
    superadminEmail
  );
  if (!defaultAdmin) {
    console.log("Creating default superadmin");
    superadminService.createSuperAdmin({
      name: superadminName,
      email: superadminEmail,
      password: superadminPassword,
    });
  } else {
    return "Database already seeded";
  }
  const defaultEventManager = await eventmanagerService.getEventManagerByEmail(
    eventManagerEmail
  );

  if (!defaultEventManager) {
    console.log("Creating default event manager");
    await eventmanagerService.createEventManager({
      name: eventManagerName,
      email: eventManagerEmail,
      password: eventManagerPassword,
    });
  }

  const eventManager = await eventmanagerService.getEventManagerByEmail(
    eventManagerEmail
  );
  const eventManagerId = eventManager!!.id;

  let events = await eventService.getEvents();
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
    let events = await eventService.getEvents();
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
      {
        name: "Jaime Lannister",
        email: "jaimeLannister@kingsguard.king",
        phoneNumber: "34561278",
      },
      {
        name: "Bran Stark",
        email: "Bran.Stark@winterfell.north",
        phoneNumber: "34561278",
      },
      {
        name: "Brienne of Tarth",
        email: "Brienne@Tarth.west",
        phoneNumber: "34561278",
      },
      {
        name: "Samwell Tarly",
        email: "samwell.Tarly@citadelle.maesters",
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
      {
        name: "Janice",
        email: "Janice@yemen.omg",
      },
      {
        name: "Gunther",
        email: "Gunther@centralperk.nl",
        phoneNumber: "12345678",
      },
      {
        name: "Mike Hannigan",
        email: "Mike@Hannigan.com",
        phoneNumber: "87654321",
      },
      {
        name: "David",
        email: "david@schwimmer.com",
        phoneNumber: "12348765",
      },
      {
        name: "Ugly Naked Guy",
        email: "Ugly@naked.guy",
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
      {
        name: "Bernadette Rostenkowski",
        email: "Berny@Pharmaceutical.company",
        phoneNumber: "98761234",
      },
      {
        name: "Stuart Bloom",
        email: "Stuart@comicbookstore",
        phoneNumber: "23456789",
      },
      {
        name: "Emily Sweeney",
        email: "Emily@Sweeney.com",
        phoneNumber: "34567891",
      },
      {
        name: "Leslie Winkle",
        email: "Leslie@Winkle.com",
      },
    ]);
    console.log("updating questions");
    events = await eventService.getEvents();
    events.forEach(async function(event) {
      await eventService.updateQuestions(event.id , [
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
    });
  }

  console.log("checking attendees");
  console.log("events:");
  events = await eventService.getEvents();
  console.log(events);
  console.log("attendees:"); 
  console.log(events[0].attendees);
  for (const event of events) {
      for (const attendee of event.attendees) {
      const randomTime = Math.floor(Math.random() * (2 * 60 * 60 * 1000 - 60 * 1000) + 60 * 1000); // Generate random time between 1 minute and 2 hours in milliseconds
      const checkInTime = new Date(event.startTime.getTime() + randomTime);
      console.log("Checking in", attendee.name, "at", checkInTime);
      const  x  = await eventService.checkInAttendeeAt(event.id, attendee.id, checkInTime);
      console.log(x);
    };
  };

  console.log("Updating responses");
  events = await eventService.getEvents();
  for (const event of events) {
    for (const attendee of event.attendees) {
      await eventService.updateResponses(event.id, attendee.id, [
        {
          id: event.questions[0].id,
          responses:
            responses[0][Math.floor(Math.random() * responses[0].length)],
        },
        {
          id: event.questions[1].id,
          responses:
            responses[1][Math.floor(Math.random() * responses[1].length)],
        },
        {
          id: event.questions[2].id,
          responses:
            responses[2][Math.floor(Math.random() * responses[2].length)],
        },
      ]);
    }
  }

  console.log("Database seeded");
};
