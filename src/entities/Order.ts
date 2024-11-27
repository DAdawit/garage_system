import { OrderStatus } from "../Types";
import { DeliveryAddress } from "./DeliveryAddress";
import { OrderItem } from "./OrderItems";
import { User } from "./User";
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

@Entity("orders")
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  order_id!: string;

  @ManyToOne(() => User, (user) => user.order, {
    onDelete: "CASCADE",
  })
  user!: User;

  @OneToOne(() => DeliveryAddress, (deliveryAddress) => deliveryAddress.order, {
    onDelete: "SET NULL",
  })
  deliveryAddress!: DeliveryAddress;

  @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.placed })
  status!: OrderStatus;

  @Column({ default: false })
  paid!: boolean;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  ordersItems!: OrderItem[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
