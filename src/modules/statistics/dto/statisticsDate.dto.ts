import { IsDateString } from "class-validator";

export class StatisticsDateDto {
  @IsDateString()
  readonly startTime: Date;

  @IsDateString()
  readonly endTime: Date;
}
