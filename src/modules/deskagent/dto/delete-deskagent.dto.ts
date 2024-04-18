import { IsNotEmpty, IsUUID } from "class-validator";

export class deleteDeskAgentDto {
  @IsNotEmpty()
  @IsUUID()
  readonly id: string;
}