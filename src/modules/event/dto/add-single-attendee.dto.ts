import { IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString, MinLength } from "class-validator";

export class AddSingleAttendeeDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string;
    
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;
    
    @IsOptional()
    @IsNumberString()
    @MinLength(8)
    readonly phoneNumber?: string;
    
}