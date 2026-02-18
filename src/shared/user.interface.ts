/**
 * STUB - User role enum matching your friend's User entity.
 * Replace with: import { UserRole } from '../user/entities/user.entity'
 */
export enum UserRole {
  FARMER = 'farmer',
  BUYER = 'buyer',
  ADMIN = 'admin',
}

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phoneNumber?: string;
  district?: string;
}
