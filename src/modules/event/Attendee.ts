import { randomUUID } from "crypto";

export class Attendee {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string; //optional
    isInvited: boolean;
    hasAttended: boolean;
    constructor(name: string, email: string, isInvited: boolean, hasAttended: boolean, phoneNumber?: string) {
        this.id = randomUUID();
        this.name = name;
        this.email = email;
        if (phoneNumber) {
            this.phoneNumber = phoneNumber;
        }
        this.isInvited = isInvited;
        this.hasAttended = hasAttended;
    }
}
