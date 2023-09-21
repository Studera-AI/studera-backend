import { Request, Response } from "express";
const bcrypt = require("bcrypt");
import { CreateUserDto, LoginUserDto, SALT_ROUNDS, UserDto } from "../dto";
import { createUser, generateToken } from "../utils";
import { AppDataSource } from "../ormconfig";
import { User } from "../entities/users";
import { instanceToPlain } from "class-transformer";

export const getUser = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneBy({ email: req.user?.email });
  if (!user) return res.status(404).json({ message: "User not found" });
  user!.password = ""; // USE TYPEORM SELECT
  return res.status(200).json({ message: "User found", user });
};

export const signUpUser = async (req: Request, res: Response) => {
  const { name, email, password } = <CreateUserDto>req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "Incomplete Details" });

  try {
    const userRepository = AppDataSource.getRepository(User);
    const existingUser = await userRepository.findOneBy({
      email: email,
    });

    if (existingUser)
      return res.status(409).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await createUser({
      name,
      email,
      password: hashedPassword,
    });
    if (!user) return res.status(500).json({ message: "Error creating user." });

    const token = generateToken({ name, email, password });
    // const newuser = instanceToPlain(user);
    user.password = ""; // USE TYPEORM SELECT

    return res.status(201).json({
      message: "User created successfully",
      user: { ...user, token, expiresIn: "1d" },
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "An Error Occurred." });
  }
};

export const signInUser = async (req: Request, res: Response) => {
  const { email, password } = <LoginUserDto>req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Incomplete Details" });

  try {
    const userRepository = AppDataSource.getRepository(User);
    let user: UserDto | null = await userRepository.findOneBy({
      email: email,
    });
    if (!user) return res.status(404).json({ message: "User does not exist" });
    const isUser = await bcrypt.compare(password, user.password);
    if (!isUser) return res.status(401).json({ message: "Invalid Password" });
    const { name } = user;
    const token = generateToken({ name, email, password });
    // const newuser = instanceToPlain(user);
    user.password = ""; // USE TYPEORM SELECT
    return res.status(200).json({
      message: "Login Successful",
      user: { ...user, token, expiresIn: "1d" },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An Error Occurred" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const { email } = req.user!;
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneBy({ email: email });
  if (!user) return res.status(404).json({ message: "User not found" });
  const newuser = { ...user, ...req.body };
  console.log(newuser);
  userRepository.save(newuser);
  return res.status(200).json({ message: "User found", user: newuser });
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const { email } = req.user!;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email: email } });
    if (!user) return res.status(404).json({ message: "User not found" });
    await userRepository.delete(user.id);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An Error Occurred" });
  }
};
