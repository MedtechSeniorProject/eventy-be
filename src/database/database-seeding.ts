import eventmanagerService from "../modules/eventmanager/eventmanager.service";
import superadminService from "../modules/superadmin/superadmin.service";

export const seedDatabase = async () => {
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
  }
  const defaultEventManager = await eventmanagerService.getEventManagerByEmail(
    "eventmanager@eventmanager.com"
  );
  if (!defaultEventManager) {
    console.log("Creating default event manager");
    eventmanagerService.createEventManager({
      name: "event manager",
      email: "eventmanager@eventmanager.com",
      password: "eventmanager",
    });
  }
};
