import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Menu } from "./Menu";
import { Color } from "./Color";

@Entity("carts")
export class Cart extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    default: 1,
  })
  quantity!: number;

  @ManyToOne(() => User, (user) => user.cart, { onDelete: "CASCADE" })
  user!: User;

  @ManyToOne(() => Menu, (Menu) => Menu.cart, { onDelete: "CASCADE" })
  menu!: Menu;

  @ManyToOne(() => Color, (color) => color.cart, {
    onDelete: "CASCADE",
    nullable: true,
  })
  color?: Color;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
