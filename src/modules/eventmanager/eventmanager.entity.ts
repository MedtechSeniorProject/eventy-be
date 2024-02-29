import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Event } from "../event/event.entity";

@Entity()
export class EventManager {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column({
    default: "",
    nullable: true,
  })
  validationCode: string;

  @ManyToOne(() => Event, (event) => event.eventManager)
  events: Event[]
}
