import { IsNotEmpty, IsString, IsEmail } from "class-validator";

export class ValidateDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly validationCode: string;
}
