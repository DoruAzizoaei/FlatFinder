export enum Role {
  admin = "admin",
  user = "user",
}

interface IUser {
  displayName?:string
  email: string;
  firstName: string;
  lastName: string;
  birthDate: Date | null | number;
  userRole: Role;
  isActive?: boolean;
  createdAt?: number;
  lastLoginAt?: number;
  favorites?:string[]
  id: string;
}
export type { IUser };
