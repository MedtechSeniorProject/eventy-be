import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Superadmin {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;
}
