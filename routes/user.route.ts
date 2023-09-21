import { Router } from "express";
const router = Router();

import {
  getUser,
  signInUser,
  signUpUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";
import { auth } from "../middlewares";

router.get("/user", auth, getUser);

router.post("/signup", signUpUser);

router.post("/signin", signInUser);

router.patch("/user", auth, updateUser);

router.delete("/user", auth, deleteUser);

module.exports = router;
