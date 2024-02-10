import dotenv from "dotenv";
import { DataSource } from "typeorm"

dotenv.config()

export const dataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    entities: ["{src, dist}/**/*.entity{.ts,.js}"],
    //logging: true,
    synchronize: true,
})