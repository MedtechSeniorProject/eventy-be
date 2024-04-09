import { randomUUID } from "crypto";

export class Attendee {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string; //optional
  isInvited: boolean;
  checkedInAt: Date | null = null;
  responses : any[] = [];
  constructor(
    name: string,
    email: string,
    isInvited: boolean,
    checkedInAt: Date | null,
    phoneNumber?: string
  ) {
    this.id = randomUUID();
    this.name = name;
    this.email = email;
    if (phoneNumber) {
      this.phoneNumber = phoneNumber;
    }
    this.isInvited = isInvited;
    this.checkedInAt = checkedInAt;
  }
}
