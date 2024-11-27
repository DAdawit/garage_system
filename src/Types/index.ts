// import { AvailableMealTime } from "../entities/AvaliableMealTime";
// import { Category } from "../entities/Category";
// import { Hero } from "../entities/Hero";
// import { Logo } from "../entities/Logo";
// import { Menu } from "../entities/Menu";
// import { Review } from "../entities/Review";
import { User } from "../entities/User";
import { PaginationResult } from "../utils/pagination";
export enum Roles {
  waiter = "waiter",
  admin = "admin",
  kitchen = "kitchen",
}

export interface DeleteI {
  raw: any;
  affected: number;
}

// export interface MenuPaginationWithCategory extends PaginationResult<Menu> {
//   category?: Category; // Assuming Category is the correct type
// }
