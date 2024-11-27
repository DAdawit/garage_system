import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { MinLength } from "class-validator";

@Entity("phones")
export class Phone extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @MinLength(10)
  @Column()
  phoneNumber!: string;

  @Column({ default: false })
  verified!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
