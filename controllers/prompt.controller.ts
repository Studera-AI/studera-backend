// import {
//   setRedisData,
//   getAllKeys,
//   getAllCache,
//   redisClient,
// } from "../services/redis"; REDIS STUFF
import { Request, Response } from "express";
const Openai = require("openai");
require("dotenv").config();
import { generatePrompt1, specifyPrompt } from "../utils";
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
    const promptfn = specifyPrompt(timeframe);
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
    // for (let i = 1; i<=promptfn; i++) {
    //   if(i===1){
    //     continue
    //   }
    //   const completion = await openai.chat.completions.create({
    //     messages: [{ role: "system", content: prompt }],
    //     model: "gpt-3.5-turbo",
    //   });
    //   const data = <slocalhost:5000/resourcetring>completion.choices[0].message.content;
    // }
  }
};
