import { IsString, IsDateString, IsOptional, IsLongitude, IsLatitude, IsNotEmpty } from "class-validator";

export class UpdateEventDto {
  @IsString()
  @IsNotEmpty()
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
  @IsString()
  readonly address: string;


  @IsOptional()
  @IsDateString()
  readonly startTime: Date;

  @IsOptional()
  @IsDateString()
  readonly endTime: Date;

  @IsString()
  @IsOptional()
  readonly emailTemplate: string;
}
