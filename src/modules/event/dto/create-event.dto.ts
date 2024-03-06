import { IsNotEmpty, IsString, IsDateString } from "class-validator";

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsDateString()
  readonly time: Date;

}
