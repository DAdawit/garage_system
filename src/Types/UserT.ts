import { Roles } from ".";

export interface UserI {
  id: number;
  email: string;
  password: string;
  points: number;
  created_at: Date;
  updated_at: Date;
}
// ... existing code ...
export interface UserCreate {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: keyof typeof Roles; // Add this line
}
// ... existing code ...

export interface UserCreateOut {
  email: string;
  firstName: string;
  lastName: string;
  role: keyof typeof Roles; // Add this line
  id: number;
  isActive: boolean;
  created_at: Date;
  updated_at: Date;
  profilePic: string | null;
  password: string | null;
}

export interface IUsersOut {
  data: Datum[];
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  perPage: number;
  currentPage: number;
}

interface Datum {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}
