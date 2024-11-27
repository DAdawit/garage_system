import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { IsEmail, IsEmpty, IsNotEmpty, MinLength } from "class-validator";

@Entity("profiles")
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @IsNotEmpty({ message: "Name is required!" })
  @Column()
  name!: string;

  @IsNotEmpty({ message: "Address is required!" })
  @Column()
  address!: string;

  @IsNotEmpty({ message: "City is required!" })
  @Column()
  city!: string;

  @IsNotEmpty({ message: "Open time is required!" })
  @Column()
  openTime!: string;

  @IsNotEmpty({ message: "email is required!" })
  @IsEmail({}, { message: "is not a valid email address" })
  @Column()
  email!: string;

  @IsNotEmpty({ message: "PhoneNumber is required!" })
  @MinLength(10)
  @Column()
  phone!: string;

  @Column({ nullable: true })
  secondaryPhone!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
