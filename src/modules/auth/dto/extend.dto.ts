import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class ExtendDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  readonly sessionKey: string;
}
