import { AvailableMealTime } from "../entities/AvaliableMealTime";
import { Category } from "../entities/Category";
import { Hero } from "../entities/Hero";
import { Logo } from "../entities/Logo";
import { Menu } from "../entities/Menu";
import { Review } from "../entities/Review";
import { User } from "../entities/User";
import { PaginationResult } from "../utils/pagination";

export interface DeleteI {
  raw: any;
  affected: number;
}

export interface CartCreateI {
  productId: Product;
}

export interface WishListCreateI {
  productId: Product;
}

export interface ProductCreateI {
  name: string;
  description: string;
  price: number;
  quantity: number;
  discount: number;
  image: string;
}

export interface SubCategoryCreateI {
  name: string;
  categoryId: Category;
}

export interface TagCreateI {
  title: string;
}

export interface ChangeQuantityI {
  id: string;
}

export interface OrderCreateI {
  fullName: string;
  phoneNumber: string;
  country: string;
  city: string;
  street: string;
  lat: number;
  long: number;
  useCurrentLocation: boolean;
}

export enum ReviewStatus {
  OnReview = "onReview",
  Approved = "approved",
  Rejected = "rejected",
}

export enum OrderStatus {
  placed = "placed",
  processing = "processing",
  shipped = "shipped",
  delivered = "delivered",
  canceled = "canceled",
}

export enum MealTime {
  Breakfast = "breakfast",
  Lunch = "lunch",
  Dinner = "dinner",
}

export enum Roles {
  waiter = "waiter",
  admin = "admin",
  kitchen = "kitchen",
}
export interface ProductDetails {
  menu: Menu;
  review: {
    average: number;
    total: number;
    details: ReviewDetail[];
  };
}

interface ReviewDetail {
  id: number;
  rate: number;
  user: {
    firstName: string;
    profilePic: string;
  };
}

export interface ProductOrdered {
  id: number;
  name: string;
  description: string;
  coverImage: string;
  price: number;
  quantity: number;
  discount: number;
  created_at: Date;
  updated_at: Date;
}

export interface UnsortedCartItmesI {
  id: number;
  quantity: number;
  created_at: Date;
  updated_at: Date;
  product: Product;
  model?: Model;
  color?: Color;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  totalQuantity: number;
  discount: number;
  modelName: string;
  tag: string;
  coverImage: string;
  created_at: Date;
  updated_at: Date;
  store: Store;
}

export interface Store {
  id: number;
  email: string;
  storeName: string;
  // phoneNumber: string;
  fullAddress: string;
  description: string;
  storePic?: string;
  lat: any;
  long: any;
  isActive: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Model {
  id: number;
  name: string;
  price: number;
  discount: number;
  created_at: Date;
  updated_at: Date;
}

export interface Color {
  id: number;
  name: string;
  quantity: string;
  created_at: Date;
  updated_at: Date;
}

export type SortedCarItemsBasedOnStoreT = Root2[][];

export interface Root2 {
  id: number;
  quantity: number;
  created_at: Date;
  updated_at: Date;
  product: Product;
  model?: Model;
  color?: Color;
}

export interface UserOrdersOutI {
  id: number;
  order_id: string;
  status: string;
  paid: boolean;
  created_at: Date;
  updated_at: Date;
  store: Store;
  ordersItems: OrdersItem[];
}

export interface Store {
  id: number;
  email: string;
  storeName: string;
  // phoneNumber: string;
  fullAddress: string;
  description: string;
  storePic?: string;
  lat: any;
  long: any;
  isActive: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface OrdersItem {
  id: number;
  quantity: number;
  subTotal: number;
  created_at: Date;
  updated_at: Date;
  menu: Menu[];
  model?: Model;
  color?: Color;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  totalQuantity: number;
  discount: number;
  modelName: string;
  tag: string;
  coverImage: string;
  created_at: Date;
  updated_at: Date;
}

export interface HeroSectionResponse {
  hero: Hero | null;
  logo: Logo | null;
}

export interface MenuByMealTimeOut {
  mealTime: AvailableMealTime | null;
  menus: Menu[] | null;
}

export interface MenuByCategoryOut {
  category: Category | null;
  menus: Menu[] | null;
}

export interface MealTimesResponse {
  id: number;
  name: string;
  image: string;
  created_at: string;
  updated_at: string;
  imageUrl: string;
  menues: Menu[];
}

export interface MenuPaginationWithCategory extends PaginationResult<Menu> {
  category?: Category; // Assuming Category is the correct type
}
