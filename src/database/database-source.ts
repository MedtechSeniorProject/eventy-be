import dotenv from "dotenv";
import { DataSource } from "typeorm"
import { Superadmin } from "../modules/superadmin/superadmin.entity";

dotenv.config()

export const dataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    entities: [Superadmin],
    //logging: true,
    synchronize: true,
})