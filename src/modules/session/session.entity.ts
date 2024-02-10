import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Session {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  userId: string;

  @Column({
    type: "timestamptz",
  })
  startTime: Date;

  @Column({
    type: "timestamptz",
  })
  endTime: Date;

  @Column()
  ipAddress: string;

  @Column()
  userAgent: string;
}
