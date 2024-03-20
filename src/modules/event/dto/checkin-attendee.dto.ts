import { IsNotEmpty, IsUUID } from "class-validator";

export class CheckInAttendeeDto {
    
    @IsNotEmpty()
    @IsUUID()
    readonly attendeeId: string;
    
}
