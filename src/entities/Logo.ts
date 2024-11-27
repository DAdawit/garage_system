import {
  AfterLoad,
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { getBaseUrl } from "../utils/host";

@Entity("logos")
export class Logo extends BaseEntity {
  private _fullImagePath!: string;

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  image!: string;

  @AfterLoad()
  loadImagePath() {
    const baseUrl = getBaseUrl();
    this._fullImagePath = baseUrl + this.image; // Construct the full image path after entity load
  }

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
