import {
  AfterLoad,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
  ValidateNested,
} from "class-validator";

import { Cart } from "./Cart";
import { Order } from "./Order";
import { OrderItem } from "./OrderItems";
import { Review } from "./Review";
import { ReportedMenu } from "./ReportedMenu";
import { SubCategory } from "./SubCategory";
import { Category } from "./Category";
import { getBaseUrl } from "../utils/host";
import { MealTime } from "../Types";
import { AvailableMealTime } from "./AvaliableMealTime";

@Entity("menues")
export class Menu extends BaseEntity {
  private _imageUrl!: string;

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @IsNotEmpty({ message: "Name should not be empty" })
  @IsString({ message: "Name must be a string" })
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column()
  @IsNumber({}, { message: "Price must be a number" })
  @Min(0, { message: "Price must be at least 0" })
  price!: number;

  @Column({ default: false })
  @IsBoolean({ message: "Special must be a boolean" })
  special!: boolean;

  @Column({ default: false })
  @IsOptional()
  mainDishes!: boolean;

  @Column({ nullable: true })
  @IsOptional()
  @IsString({ message: "Ingredients must be a string" })
  ingridiants!: string;

  @Column({ default: true })
  @IsBoolean({ message: "Available all day must be a boolean" })
  avaliable_all_day!: boolean;

  @Column({ nullable: true })
  image!: string;

  @AfterLoad()
  loadImagePath() {
    const baseUrl = getBaseUrl();
    this._imageUrl = baseUrl + this.image; // Construct the full image path after entity load
  }

  @ManyToMany(() => AvailableMealTime, (mealTime) => mealTime.menues)
  @JoinTable()
  available_meal_times!: AvailableMealTime[];

  @ManyToOne(() => Category, (category) => category.menu) // specify inverse side as a second parameter
  @ValidateNested({ message: "Category is required" })
  category!: Category;

  @ManyToOne(() => SubCategory, (subcategory) => subcategory.menu, {
    nullable: true,
  })
  subCategory!: SubCategory;

  @OneToMany(() => Cart, (cart) => cart.menu)
  cart!: Cart[];

  @OneToMany(() => Review, (review) => review.menu)
  review!: Review[];

  @OneToMany(() => ReportedMenu, (review) => review.menu)
  reportMenu!: ReportedMenu[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.menu, {
    onDelete: "RESTRICT",
  })
  orderItems!: OrderItem[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @BeforeInsert()
  @BeforeUpdate()
  convertNameToLowercase(): void {
    this.name = this.name.toLowerCase();
    if (this.description) {
      this.description = this.description.toLowerCase();
    }
    if (this.ingridiants) {
      this.ingridiants = this.ingridiants.toLowerCase();
    }
  }
}
