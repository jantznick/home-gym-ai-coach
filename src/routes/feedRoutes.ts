import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/feed:
 *   get:
 *     summary: Get a user's newsfeed (friends' activities)
 *     tags: [Feed]
 */
router.get("/:userId", async (req: Request, res: Response) => {
	try {
		const userId = req.params.userId;

		// Fetch user's friends
		const friends = await prisma.friend.findMany({
			where: { userId },
			select: { friendId: true },
		});
		const friendIds = friends.map((f) => f.friendId);

		// Get latest workouts from friends
		const feedEntries = await prisma.feedEntry.findMany({
			where: { userId: { in: friendIds } },
			orderBy: { createdAt: "desc" },
			take: 20,
		});

		res.status(200).json(feedEntries);
	} catch (error) {
		console.error("Get Feed Error:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

router.post("/like", async (req: Request, res: Response) => {
	try {
		const { userId, feedEntryId } = req.body;

		// Check if user already liked this post
		const existingLike = await prisma.like.findFirst({
			where: { userId, feedEntryId },
		});

		if (existingLike)
			return res.status(409).json({ error: "Already liked this post" });

		// Create a new like record
		const like = await prisma.like.create({
			data: { userId, feedEntryId },
		});

		res.status(201).json(like);
	} catch (error) {
		console.error("Like Error:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

router.post("/comment", async (req: Request, res: Response) => {
	try {
		const { userId, feedEntryId, text } = req.body;

		if (!text.trim()) {
			return res.status(400).json({ error: "Comment cannot be empty" });
		}

		// Add a new comment
		const comment = await prisma.comment.create({
			data: { userId, feedEntryId, text },
		});

		res.status(201).json(comment);
	} catch (error) {
		console.error("Comment Error:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

router.get("/:feedEntryId", async (req: Request, res: Response) => {
	try {
		const { feedEntryId } = req.params;

		const feedEntry = await prisma.feedEntry.findUnique({
			where: { id: feedEntryId },
			include: {
				likes: { include: { user: { select: { id, email } } } },
				comments: { include: { user: { select: { id, email } } } },
			},
		});

		if (!feedEntry)
			return res.status(404).json({ error: "Post not found" });

		res.status(200).json(feedEntry);
	} catch (error) {
		console.error("Fetch Feed Entry Error:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

router.patch("/comment/:commentId", async (req: Request, res: Response) => {
	try {
	  const { commentId } = req.params;
	  const { userId, text } = req.body;
  
	  if (!text.trim()) return res.status(400).json({ error: "Comment cannot be empty" });
  
	  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  
	  if (!comment) return res.status(404).json({ error: "Comment not found" });
	  if (comment.userId !== userId) return res.status(403).json({ error: "Unauthorized to edit this comment" });
  
	  const updatedComment = await prisma.comment.update({
		where: { id: commentId },
		data: { text },
	  });
  
	  res.status(200).json(updatedComment);
	} catch (error) {
	  console.error("Edit Comment Error:", error);
	  res.status(500).json({ message: "Internal Server Error" });
	}
  });

  router.delete("/comment/:commentId", async (req: Request, res: Response) => {
	try {
	  const { commentId } = req.params;
	  const { userId } = req.body; // Ensure userId is sent
  
	  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  
	  if (!comment) return res.status(404).json({ error: "Comment not found" });
	  if (comment.userId !== userId) return res.status(403).json({ error: "Unauthorized to delete this comment" });
  
	  await prisma.comment.delete({ where: { id: commentId } });
  
	  res.status(200).json({ message: "Comment deleted successfully!" });
	} catch (error) {
	  console.error("Delete Comment Error:", error);
	  res.status(500).json({ message: "Internal Server Error" });
	}
  });

export default router;