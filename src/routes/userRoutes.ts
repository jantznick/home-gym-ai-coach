import express from "express";
import { getAllUsers, createUser } from '../utils/db'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management API
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Array of user objects.
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
 *                     example: "John Doe"
 */
router.get('/', async (req, res) => {
  try {
    const users = await getAllUsers()
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' })
  }
})

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *     responses:
 *       201:
 *         description: Successfully created a new user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: "john@example.com"
 */
router.post('/', async (req, res) => {
  try {
    const newUser = await createUser(req.body)
    res.status(201).json(newUser)
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' })
  }
})

export default router