import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import axios from "axios";
import dotenv from "dotenv";
import { generateSlug } from "random-word-slugs";

import { requireAuth } from "../middleware/authMiddleware";

dotenv.config();

const router = express.Router();
const prisma = new PrismaClient();
const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET as string;
const MAIL_USER = process.env.MAIL_USER;
const MAIL_PASS = process.env.MAIL_PASS;

// OIDC Config
const OIDC_AUTHORIZATION_URL = process.env.OIDC_AUTHORIZATION_URL!;
const OIDC_TOKEN_URL = process.env.OIDC_TOKEN_URL!;
const OIDC_USERINFO_URL = process.env.OIDC_USERINFO_URL!;
const OIDC_CLIENT_ID = process.env.OIDC_CLIENT_ID!;
const OIDC_CLIENT_SECRET = process.env.OIDC_CLIENT_SECRET!;
const OIDC_REDIRECT_URI = process.env.OIDC_REDIRECT_URI!;

// Nodemailer setup for sending password reset emails
const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: MAIL_USER,
		pass: MAIL_PASS,
	},
});

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication API
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Create a new user account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: User created successfully
 *       409:
 *         description: Email already exists
 */
router.post("/signup", async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		// Check if email already exists
		const existingUser = await prisma.user.findUnique({ where: { email } });

		if (existingUser) {
			return res.status(409).json({ error: "Email already exists" });
		}

		// Securely hash password
		const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

		// Generate unique slug
		let slug = generateSlug();
		while (await prisma.user.findUnique({ where: { slug } })) {
			slug = generateSlug();
		}

		// Create user
		await prisma.user.create({
			data: { email, password: hashedPassword, slug },
		});

		res.status(201).json({ message: "User created successfully" });
	} catch (error) {
		console.error("Signup error:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       401:
 *         description: Invalid email or password
 */
router.post("/login", async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		const user = await prisma.user.findUnique({ where: { email } });
		if (!user || !(await bcrypt.compare(password, user.password))) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		// Generate JWT
		const token = jwt.sign({ userId: user.id, email }, JWT_SECRET, {
			expiresIn: "7d",
		});

		res.status(200).json({ token });
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Authentication]
 *     requestBody:
 * 		#todo
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       500:
 *         description: Logout failed
 */
router.post("/logout", requireAuth, async (req: Request, res: Response) => {
	req.session.destroy((err) => {
		if (err) return res.status(500).json({ error: "Logout failed" });
		res.json({ message: "Logout successful" });
	});
});

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request a password reset
 *     tags: [Authentication]
 */
router.post("/forgot-password", async (req: Request, res: Response) => {
	try {
		const { email } = req.body;
		const user = await prisma.user.findUnique({ where: { email } });

		if (!user) return res.status(404).json({ error: "User not found" });

		// Generate reset token
		const resetToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });

		// Store token in DB
		await prisma.user.update({
			where: { email },
			data: {
				resetToken,
				resetTokenExpires: new Date(Date.now() + 3600 * 1000),
			},
		});

		// Send email
		await transporter.sendMail({
			from: MAIL_USER,
			to: email,
			subject: "Reset Your Password",
			text: `Click here to reset your password: http://localhost:5000/reset-password?token=${resetToken}`,
		});

		res.json({ message: "Password reset email sent" });
	} catch (error) {
		console.error("Forgot Password error:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset a user's password using a reset token
 *     tags: [Authentication]
 */
router.post("/reset-password", async (req: Request, res: Response) => {
	try {
		const { token, newPassword } = req.body;
		const decoded = jwt.verify(token, JWT_SECRET) as { email: string };

		const user = await prisma.user.findUnique({ where: { email: decoded.email } });

		if (!user || user.resetToken !== token || new Date(user.resetTokenExpires!) < new Date()) {
			return res.status(400).json({ error: "Invalid or expired token" });
		}

		const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

		await prisma.user.update({
			where: { email: decoded.email },
			data: {
				password: hashedPassword,
				resetToken: null,
				resetTokenExpires: null,
			},
		});

		res.json({ message: "Password successfully reset" });
	} catch (error) {
		console.error("Reset Password error:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

/**
 * @swagger
 * /api/auth/oidc/login:
 *   get:
 *     summary: Redirects user to OIDC provider (Authentik)
 *     tags: [Authentication]
 */
router.get("/oidc/login", (req: Request, res: Response) => {
	const authUrl = `${OIDC_AUTHORIZATION_URL}?client_id=${OIDC_CLIENT_ID}&redirect_uri=${OIDC_REDIRECT_URI}&response_type=code&scope=openid email profile`;
	res.redirect(authUrl);
});

/**
 * @swagger
 * /api/auth/oidc/callback:
 *   get:
 *     summary: Handles OIDC callback, exchanges auth code for access token
 *     tags: [Authentication]
 */
router.get("/oidc/callback", async (req: Request, res: Response) => {
	try {
		const { code } = req.query;
		if (!code) return res.status(400).json({ error: "Missing authorization code" });

		// Exchange authorization code for access token
		const tokenResponse = await axios.post(OIDC_TOKEN_URL, new URLSearchParams({
			client_id: OIDC_CLIENT_ID,
			client_secret: OIDC_CLIENT_SECRET,
			grant_type: "authorization_code",
			redirect_uri: OIDC_REDIRECT_URI,
			code: code as string,
		}).toString(), {
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
		});

		const { access_token } = tokenResponse.data;

		// Fetch user info from OIDC provider
		const userInfoResponse = await axios.get(OIDC_USERINFO_URL, {
			headers: { Authorization: `Bearer ${access_token}` },
		});

		const { sub, email, name } = userInfoResponse.data;

		// Check if user already exists in DB
		let user = await prisma.user.findUnique({ where: { oidcId: sub } });

		if (!user) {
			// Create a new user if not found
			user = await prisma.user.create({
				data: {
					email,
					oidcId: sub,
					authProvider: "oidc",
					slug: name.replace(/\\s+/g, "-").toLowerCase(),
				},
			});
		}

		// Create session for the user
		req.session!.userId = user.id;

		res.redirect("/dashboard"); // Redirect user to dashboard after login
	} catch (error) {
		console.error("OIDC Callback Error:", error);
		res.status(500).json({ error: "OIDC Authentication Failed" });
	}
});

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logs out user
 *     tags: [Authentication]
 */
router.post("/logout", (req: Request, res: Response) => {
	req.session.destroy(() => res.json({ message: "Logged out" }));
});

export default router;