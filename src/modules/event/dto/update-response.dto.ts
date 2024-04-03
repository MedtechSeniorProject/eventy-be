import {
  IsArray,
  IsNotEmpty,
  IsUUID,
} from "class-validator";

export class updateResponseDto {
  @IsNotEmpty()
  @IsUUID()
  readonly id: string;

  @IsArray()
  readonly responses: any[];
}
