import { config } from "dotenv";
import { DataSource } from "typeorm";
import { User } from "./entities/users";

config();

export const AppDataSource = new DataSource({
  type: "mongodb",
  url: process.env.DB_URI,
  database: "Studera",
  useNewUrlParser: true,
  useUnifiedTopology: true,
  entities: [User],
});
