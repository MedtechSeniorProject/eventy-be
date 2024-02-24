import { Request, Response } from "express";
import dotenv from "dotenv";
import { dataSource } from "./database/database-source";
import { seedDatabase } from "./database/database-seeding";
import { createExpressServer } from "routing-controllers";
import { SuperAdminController } from "./modules/superadmin/superadmin.controller";
import { AuthController } from "./modules/auth/auth.controller";
import { DeskAgentController } from "./modules/deskagent/deskagent.controller";
import { EventManagerController } from "./modules/eventmanager/eventmanager.controller";

dotenv.config();

dataSource
  .initialize()
  .then(() => {
    console.log("Connection to database has been established successfully.");
    seedDatabase();
  })
  .catch((err) => {
    console.error("Error during database connection:", err);
  });

const port = process.env.PORT || 3001;

const app = createExpressServer({
  controllers: [
    SuperAdminController,
    EventManagerController,
    DeskAgentController,
    AuthController,
  ], // we specify controllers we want to use
});

app.get("/", (req: Request, res: Response) => {
  res.send("Eventy BE Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
