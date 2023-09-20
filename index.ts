//Modules
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
const cors = require("cors");
require("dotenv").config();

//Custom Modules
import { databaseConnection } from "./services/database";
import { User } from "./entities/users";
const userRouter = require("./routes/user.route");
const adminRouter = require("./routes/admin.route");

const app = express();

databaseConnection(User);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(storePrompt);

app.use(userRouter);
app.use(adminRouter);

const port = process.env.PORT || 5000;

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Success",
  });
});

// app.post("/study-materials", storePrompt, promptController);

// app.post("/re-study-materials", storePrompt, regeneratePromptController);

app.listen(port, () => {
  console.clear();
  console.log(`Running -> http://localhost:${port}`);
});
