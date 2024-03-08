import { UnauthorizedError } from "routing-controllers";
import * as bcrypt from "bcrypt";
import superadminService from "../superadmin/superadmin.service";
import eventmanagerService from "../eventmanager/eventmanager.service";
import sessionService from "../session/session.service";
import { LoginDto } from "./dto/login.dto";
import { signToken } from "./jwt.util";
import mailingService from "../mailing/mailing.service";
import { ValidateDto } from "./dto/validate.dto";
import { ROLES } from "./roles";
import { DeskAgentLoginDto } from "./dto/deskagent_login.dto";
import deskagentService from "../deskagent/deskagent.service";

class AuthService {
  public async login(
    loginCredentials: LoginDto,
    ipAddress: string,
    userAgent: string
  ) {
    const superadmin = await superadminService.getSuperAdminWithPasswordByEmail(
      loginCredentials.email
    );
    if (!superadmin) {
      const eventmanager =
        await eventmanagerService.getEventManagerWithPasswordByEmail(
          loginCredentials.email
        );
      if (!eventmanager) {
        throw new UnauthorizedError("Invalid email or password");
      }
      const passwordMatch = await bcrypt.compare(
        loginCredentials.password,
        eventmanager.password
      );
      if (!passwordMatch) {
        throw new UnauthorizedError("Invalid email or password");
      }
      // if valid, create a random validation code and email it to user
      // const validationCode = Math.random().toString(36).substring(2, 15);
      const validationCode = "123456";
      eventmanager.validationCode = validationCode;
      await eventmanagerService.updateEventManager(eventmanager.id, {
        validationCode: validationCode,
      });
      /*mailingService.sendMail(
        eventmanager.email,
        "Eventy - Login Validation code",
        `Hi ! <br> Here's your validation code ! <br> Code : <h1>${validationCode}</h1> <br> Please submit this code in the next 5 minutes. <br> <br> Eventy No-reply`
      );*/
      return {
        message: "Validation code sent to email",
      };
    }
    const passwordMatch = await bcrypt.compare(
      loginCredentials.password,
      superadmin.password
    );
    if (!passwordMatch) {
      throw new UnauthorizedError("Invalid email or password");
    }
    const sessionKey = await sessionService.createSession(
      superadmin.id,
      ipAddress,
      userAgent
    );
    const accessToken = signToken({
      sessionKey,
      userId: superadmin.id,
      role: ROLES.superadmin,
    });
    const { password, ...superadminWithoutPassword } = superadmin;
    return {
      accessToken,
      superadmin: superadminWithoutPassword,
    };
  }

  public async validateLogin(
    validateDto: ValidateDto,
    ipAddress: string,
    userAgent: string
  ) {
    const { email, validationCode } = validateDto;
    const eventManager = await eventmanagerService.getEventManagerByEmail(
      email
    );
    if (!eventManager) {
      throw new UnauthorizedError("Invalid code");
    }
    if (eventManager.validationCode !== validationCode) {
      throw new UnauthorizedError("Invalid code");
    }
    eventManager.validationCode = "";
    await eventmanagerService.updateEventManager(eventManager.id, eventManager);
    const sessionKey = await sessionService.createSession(
      eventManager.id,
      ipAddress,
      userAgent
    );
    const accessToken = signToken({
      sessionKey,
      userId: eventManager.id,
      role: ROLES.eventmanager,
    });
    return {
      accessToken,
      eventManager,
    };
  }

  public async extendSession(sessionKey: string) {
    await sessionService.extendSession(sessionKey);
  }

  public async resendValidationCode(email: string) {
    const eventManager = await eventmanagerService.getEventManagerByEmail(
      email
    );
    if (!eventManager || eventManager.validationCode == "") {
      throw new UnauthorizedError("Invalid email");
    }
    // const validationCode = Math.random().toString(36).substring(2, 15);
    const validationCode = "123456";
    eventManager.validationCode = validationCode;
    await eventmanagerService.updateEventManager(eventManager.id, eventManager);
    /* mailingService.sendMail(
      eventManager.email,
      "Eventy - Login Validation code",
      `Hi ! <br> Here's your validation code ! <br> Code : <h1>${validationCode}</h1>`
    ); */
    return {
      message: "Validation code sent to email",
    };
  }

  public async deskAgentLogin(loginCredentials: DeskAgentLoginDto) {
    const deskAgent = await deskagentService.getDeskAgentWithPasswordByUsername(
      loginCredentials.username
    );
    if (!deskAgent) {
      throw new UnauthorizedError("Invalid username or password");
    }
    if (deskAgent.event.isArchived) {
      throw new UnauthorizedError("Event is over");
    }
    const passwordMatch = await bcrypt.compare(
      loginCredentials.password,
      deskAgent.password
    );
    if (!passwordMatch) {
      throw new UnauthorizedError("Invalid username or password");
    }
    const { password, ...deskAgentWithoutPassword } = deskAgent;
    return {
      deskAgent: deskAgentWithoutPassword,
    };
  }
}

export default new AuthService();
