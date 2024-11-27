export interface UserI {
  id: number;
  email: string;
  password: string;
  points: number;
  created_at: Date;
  updated_at: Date;
}
export interface UserCreate {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
