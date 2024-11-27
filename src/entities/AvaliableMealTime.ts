import {
  AfterLoad,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Menu } from "./Menu";
import { Color } from "./Color";
import { MealTime } from "../Types";
import { getBaseUrl } from "../utils/host";

@Entity("availableMealTime")
export class AvailableMealTime extends BaseEntity {
  private imageUrl!: string;

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: MealTime;

  @Column({ nullable: true })
  image!: string;

  @ManyToMany(() => Menu, (menu) => menu.available_meal_times)
  menues!: Menu[];

  @AfterLoad()
  loadImagePath() {
    const baseUrl = getBaseUrl();
    this.imageUrl = baseUrl + this.image;
  }

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
