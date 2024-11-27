import { MinLength } from "class-validator";
import {
  AfterLoad,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
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
import { SubCategory } from "./SubCategory";
import { Menu } from "./Menu";
import { getBaseUrl } from "../utils/host";

@Entity("categories")
export class Category extends BaseEntity {
  private imageUrl!: string;

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @MinLength(2)
  name!: string;

  @Column()
  image!: string;

  @AfterLoad()
  loadImagePath() {
    const baseUrl = getBaseUrl();
    this.imageUrl = baseUrl + this.image;
  }

  @OneToMany(() => Menu, (Menu) => Menu.category)
  menu!: Menu[];

  @OneToMany(() => SubCategory, (subCategory) => subCategory.category)
  subCategory!: SubCategory[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @BeforeInsert()
  @BeforeUpdate()
  convertNameToLowercase(): void {
    this.name = this.name.toLowerCase();
  }
}
