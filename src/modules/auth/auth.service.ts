import { BadRequestError } from "routing-controllers";
import * as bcrypt from "bcrypt";
import superadminService from "../superadmin/superadmin.service";
import eventmanagerService from "../eventmanager/eventmanager.service";
import sessionService from "../session/session.service";
import { LoginDto } from "./dto/login.dto";
import { signToken } from "./jwt.util";
import mailingService from "../mailing/mailing.service";
import { ValidateDto } from "./dto/validate.dto";

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
        return new BadRequestError("Invalid email or password");
      }
      const passwordMatch = await bcrypt.compare(
        loginCredentials.password,
        eventmanager.password
      );
      if (!passwordMatch) {
        return new BadRequestError("Invalid email or password");
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
      return new BadRequestError("Invalid email or password");
    }
    const sessionKey = await sessionService.createSession(
      superadmin.id,
      ipAddress,
      userAgent
    );
    const accessToken = signToken({
      sessionKey,
      userId: superadmin.id,
    });
    const { password, ...superadminWithoutPassword } = superadmin;
    return {
      accessToken,
      superadminWithoutPassword,
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
      return new BadRequestError("Invalid code");
    }
    if (eventManager.validationCode !== validationCode) {
      return new BadRequestError("Invalid code");
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
      return new BadRequestError("Invalid email");
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
}

export default new AuthService();
