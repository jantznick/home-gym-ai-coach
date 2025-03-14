import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import session from "express-session";
import pgSession from "connect-pg-simple";
import { PrismaClient } from "@prisma/client";
import http from "http";

import setupSwagger from './swagger'
import userRoutes from './routes/userRoutes'
import exerciseRoutes from './routes/exerciseRoutes'
import workoutRoutes from "./routes/workoutRoutes";
import muscleRoutes from "./routes/muscleRoutes";
import authRoutes from "./routes/authRoutes";
import friendRoutes from "./routes/friendsRoutes";
import feedRoutes from "./routes/feedRoutes";
import stravaRoutes from "./routes/stravaRoutes";
import adminRoutes from "./routes/adminRoutes";
import qrAuthRoutes from "./routes/qrAuthRoutes";
import stripeRoutes from "./routes/stripeRoutes";
import stripeWebhook from "./routes/stripeWebhook";
import stripeSubscriptionRoutes from "./routes/stripeSubscriptionRoutes";
import oauthRoutes from "./routes/oauthRoutes";
import aiRoutes from "./routes/aiRoutes";
import chatRoutes from "./routes/chatRoutes";

import { authenticateUser } from "./middleware/authMiddleware";
import { requirePremium } from './middleware/premiumMiddleware';

import { setupWebSocket } from "./utils/websocket";

dotenv.config()
const prisma = new PrismaClient();

export const app = express()
const server = http.createServer(app); // Wrap Express with HTTP server
const io = setupWebSocket(server);

const PGSessionStore = pgSession(session);

app.use(
	session({
		store: new PGSessionStore({
			conObject: {
				connectionString: process.env.DATABASE_URL,
			},
		}),
		secret: process.env.SESSION_SECRET || "defaultSecret",
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: false,
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 30, // 30 day session expiry
		},
	})
);

// Middleware
app.use(express.json()) // Parse JSON request body
app.use(cors())

// Setup Swagger
setupSwagger(app)

app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/oauth", oauthRoutes);
app.use("/api/qr-login", qrAuthRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/stripe/webhook", stripeWebhook);

// Authentication Middleware
app.use(authenticateUser);

// Routes
app.use('/api/users', userRoutes)
app.use('/api/exercises', exerciseRoutes)
app.use("/api/workouts", workoutRoutes);
app.use("/api/muscles", muscleRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/strava", stravaRoutes);
app.use("/api/stripe/subscription", stripeSubscriptionRoutes);

// TODO: figure this error out
app.use(requirePremium(req, res, next));
app.use("/api/ai", aiRoutes);

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀🚀🚀 Server running on port ${PORT}, Docs at http://localhost:${PORT}/api-docs 🚀🚀🚀`))