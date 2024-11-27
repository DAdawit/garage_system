import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Menu } from "./Menu";
import { User } from "./User";
import { ReviewStatus } from "../Types";
import { Max, Min } from "class-validator";

@Entity("reviews")
export class Review extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @Min(1)
  @Max(5)
  rate!: number;

  @Column({ nullable: true })
  comment!: string;

  @Column({ default: false })
  visible!: boolean;

  @Column({ default: false })
  edited!: boolean;

  @Column({ type: "enum", enum: ReviewStatus, default: ReviewStatus.OnReview })
  status!: ReviewStatus;

  @ManyToOne(() => Menu, (menu) => menu.review, {
    onDelete: "CASCADE",
  })
  menu!: Menu;

  @ManyToOne(() => User, (user) => user.review, { onDelete: "CASCADE" })
  user!: User;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
