import { IsNotEmpty, IsNumber, IsUUID, Max, Min } from "class-validator";

export class createDeskAgentDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(8)
  readonly numberOfDeskAgents: number;

  @IsNotEmpty()
  @IsUUID()
  readonly eventId: string;
}
