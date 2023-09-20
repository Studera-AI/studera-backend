import { Router } from "express";
import { getAllUsers } from "../controllers/admin.controller";
const router = Router();

router.get("/admin", getAllUsers);

module.exports = router;
