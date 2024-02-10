import "reflect-metadata";
import {
  Body,
  CookieParam,
  JsonController,
  Post,
} from "routing-controllers";
import { LoginDto } from "./dto/login.dto";
import authService from "./auth.service";

@JsonController("/auth")
export class AuthController {
  @Post("/login")
  login(@Body() loginCredentials: LoginDto) {
    return authService.login(loginCredentials);
  }
  @Post("/extend")
  extendSession(@CookieParam("session-key") sessionKey: string) {
    return "TODO"
  }
}
