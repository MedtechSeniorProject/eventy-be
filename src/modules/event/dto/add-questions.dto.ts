import { ArrayNotEmpty, IsArray } from "class-validator";
import { AddQuestionDto } from "./add-question.dto";

export class AddQuestionsDto {
    @IsArray()
    @ArrayNotEmpty()
    readonly questions: AddQuestionDto[];
}