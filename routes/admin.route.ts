import { Router } from "express";
import {
  getAllUsers,
  deleteAllUsers,
  userFeedback,
} from "../controllers/admin.controller";
import { auth, requireAdminAccess } from "../middlewares";
const router = Router();

router.get("/admin", requireAdminAccess, getAllUsers);

router.post("/feedback", userFeedback);

router.delete("/admin", requireAdminAccess, deleteAllUsers);

module.exports = router;
