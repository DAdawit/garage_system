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
import { OrderItem } from "./OrderItems";
import { Cart } from "./Cart";

@Entity("colors")
export class Color extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  quantity!: string;

  @OneToMany(() => Cart, (cart) => cart.color)
  cart!: Cart[];

  @OneToOne(() => OrderItem, (orderItem) => orderItem.color)
  orderItem!: OrderItem;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
