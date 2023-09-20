import { Request, Response } from "express";
import { AppDataSource } from "../ormconfig";
import { User } from "../entities/users";

export const getAllUsers = async (req: Request, res: Response) => {
  const userRepository = AppDataSource.getRepository(User);
  res.status(200).json({
    users: await userRepository.find(),
  });
};
