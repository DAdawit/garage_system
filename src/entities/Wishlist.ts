import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Menu } from "./Menu";

@Entity("wishlists")
export class Wishlist extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.cart, { onDelete: "CASCADE" })
  user!: User;

  @ManyToOne(() => Menu, (product) => product.cart, { onDelete: "CASCADE" })
  product!: Menu;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
