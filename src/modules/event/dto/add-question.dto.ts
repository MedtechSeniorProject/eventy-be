import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AddQuestionDto {
    @IsNotEmpty()
    @IsString()
    readonly type: QuestionType;

    @IsOptional()
    @IsArray()
    readonly options: string[] | null;

    @IsNotEmpty()
    @IsString()
    readonly question: string;

    @IsNotEmpty()
    @IsBoolean()
    readonly isRequired: boolean;    
}

enum QuestionType {
    Input = "Input",
    Checkbox = "Checkbox",
    Radio = "Radio",
}

export default QuestionType;