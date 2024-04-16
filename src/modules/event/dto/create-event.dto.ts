import { IsNotEmpty, IsString, IsDateString, IsLatitude, IsLongitude } from "class-validator";

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsLongitude()
  readonly longitude: number;

  @IsNotEmpty()
  @IsLatitude()
  readonly latitude: number;

  @IsNotEmpty()
  @IsString()
  readonly address: string;


  @IsNotEmpty()
  @IsDateString()
  readonly startTime: Date;

  @IsNotEmpty()
  @IsDateString()
  readonly endTime: Date;

}
