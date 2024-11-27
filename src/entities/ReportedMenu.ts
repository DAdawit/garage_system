import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Menu } from "./Menu";
import { MinLength } from "class-validator";
import { ReviewStatus } from "../Types";

@Entity("reportedMenues")
export class ReportedMenu extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({})
  @MinLength(2)
  message!: string;

  @Column({ type: "enum", enum: ReviewStatus, default: ReviewStatus.OnReview })
  status!: ReviewStatus;

  @ManyToOne(() => User, (user) => user.reportProduct, {
    nullable: true,
    onDelete: "CASCADE",
  })
  user!: User;

  @ManyToOne(() => Menu, (menu) => menu.reportMenu, {
    onDelete: "CASCADE",
  })
  menu!: Menu;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
