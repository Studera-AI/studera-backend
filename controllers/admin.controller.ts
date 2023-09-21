import { Request, Response } from "express";
import { AppDataSource } from "../ormconfig";
import { User } from "../entities/users";

export const getAllUsers = async (req: Request, res: Response) => {
  const userRepository = AppDataSource.getRepository(User);
  res.status(200).json({
    users: await userRepository.find(),
  });
};

export const deleteAllUsers = async (req: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.clear();
    res
      .status(200)
      .json({
        message: "All users deleted",
        users: await userRepository.find(),
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting users", error: error });
  }
};
