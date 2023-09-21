import { Router } from "express";
const router = Router();
import { auth } from "../middlewares";
import { generateResource } from "../controllers/prompt.controller";

router.post("/resource", auth, generateResource);

module.exports = router;
