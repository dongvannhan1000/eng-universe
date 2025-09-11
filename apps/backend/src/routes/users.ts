import { Router } from "express";
import { prisma } from "../db";
export const users = Router();
users.get("/", async (_req, res) => {
  const list = await prisma.user.findMany();
  res.json(list);
});
