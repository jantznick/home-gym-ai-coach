import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import os from "os";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/admin/health:
 *   get:
 *     summary: API status health check
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Server is running and database is connected.
 *       500:
 *         description: Server error or database issue.
 */
router.get("/health", async (req: Request, res: Response) => {
  try {
    // Database Check
	// TODO: dont raw this
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: "OK",
      server: "Running",
      database: "Connected",
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      host: os.hostname(),
      memoryUsage: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
      insideDocker: Boolean(process.env.DOCKERIZED) || false,
    });
  } catch (error) {
    console.error("Health check error:", error);
    res.status(500).json({ status: "ERROR", message: "Database connection failed" });
  }
});

export default router;