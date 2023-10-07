import { Router } from "express";
const router = Router();
import { auth } from "../middlewares";
import {
  generateResource,
  generateTest,
  submitTest,
} from "../controllers/prompt.controller";

router.post("/resource", auth, generateResource);

router.post("/test", auth, generateTest);

router.post("/submit_test", auth, submitTest);

module.exports = router;
