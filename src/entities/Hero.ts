import { MinLength } from "class-validator";
import {
  AfterLoad,
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { getBaseUrl } from "../utils/host";

@Entity("heros")
export class Hero extends BaseEntity {
  private imageUrl!: string;

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  slogan!: string;

  @MinLength(2)
  @Column()
  title!: string;

  @Column()
  content!: string;

  @Column()
  image!: string;

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
