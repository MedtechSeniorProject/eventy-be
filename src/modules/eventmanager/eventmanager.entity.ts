import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
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
    select: false,
  })
  validationCode: string;

  @OneToMany(() => Event, (event) => event.eventManager)
  events: Event[];
}
