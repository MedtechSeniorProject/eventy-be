import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class AddQuestionDto {
    @IsNotEmpty()
    @IsString()
    readonly type: QuestionType;

    @IsOptional()
    @IsArray()
    readonly options?: string[] | null;

    @IsNotEmpty()
    @IsString()
    readonly question: string;

    @IsNotEmpty()
    @IsBoolean()
    readonly isRequired: boolean;

    @IsOptional()
    @IsUUID()
    readonly id?: string;
}

enum QuestionType {
    Input = "Input",
    Checkbox = "Checkbox",
    Radio = "Radio",
}

export default QuestionType;