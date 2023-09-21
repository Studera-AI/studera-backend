// import {
//   setRedisData,
//   getAllKeys,
//   getAllCache,
//   redisClient,
// } from "../services/redis"; REDIS STUFF
import { Request, Response } from "express";
const Openai = require("openai");
require("dotenv").config();
import { generatePrompt } from "../utils";
import { PromptPayload } from "../dto";
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
    const prompt = generatePrompt(title, timeframe, type);
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

    return res.status(200).json({
      message: "success",
      data: data,
    });
  }
};

// export const regeneratePromptController = async (
//   req: Request,
//   res: Response
// ) => {
//   let { title, timeframe, preference } = req.prompt;
//   const prompt = `Act as a professional tutor that creates unique study plans to help people to learn complex subjects, your study plans are always changing. You will be provided with the goal of the student, their time commitment, and resource preferences. You will create a study plan with timelines and links to resources. Only include relevant and concise resources because time is limited. My first request = "I want to learn ${title}. I have ${timeframe} to learn it and would prefer ${preference} resources. Create a study plan for me.`;

//   const completion = await openai.chat.completions.create({
//     messages: [{ role: "system", content: prompt }],
//     model: "gpt-3.5-turbo",
//   });

//   const response = completion.choices[0].message.content;
//   console.log("AI Response: ", response);

//   // await setRedisData(title, JSON.stringify([title, timeframe, preference]));

//   // const keys = await getAllKeys(redisClient)
//   // const cache = await getAllCache(redisClient, keys)
//   // const clientResponse = createResponseObj(cache)

//   return res.status(200).json({
//     message: "success",
//     data: response,
//     // cache: clientResponse
//   });
// };

// const createResponseObj = (arr: string[] | undefined) => {
//   if (typeof arr === undefined) {
//     return [];
//   }
//   const response = [];

//   for (let item of arr!) {
//     item = JSON.parse(item);
//     response.push({
//       title: item[0],
//       timeframe: item[1],
//       preference: item[2],
//     });
//     if (response.length > 2) {
//       break;
//     }
//   }
//   return response;
// };
