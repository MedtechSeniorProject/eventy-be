import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Superadmin {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({ select: false })
  password: string;
}
