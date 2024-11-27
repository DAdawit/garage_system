import { IsEmail, IsEnum, Min, MinLength, min } from "class-validator";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  AfterLoad,
} from "typeorm";
import { Roles } from "../Types";
import { getBaseUrl } from "../utils/host";

@Entity("users")
export class User extends BaseEntity {
  // private _profilePicUrl!: string;

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  @IsEmail()
  email!: string;

  @Column()
  @MinLength(2)
  firstName!: string;

  @Column()
  @MinLength(2)
  lastName!: string;

  @Column({ nullable: true })
  profilePic!: string;

  // @AfterLoad()
  // loadImagePath() {
  //   const baseUrl = getBaseUrl();
  //   this._profilePicUrl = baseUrl + this.profilePic;
  // }

  @Column({ default: true })
  isActive!: boolean;

  @Column()
  @MinLength(5)
  password!: string;

  @Column({ type: "enum", enum: Roles, default: Roles.customer })
  @IsEnum(Roles)
  role!: Roles;

  // @OneToMany(() => Review, (review) => review.user, { onDelete: "SET NULL" })
  // review!: Review[];

  // @OneToMany(() => Order, (order) => order.user, { onDelete: "RESTRICT" })
  // order!: Order[];

  // @OneToMany(() => Cart, (cart) => cart.user)
  // cart!: Cart[];

  // @OneToMany(() => Wishlist, (wishlist) => wishlist.user)
  // wishlist!: Wishlist[];

  // @OneToMany(() => ReportedMenu, (menu) => menu.user)
  // reportProduct!: ReportedMenu[];

  // @OneToMany(() => DeliveryAddress, (deliverAddress) => deliverAddress.user, {
  //   onDelete: "SET NULL",
  // })
  // deliveryAddress!: DeliveryAddress;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
