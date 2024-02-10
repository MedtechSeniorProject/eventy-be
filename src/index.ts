import { Request, Response } from "express";
import dotenv from 'dotenv'; 
import { dataSource } from "./database/database-source";
import { createExpressServer } from "routing-controllers";
import { SuperAdminController } from "./modules/superadmin/superadmin.controller";
import { AuthController } from "./modules/auth/auth.controller";

dotenv.config();

dataSource
  .initialize()
  .then(() => {
    console.log("Connection to database has been established successfully.");
  })
  .catch((err) => {
    console.error("Error during database connection:", err);
  });

const port = process.env.PORT || 3001;

const app = createExpressServer({
  controllers: [SuperAdminController,AuthController], // we specify controllers we want to use
});

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
