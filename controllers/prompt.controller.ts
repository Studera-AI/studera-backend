// import {
//   setRedisData,
//   getAllKeys,
//   getAllCache,
//   redisClient,
// } from "../services/redis"; REDIS STUFF
import { Request, Response } from "express";
const Openai = require("openai");
require("dotenv").config();
import { generatePrompt1, generateTestPrompt, specifyPrompt } from "../utils";
import { PromptPayload, submitTestPayload, testPayload } from "../dto";
import { AppDataSource } from "../ormconfig";
import { User } from "../entities/users";

const openai = new Openai(process.env.OPENAI_API_KEY);

export const generateResource = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const { email } = req.user!;
  const { title, timeframe, type } = <PromptPayload>req.body;

  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneBy({ email: email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const learnings: PromptPayload[] = (user.learnings as PromptPayload[]) || [];
  const prevLearning = learnings.find((learning) => learning.title === title);

  if (prevLearning) {
    return res.status(200).json({
      message: "success",
      data: prevLearning.data,
    });
  } else {
    const prompt = generatePrompt1(title, timeframe, type);
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "gpt-3.5-turbo",
    });
    const data = <string>completion.choices[0].message.content;
    if (learnings.length > 2) {
      learnings.shift();
    }
    learnings.push({
      title,
      timeframe,
      type,
      data,
      date: new Date(),
    });
    const updated_user = { ...user, learnings: learnings };
    await userRepository.save(updated_user);

    res.status(200).json({
      message: "success",
      data: data,
    });
  }
};

export const generateTest = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { email } = req.user!;
    const { day, title } = <testPayload>req.body;

    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const learnings: PromptPayload[] =
      (user.learnings as PromptPayload[]) || [];

    const learning = learnings.find((learning) => learning.title === title);

    if (!learning) {
      return res.status(404).json({ message: "Learning not found" });
    }

    const learningData = JSON.parse(learning.data!);
    const studyPlan = learningData.study_plan || learningData.studyPlan;
    const learningDay = studyPlan.find((obj: any) => {
      return obj.day === Number(day);
    });

    if (!learningDay) {
      return res.status(404).json({ message: "Day not found" });
    }

    const prompt = generateTestPrompt(JSON.stringify(learningDay));
    console.log(prompt);

    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    const responseData = <string>completion.choices[0].message.content;

    return res.status(200).json({ res: JSON.parse(responseData) });
  } catch (error) {
    console.error("Error generating test:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const submitTest = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { email } = req.user!;
    const { userScore, maxScore, title, day } = <submitTestPayload>req.body;

    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const learnings: PromptPayload[] =
      (user.learnings as PromptPayload[]) || [];

    let learning = learnings.find((learning) => learning.title === title);

    if (!learning) {
      return res.status(404).json({ message: "Learning not found" });
    }
    learning = <PromptPayload>learning;

    let learningData = JSON.parse(learning.data!);
    let learningDay = learningData.study_plan.find(
      (obj: any) => obj.day === Number(day)
    );

    if (!learningDay) {
      return res.status(404).json({ message: "Day not found" });
    }

    if (!learningDay.scores) {
      learningDay.scores = <testPayload | unknown>[];
    }

    learningDay.scores.push({ score: userScore, maxScore: maxScore });

    // Update the specific learning day within the study plan
    learningData.study_plan = learningData.study_plan.map((obj: any) =>
      obj.day === Number(day) ? learningDay : obj
    );

    // Update the learning object with the modified data
    learning = {
      ...learning,
      data: JSON.stringify(learningData),
    };

    // Update the user's learnings array with the modified learning object
    const updatedUserLearnings = learnings.map((item) =>
      item.title === title ? <PromptPayload>learning : item
    );

    // Update the user object with the modified learnings array
    const updatedUser = {
      ...user,
      learnings: updatedUserLearnings,
    };

    userRepository.save(updatedUser);
    return res.status(200).json({ message: "success", user: updatedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
