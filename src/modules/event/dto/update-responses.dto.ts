import { ArrayNotEmpty, IsArray } from "class-validator";
import { updateResponseDto } from "./update-response.dto";

export class UpdateResponsesDto {
    @IsArray()
    @ArrayNotEmpty()
    readonly responses: updateResponseDto[];
}