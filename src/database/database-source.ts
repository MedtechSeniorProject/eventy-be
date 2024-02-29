import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { Superadmin } from "../modules/superadmin/superadmin.entity";
import { DeskAgent } from "../modules/deskagent/deskagent.entity";
import { EventManager } from "../modules/eventmanager/eventmanager.entity";
import { Session } from "../modules/session/session.entity";
import { Event } from "../modules/event/event.entity";

dotenv.config();

export const dataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [Superadmin, EventManager, DeskAgent, Session, Event],
  //logging: true,
  synchronize: true,
});
