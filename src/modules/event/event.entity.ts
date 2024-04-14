import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import { EventManager } from "../eventmanager/eventmanager.entity";
import { Attendee } from "./Attendee";
import { DeskAgent } from "../deskagent/deskagent.entity";
import Question from "./Question";

@Entity()
export class Event {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  createdAt: Date;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    type: "float",
  })
  longitude: number;

  @Column({
    type: "float",
  })
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
    nullable: true,
  })
  emailTemplate: string;

  @Column({
    nullable: true,
  })
  formTemplate: string;

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

  @Column({
    type: "jsonb",
    default: [],
  })
  questions: Question[];

  @ManyToOne(() => EventManager, (eventManager) => eventManager.events)
  eventManager: EventManager;

  @OneToMany(() => DeskAgent, (deskAgent) => deskAgent.event)
  deskAgents: DeskAgent[];
}
