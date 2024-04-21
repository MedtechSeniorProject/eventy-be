import { ArrayNotEmpty, IsArray } from "class-validator";
import { AddSingleAttendeeDto } from "./add-single-attendee.dto";

export class AddAttendeesDto {
    @IsArray()
    @ArrayNotEmpty()
    readonly attendees: AddSingleAttendeeDto[];
}