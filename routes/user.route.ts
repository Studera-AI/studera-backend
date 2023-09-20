import { Router } from "express";
const router = Router();

import {
  //   getUser,
  signInUser,
  signUpUser,
  //   updateUser,
  //   deleteUser,
} from "../controllers/userController";

// router.get("/user", getUser);

router.post("/signup", signUpUser);

router.post("/signin", signInUser);

// router.patch("/user", updateUser);

// router.delete("user", deleteUser);

module.exports = router;
