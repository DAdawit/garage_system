import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Order } from "./Order";
import { Menu } from "./Menu";
import { Color } from "./Color";

@Entity("orderItems")
export class OrderItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  quantity!: number;

  @ManyToOne(() => Menu, (menu) => menu.orderItems, { onDelete: "CASCADE" })
  menu!: Menu[];

  @ManyToOne(() => Color, (color) => color.orderItem, {
    onDelete: "CASCADE",
    nullable: true,
  })
  color?: Color;

  @ManyToOne(() => Order, (order) => order.ordersItems, { onDelete: "CASCADE" })
  order!: Order;

  @Column({ nullable: false })
  subTotal!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
