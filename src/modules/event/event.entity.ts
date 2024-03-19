import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { EventManager } from "../eventmanager/eventmanager.entity";
import { Attendee } from "./Attendee";
import { DeskAgent } from "../deskagent/deskagent.entity";

@Entity()
export class Event {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  longitude: number;

  @Column()
  latitude: number;

  @Column()
  address: string;

  @Column({
    type: "timestamptz",
  })
  startTime: Date;

  @Column({
    type: "timestamptz",
  })
  endTime: Date;

  @Column({
    nullable: false,
    default: false,
  })
  isArchived: boolean;

  @Column({
    type: "jsonb",
    default: [],
  })
  attendees: Attendee[];

  @ManyToOne(() => EventManager, (eventManager) => eventManager.events)
  eventManager: EventManager;

  @OneToMany(() => DeskAgent, (deskAgent) => deskAgent.event)
  deskAgents: DeskAgent[];
}
