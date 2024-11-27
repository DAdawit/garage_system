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
