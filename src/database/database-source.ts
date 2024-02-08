import dotenv from "dotenv";
import { DataSource } from "typeorm"
import { Superadmin } from "../modules/superadmin/superadmin.entity";
import { EventManager } from "../modules/eventmanager/eventmanager.entity";
import { DeskAgent } from "../modules/deskagent/deskagent.entity";

dotenv.config()

export const dataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    entities: [Superadmin, EventManager, DeskAgent],
    //logging: true,
    synchronize: true,
})