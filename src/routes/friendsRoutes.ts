import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/friends/request:
 *   post:
 *     summary: Send a friend request
 *     tags: [Friends]
 */
router.post("/request", async (req: Request, res: Response) => {
  try {
    const { senderId, receiverId } = req.body;

    // Avoid sending duplicate requests or adding yourself
    if (senderId === receiverId) return res.status(400).json({ error: "You can't friend yourself." });

    const existingFriendship = await prisma.friend.findFirst({
      where: { OR: [{ userId: senderId, friendId: receiverId }, { userId: receiverId, friendId: senderId }] },
    });
    if (existingFriendship) return res.status(409).json({ error: "Already friends." });

    // Check if a pending request exists
    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        senderId,
        receiverId,
        status: "pending",
      },
    });

    if (existingRequest) return res.status(409).json({ error: "Friend request already sent." });

    const request = await prisma.friendRequest.create({
      data: { senderId, receiverId },
    });

    res.status(201).json(request);
  } catch (error) {
    console.error("Friend Request Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /api/friends/accept:
 *   post:
 *     summary: Accept a friend request
 *     tags: [Friends]
 */
router.post("/accept", async (req: Request, res: Response) => {
  try {
    const { requestId } = req.body;

    const request = await prisma.friendRequest.update({
      where: { id: requestId },
      data: {
        status: "accepted",
      },
      include: { sender: true, receiver: true },
    });

    // Create the friendship
    await prisma.friend.createMany({
      data: [
        { userId: request.senderId, friendId: request.receiverId },
        { userId: request.receiverId, friendId: request.senderId },
      ],
    });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.error("Accept Friend Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /api/friends/list:
 *   get:
 *     summary: Get a user's friends list
 *     tags: [Friends]
 */
router.get("/list/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const friends = await prisma.friend.findMany({
      where: { userId },
      include: { friend: true },
    });

    res.status(200).json(friends.map(f => f.friend));
  } catch (error) {
    console.error("Get Friends List Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;