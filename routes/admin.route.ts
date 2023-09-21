import { Router } from "express";
import { getAllUsers, deleteAllUsers } from "../controllers/admin.controller";
import { requireAdminAccess } from "../middlewares";
const router = Router();

router.get("/admin", requireAdminAccess, getAllUsers);

router.delete("/admin", requireAdminAccess, deleteAllUsers);

module.exports = router;
