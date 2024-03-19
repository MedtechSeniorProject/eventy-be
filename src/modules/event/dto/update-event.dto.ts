import { IsString, IsDateString, IsOptional, IsLongitude, IsLatitude } from "class-validator";

export class UpdateEventDto {
  @IsString()
  @IsOptional()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly description: string;

  @IsOptional()
  @IsLongitude()
  readonly longitude: number;

  @IsOptional()
  @IsLatitude()
  readonly latitude: number;


  @IsOptional()
  @IsDateString()
  readonly startTime: Date;

  @IsOptional()
  @IsDateString()
  readonly endTime: Date;


}
