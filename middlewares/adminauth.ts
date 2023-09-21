import { Request, Response, NextFunction } from "express";
require("dotenv").config();

export function requireAdminAccess(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const adminHeaderValue = req.header("Admin-Access");

  if (!adminHeaderValue || adminHeaderValue !== process.env.ADMIN_ACCESS) {
    return res.status(401).json({ message: "Unauthorized admin access" });
  }

  next();
}
