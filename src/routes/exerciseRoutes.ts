import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * tags:
 *   name: Exercises
 *   description: API to manage exercises
 */

/**
 * @swagger
 * /api/exercises:
 *   get:
 *     summary: Get all exercises
 *     tags: [Exercises]
 *     responses:
 *       200:
 *         description: Array of exercise objects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "123e4567-e89b-12d3-a456-426614174000"
 *                   name:
 *                     type: string
 *                     example: "Push Ups"
 *                   description:
 *                     type: string
 *                     example: "A basic upper body exercise."
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const exercises = await prisma.exercise.findMany();
    res.status(200).json(exercises);
  } catch (error) {
    console.error("Error fetching exercises:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /api/exercises:
 *   post:
 *     summary: Create a new exercise
 *     tags: [Exercises]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Squats"
 *               description:
 *                 type: string
 *                 example: "A lower body exercise."
 *               userId:
 *                 type: string
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       201:
 *         description: Successfully created a new exercise
 *       500:
 *         description: Internal Server Error
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, description, userId } = req.body;

    const newExercise = await prisma.exercise.create({
      data: { name, description, userId },
    });

    res.status(201).json(newExercise);
  } catch (error) {
    console.error("Error creating exercise:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /api/exercises/{id}:
 *   get:
 *     summary: Get a specific exercise by ID
 *     tags: [Exercises]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The exercise ID
 *     responses:
 *       200:
 *         description: Returns the exercise object
 *       404:
 *         description: Exercise not found
 */
router.get("/:id", async (req: Request, res: Response) => {
  const exerciseId = req.params.id;

  try {
    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
    });

    if (!exercise) {
      return res.status(404).json({
        error: {
          message: "Exercise not found",
          details: "This exercise doesn't exist or has been deleted.",
        },
      });
    }

    res.status(200).json(exercise);
  } catch (error) {
    console.error("Error fetching exercise:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /api/exercises/{id}:
 *   delete:
 *     summary: Delete an exercise by ID
 *     tags: [Exercises]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The exercise ID
 *     responses:
 *       204:
 *         description: Successfully deleted
 *       500:
 *         description: Internal Server Error
 */
router.delete("/:id", async (req: Request, res: Response) => {
  const exerciseId = req.params.id;

  try {
    await prisma.exercise.delete({
      where: { id: exerciseId },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting exercise:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;