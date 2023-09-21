import { User } from "../entities/users";

export interface UserDto extends User {
  token?: string;
  expiresIn?: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export const SALT_ROUNDS = 10;
