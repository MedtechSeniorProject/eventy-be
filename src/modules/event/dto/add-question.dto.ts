import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AddQuestionDto {
    @IsNotEmpty()
    @IsString()
    readonly type: string;

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
