import { IsString, IsDateString, IsOptional } from "class-validator";

export class UpdateEventDto {
  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsDateString()
  @IsOptional()
  readonly time?: Date;

}
