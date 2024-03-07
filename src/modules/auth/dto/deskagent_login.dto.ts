import { IsNotEmpty, IsString } from "class-validator";

export class DeskAgentLoginDto {
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
