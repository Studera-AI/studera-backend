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

export interface note {
  title?: string;
  content?: noteItem;
}

interface noteItem {
  day?: number;
  note?: string;
}

export const SALT_ROUNDS = 10;
