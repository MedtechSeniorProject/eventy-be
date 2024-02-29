import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { EventManager } from "../eventmanager/eventmanager.entity";

@Entity()
export class Event {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({
    type: "timestamptz",
  })
  time: Date; 

  @Column({
    nullable: false,
    default: false
  })
  isArchived: boolean;
  
  @Column({
    type: "json",
    array: true,
    default: []
  })
  attendees: object[];

  @ManyToOne(() => EventManager, (eventManager) => eventManager.events)
    eventManager: EventManager;

}
