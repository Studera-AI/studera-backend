import {
  setRedisData,
  getAllKeys,
  getAllCache,
  redisClient,
} from "../services/redis";
import { Request, Response } from "express";
const Openai = require("openai");
require("dotenv").config();
const openai = new Openai(process.env.OPENAI_API_KEY);

interface modifiedRequest extends Request {
  prompt: any;
}

export const storePrompt = async (
  req: modifiedRequest,
  res: Response,
  next: any
) => {
  req.prompt = req.body;
  next();
};

export const promptController = async (req: modifiedRequest, res: Response) => {
  let { title, timeframe, preference } = req.body;
  const prompt = `Act as a professional tutor that creates study plans to help people to learn complex subjects. You will be provided with the goal of the student, their time commitment, and resource preferences. You will create a study plan with timelines and links to resources. Only include relevant and concise resources because time is limited. My first request = "I want to learn ${title}. I have ${timeframe} to learn it and would prefer ${preference} resources. Create a study plan for me.`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: prompt }],
    model: "gpt-3.5-turbo",
  });

  const response = completion.choices[0].message.content;
  console.log("AI Response: ", response);

  // await setRedisData(title, JSON.stringify([title, timeframe, preference]));

  // const keys = await getAllKeys(redisClient)
  // const cache = await getAllCache(redisClient, keys)
  // const clientResponse = createResponseObj(cache)

  return res.status(200).json({
    message: "success",
    data: response,
    // cache: clientResponse
  });
};

export const regeneratePromptController = async (
  req: modifiedRequest,
  res: Response
) => {
  let { title, timeframe, preference } = req.prompt;
  const prompt = `Act as a professional tutor that creates unique study plans to help people to learn complex subjects, your study plans are always changing. You will be provided with the goal of the student, their time commitment, and resource preferences. You will create a study plan with timelines and links to resources. Only include relevant and concise resources because time is limited. My first request = "I want to learn ${title}. I have ${timeframe} to learn it and would prefer ${preference} resources. Create a study plan for me.`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: prompt }],
    model: "gpt-3.5-turbo",
  });

  const response = completion.choices[0].message.content;
  console.log("AI Response: ", response);

  // await setRedisData(title, JSON.stringify([title, timeframe, preference]));

  // const keys = await getAllKeys(redisClient)
  // const cache = await getAllCache(redisClient, keys)
  // const clientResponse = createResponseObj(cache)

  return res.status(200).json({
    message: "success",
    data: response,
    // cache: clientResponse
  });
};

const createResponseObj = (arr: string[] | undefined) => {
  if (typeof arr === undefined) {
    return [];
  }
  const response = [];

  for (let item of arr!) {
    item = JSON.parse(item);
    response.push({
      title: item[0],
      timeframe: item[1],
      preference: item[2],
    });
    if (response.length > 2) {
      break;
    }
  }
  return response;
};

module.exports = { promptController, regeneratePromptController, storePrompt };
