import { BadRequestError } from "routing-controllers";
import * as bcrypt from "bcrypt";
import superadminService from "../superadmin/superadmin.service";
import sessionService from "../session/session.service";
import { LoginDto } from "./dto/login.dto";
import { signToken } from "./jwt.util";

class AuthService {
  public async login(loginCredentials: LoginDto) {
    const superadmin = await superadminService.getSuperAdminWithPasswordByEmail(
      loginCredentials.email
    );
    if (!superadmin) {
      return new BadRequestError("Invalid email or password");
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
      "",
      ""
    );
    const accessToken = signToken({
      sessionKey,
      userId: superadmin.id,
    });
    return {
      accessToken,
      superadmin,
    };
  }
  
  public async extendSession(sessionKey: string) {
    await sessionService.extendSession(sessionKey);
  }
}

export default new AuthService();
