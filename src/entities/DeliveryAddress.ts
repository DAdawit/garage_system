import { Order } from "./Order";
import { OrderItem } from "./OrderItems";
import { User } from "./User";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("deliveryAddress")
export class DeliveryAddress extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fullName!: string;

  @Column()
  phoneNumber!: string;

  @Column()
  country!: string;

  @Column()
  city!: string;

  @Column()
  street!: string;

  @Column({ type: "double precision", nullable: true })
  lat!: number | null;

  @Column({ type: "double precision", nullable: true })
  long!: number | null;

  @OneToOne(() => Order, (order) => order.deliveryAddress, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  order!: Order | null;

  @ManyToOne(() => User, (user) => user.deliveryAddress, {
    onDelete: "SET NULL",
  })
  user!: User;

  @Column({ default: false })
  default!: boolean;

  @Column({ default: false })
  useCurrentLocation!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
