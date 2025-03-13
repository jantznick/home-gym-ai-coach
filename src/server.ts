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

import { authenticateUser } from "./middleware/authMiddleware";

import { setupWebSocket } from "./utils/websocket";

dotenv.config()
const prisma = new PrismaClient();

const app = express()
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
		cookie: { secure: false, httpOnly: true, maxAge: 86400000 }, // 24 hours
	})
);

// Middleware
app.use(express.json()) // Parse JSON request body
app.use(cors())

// Setup Swagger
setupSwagger(app)

app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/qr-login", qrAuthRoutes);

// Authentication Middleware
app.use(authenticateUser);

// Routes
app.use('/api/users', userRoutes)
app.use('/api/exercises', exerciseRoutes)
app.use("/api/workouts", workoutRoutes);
app.use("/api/muscles", muscleRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/strava", stravaRoutes);


// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀🚀🚀 Server running on port ${PORT}, Docs at http://localhost:${PORT}/api-docs 🚀🚀🚀`))