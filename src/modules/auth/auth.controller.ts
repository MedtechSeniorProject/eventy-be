import "reflect-metadata";
import {
  Body,
  CookieParam,
  JsonController,
  Post,
  Req,
} from "routing-controllers";
import { LoginDto } from "./dto/login.dto";
import authService from "./auth.service";
import { ValidateDto } from "./dto/validate.dto";
import { ExtendDto } from "./dto/extend.dto";

@JsonController("/auth")
export class AuthController {
  @Post("/login")
  login(@Body() loginCredentials: LoginDto, @Req() request: any) {
    const ipAddress =
      request.headers["x-forwarded-for"] || request.connection.remoteAddress;
    const userAgent = request.headers["user-agent"];
    return authService.login(loginCredentials, ipAddress, userAgent);
  }

  @Post("/validate")
  validate(@Body() validateDto: ValidateDto, @Req() request: any) {
    const ipAddress =
      request.headers["x-forwarded-for"] || request.connection.remoteAddress;
    const userAgent = request.headers["user-agent"];
    return authService.validateLogin(validateDto, ipAddress, userAgent);
  }

  @Post("/resend")
  resendValidation(@Body() validateDto: ValidateDto) {
    return authService.resendValidationCode(validateDto.email);
  }


  @Post("/extend")
  extendSession(@Body() extendDto: ExtendDto) {
    return authService.extendSession(extendDto.sessionKey);
  }
}
