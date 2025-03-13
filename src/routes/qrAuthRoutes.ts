import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import qrcode from "qrcode";

import { createQrSession, checkQrSessionStatus } from "../services/qrAuthService";
import { generateQrCode } from "../utils/qrCodeGenerator";
import { notifyAuthentication } from "../utils/websocket";

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/qr-login/init:
 *   post:
 *     summary: Initialize QR authentication session (For Arduino devices)
 *     tags: [QR Authentication]
 *     responses:
 *       201:
 *         description: Session created and QR code generated
 */
router.get("/init", async (req: Request, res: Response) => {
	const sessionToken = await createQrSession();
	const qrUrl = `https://myfitnessapi.com/qr-login/${sessionToken}`;
	const qrCode = await generateQrCode(qrUrl);
	res.status(201).json({ sessionToken, qrCode, qrUrl });
});

/**
 * @swagger
 * /api/qr-login/status/{token}:
 *   get:
 *     summary: Check if authentication session is completed (For Arduino polling)
 *     tags: [QR Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns current session status
 */
router.get("/status/:token", async (req: Request, res: Response) => {
	const { token } = req.params;
	const session = await checkQrSessionStatus(token);
	if (!session) return res.status(404).json({ error: "Session not found" });
	res.status(200).json(session);
});

/**
 * @swagger
 * /api/qr-login/confirm:
 *   post:
 *     summary: Confirm user authentication from phone login
 *     tags: [QR Authentication]
 */
router.post("/confirm", async (req: Request, res: Response) => {
	const { sessionToken, userId } = req.body;

	const session = await checkQrSessionStatus(sessionToken);
	if (!session) return res.status(404).json({ error: "Session not found" });
  
	await prisma.qrAuthSession.update({
	  where: { token: sessionToken },
	  data: { status: "authenticated", userId },
	});
  
	notifyAuthentication(io, sessionToken); // Notify Arduino WebSocket
  
	res.status(200).json({ message: "Authentication confirmed" });
});

export default router;