import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class createDeskAgentDto {
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @IsNotEmpty()
  @IsUUID()
  readonly eventId: string;
}
