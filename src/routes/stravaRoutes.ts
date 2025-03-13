import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import dotenv from "dotenv";

import { requireAuth } from "../middleware/authMiddleware";

dotenv.config();

const router = express.Router();
const prisma = new PrismaClient();
const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
const STRAVA_REDIRECT_URI = process.env.STRAVA_REDIRECT_URI;

/**
 * @swagger
 * /api/strava/auth:
 *   get:
 *     summary: Redirect user to Strava authentication
 *     tags: [Strava]
 */
router.get("/auth", (req: Request, res: Response) => {
  const stravaAuthUrl = `https://www.strava.com/oauth/authorize?client_id=${STRAVA_CLIENT_ID}&redirect_uri=${STRAVA_REDIRECT_URI}&response_type=code&scope=activity:write`;
  res.redirect(stravaAuthUrl);
});

/**
 * @swagger
 * /api/strava/callback:
 *   get:
 *     summary: Handle Strava OAuth callback & store access token
 *     tags: [Strava]
 */
router.get("/callback", async (req: Request, res: Response) => {
  try {
    const { code } = req.query;

    // Exchange authorization code for access token
    const tokenResponse = await axios.post(
      "https://www.strava.com/oauth/token",
      {
        client_id: STRAVA_CLIENT_ID,
        client_secret: STRAVA_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
      }
    );

    const { access_token, refresh_token, expires_at } = tokenResponse.data;

    // Assume user is logged in (Replace with actual user session logic)
    const userId = req.session?.userId;
    if (!userId) return res.status(401).json({ error: "User not logged in" });

    // Store Strava tokens in the database
    await prisma.user.update({
      where: { id: userId },
      data: { stravaAccessToken: access_token, stravaRefreshToken: refresh_token, stravaTokenExpires: new Date(expires_at * 1000) },
    });

    res.json({ message: "Connected to Strava successfully!" });
  } catch (error) {
    console.error("Strava Callback Error:", error);
    res.status(500).json({ error: "Error connecting to Strava" });
  }
});

/**
 * @swagger
 * /api/strava/share:
 *   post:
 *     summary: Share a workout to Strava
 *     tags: [Strava]
 */
router.post("/share", requireAuth, async (req: Request, res: Response) => {
  try {
	// TODO: Clean this up
    const { userId, workoutId } = req.body;

    // Fetch user & workout
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const workout = await prisma.workout.findUnique({ where: { id: workoutId } });

    if (!user || !workout) return res.status(404).json({ error: "User or workout not found" });

    if (!user.stravaAccessToken) return res.status(403).json({ error: "User has not connected Strava" });

    // Post to Strava
    const response = await axios.post(
      "https://www.strava.com/api/v3/activities",
      {
        name: workout.title,
        type: "Workout", 
        description: `Logged via My Fitness App!`,
        elapsed_time: 3600, // Example: Set 1-hour duration (adjust this dynamically)
        distance: 5000,  // Example: Set 5km (adjust for real workout data)
        start_date_local: new Date().toISOString(),
      },
      {
        headers: { Authorization: `Bearer ${user.stravaAccessToken}` },
      }
    );

    res.status(200).json({ message: "Workout shared to Strava!", stravaResponse: response.data });
  } catch (error) {
    console.error("Strava Share Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to share workout to Strava" });
  }
});

export default router;