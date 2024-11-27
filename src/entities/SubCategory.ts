import {
  AfterLoad,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Category } from "./Category";
import { MinLength } from "class-validator";
import { Menu } from "./Menu";
import { getBaseUrl } from "../utils/host";

@Entity("subCategories")
export class SubCategory extends BaseEntity {
  private imageUrl!: string;

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @MinLength(2)
  name!: string;

  @ManyToOne(() => Category, (category) => category.subCategory, {
    onDelete: "CASCADE",
  })
  category!: Category;

  @Column()
  image!: string;

  @AfterLoad()
  loadImagePath() {
    const baseUrl = getBaseUrl();
    this.imageUrl = baseUrl + this.image;
  }

  @OneToMany(() => Menu, (menu) => menu.subCategory)
  menu!: Menu;

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
