import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Event } from "../event/event.entity";

@Entity()
export class DeskAgent {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  username: string;

  @Column({ select: false })
  password: string;

  @ManyToOne(() => Event, (event) => event.deskAgents, { onDelete: "CASCADE" })
  event: Event;
}
