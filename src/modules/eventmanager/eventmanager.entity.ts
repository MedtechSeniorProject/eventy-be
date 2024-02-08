import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class EventManager {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;
}
