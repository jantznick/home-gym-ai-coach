import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { OpenAI } from "openai";
import dotenv from "dotenv";
import { requireAuth } from "../middleware/authMiddleware";

dotenv.config();
const prisma = new PrismaClient();
const router = express.Router();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY!,
});

/**
 * @swagger
 * /api/chat/send:
 *   post:
 *     summary: Send a message to a friend or the virtual coach
 *     tags: [Chat]
 */
router.post("/send", requireAuth, async (req: Request, res: Response) => {
	try {
		const { receiverId, message } = req.body;

		if (!message) return res.status(400).json({ error: "Message is required" });

		// 📌 HANDLE AI CHAT
		if (!receiverId || receiverId === "virtual_coach") {
			const aiResponse = await openai.chat.completions.create({
				model: "gpt-3.5-turbo",
				messages: [
					{ role: "system", content: "You are a helpful virtual fitness coach." },
					{ role: "user", content: message }]
			});

			const coachReply = aiResponse.choices[0].message?.content || "I'm not sure how to respond.";

			// 📌 Store User & AI Messages
			await prisma.chatMessage.createMany({
				data: [
					{ userId: req.user!.id, message: message, sender: req.user!.id },
					{ userId: req.user!.id, message: coachReply, sender: "virtual_coach" }
				],
			});

			return res.json({ reply: coachReply });
		}

		// 📌 HANDLE FRIEND CHAT
		const friend = await prisma.friend.findFirst({
			where: {
				OR: [
					{ userId: req.user!.id, friendId: receiverId },
					{ userId: receiverId, friendId: req.user!.id }
				]
			}
		});

		if (!friend) {
			return res.status(403).json({ error: "You can only message friends." });
		}

		// 📌 Store Friend Message
		await prisma.chatMessage.create({
			data: {
				userId: receiverId,
				message: message,
				sender: req.user!.id
			}
		});

		res.json({ message: "Message sent successfully!" });
	} catch (error) {
		console.error("Chat Error", error);
		res.status(500).json({ error: "Message failed to send" });
	}
});

/**
 * @swagger
 * /api/chat/history/{withUserId}:
 *   get:
 *     summary: Get conversation history
 *     tags: [Chat]
 */
router.get("/history/:withUserId?", requireAuth, async (req: Request, res: Response) => {
	try {
		const { withUserId } = req.params;

		let messages;

		if (!withUserId) {
			// 📌 Return AI Chat History
			messages = await prisma.chatMessage.findMany({
				where: { userId: req.user!.id, sender: "virtual_coach" },
				orderBy: { timestamp: "asc" }
			});
		} else {
			// 📌 Ensure Friendship
			const friend = await prisma.friend.findFirst({
				where: {
					OR: [
						{ userId: req.user!.id, friendId: withUserId },
						{ userId: withUserId, friendId: req.user!.id }
					]
				}
			});

			if (!friend) {
				return res.status(403).json({ error: "You can only view conversations with friends." });
			}

			// 📌 Return Friend Chat History
			messages = await prisma.chatMessage.findMany({
				where: {
					OR: [
						{ userId: req.user!.id, sender: withUserId },
						{ userId: withUserId, sender: req.user!.id },
					],
				},
			});
		}

		res.json(messages);
	} catch (error) {
		console.error("Chat History Error", error);
		res.status(500).json({ error: "Failed to fetch messages" });
	}
});

export default router;