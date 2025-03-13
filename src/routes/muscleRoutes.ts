import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const router = express.Router();
const prisma = new PrismaClient();

// Enable CORS for this route
router.use(
  cors({
    origin: "*",
    methods: ["GET"],
    optionsSuccessStatus: 200,
  })
);

/**
 * @swagger
 * tags:
 *   name: Muscles
 *   description: API to filter exercises by muscle and difficulty
 */

/**
 * @swagger
 * /api/muscles:
 *   get:
 *     summary: Get exercises grouped by main muscle and difficulty
 *     tags: [Muscles]
 *     parameters:
 *       - in: query
 *         name: equipment
 *         schema:
 *           type: string
 *         description: Comma-separated list of required equipment
 *     responses:
 *       200:
 *         description: Returns aggregated exercise data
 *       500:
 *         description: Internal Server Error
 */

router.get("/", async (req: Request, res: Response) => {
  try {
    let { equipment = "" } = req.query;
    const equipmentList = (equipment as string)?.split(",").filter(Boolean);

    // PostgreSQL Aggregated Query
	// TODO: dont raw this
    const workouts = await prisma.$queryRaw`
      SELECT
        unnest("targets") AS main_muscle,
        COUNT(*) AS count,
        SUM(CASE WHEN difficulty = 'Beginner' THEN 1 ELSE 0 END) AS beginner,
        SUM(CASE WHEN difficulty = 'Intermediate' THEN 1 ELSE 0 END) AS intermediate,
        SUM(CASE WHEN difficulty = 'Advanced' THEN 1 ELSE 0 END) AS advanced
      FROM "Exercise"
      WHERE (
        (equipment @> ${equipmentList} OR ${equipmentList} = '{}'::text[])
        AND category NOT IN ('Yoga', 'TRX', 'Medicine Ball', 'Machine', 'Cables', 'Stretches')
        AND difficulty NOT IN ('Yoga')
      )
      GROUP BY main_muscle
      ORDER BY count DESC
    `;

    res.status(200).json(workouts);
  } catch (error) {
    console.error("Error fetching muscle data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;