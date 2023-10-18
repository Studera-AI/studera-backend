import { Request, Response } from "express";
import { AppDataSource } from "../ormconfig";
import { User } from "../entities/users";
const nodemailer = require("nodemailer");

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
    res.status(200).json({
      message: "All users deleted",
      users: await userRepository.find(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting users", error: error });
  }
};

export const userFeedback = async (req: Request, res: Response) => {
  const { email, feedback } = req.body;
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MYEMAIL,
      pass: process.env.APPPASS,
    },
  });

  let mailOptions = {
    from: process.env.MYEMAIL,
    to: process.env.TOEMAIL,
    subject: "Studera User Feedback",
    text: `${email} says: ${feedback}`,
  };
  transporter.sendMail(mailOptions, function (error: Error, info: any) {
    if (error) {
      console.log(error);
      return res.status(400).json({ message: "Email not sent" });
    } else {
      console.log("Email sent: " + info.response);
      return res.status(200).json({ message: "Success" });
    }
  });
};
