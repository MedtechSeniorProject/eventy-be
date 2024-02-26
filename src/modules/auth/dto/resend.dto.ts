import { IsNotEmpty, IsString, IsEmail } from "class-validator";

export class ResendDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;
}
