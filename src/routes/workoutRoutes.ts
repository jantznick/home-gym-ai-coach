import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * tags:
 *   name: Workouts
 *   description: API to manage user workouts
 */

/**
 * @swagger
 * /api/workouts/{id}:
 *   get:
 *     summary: Get a workout by ID
 *     tags: [Workouts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The workout ID
 *     responses:
 *       200:
 *         description: Returns the workout object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 title:
 *                   type: string
 *                   example: "My Morning Workout"
 *       404:
 *         description: Workout not found
 */

router.get("/:id", async (req: Request, res: Response) => {
  const workoutId = req.params.id;

  try {
    // Find workout by ID, including its user
    const workout = await prisma.workout.findUnique({
      where: { id: workoutId },
      include: { user: true },
    });

    if (!workout) {
      return res.status(404).json({
        error: {
          message: "Workout not found",
          details:
            "The requested workout could not be found. It may not exist or has been deleted by its creator.",
        },
      });
    }

    return res.status(200).json(workout);
  } catch (error) {
    console.error("Error fetching workout:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;