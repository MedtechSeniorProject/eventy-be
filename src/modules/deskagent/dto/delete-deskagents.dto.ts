import { IsArray, IsNotEmpty, IsUUID, isNotEmpty } from "class-validator";

export class deleteDeskAgentsDto {
  @IsNotEmpty()
  @IsArray()
  @IsUUID()
  ids: string[];
}