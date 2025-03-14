import express, { Request, Response } from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();
const prisma = new PrismaClient();
const router = express.Router();

/**
 * Google OAuth Login Flow
 * Step 1: Redirect User to Google OAuth URL
 */
router.get("/google", (req: Request, res: Response) => {
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=email%20profile`;
  res.redirect(googleAuthUrl);
});

/**
 * Google OAuth Callback (Step 2)
 */
router.get("/google/callback", async (req: Request, res: Response) => {
  try {
    const { code } = req.query;

    const tokenRes = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
      code,
    });

    const { id_token } = tokenRes.data;
    
    const decodedToken: any = jwt.decode(id_token);
    if (!decodedToken) throw new Error("Invalid Google token");

    let user = await prisma.user.findUnique({ where: { providerId: decodedToken.sub } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: decodedToken.email,
          name: decodedToken.name,
          authProvider: "google",
          providerId: decodedToken.sub,
        }
      });
    }

	// TODO: Verify cookie stuff is accurate because it feels very off, it's only on google too
	req.session.userId = user.id;

    res.json({ message: "Google login successful", user });
  } catch (error) {
    console.error("Google Auth Error", error);
    res.status(500).json({ error: "Authentication failed" });
  }
});

/**
 * Facebook OAuth Login Flow
 */
router.get("/facebook", (req: Request, res: Response) => {
  const facebookAuthUrl = `https://www.facebook.com/v15.0/dialog/oauth?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}&scope=email,public_profile`;
  res.redirect(facebookAuthUrl);
});

/**
 * Facebook OAuth Callback
 */
router.get("/facebook/callback", async (req: Request, res: Response) => {
  try {
    const { code } = req.query;

    const tokenRes = await axios.get(`https://graph.facebook.com/v15.0/oauth/access_token`, {
      params: {
        client_id: process.env.FACEBOOK_CLIENT_ID,
        client_secret: process.env.FACEBOOK_CLIENT_SECRET,
        redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
        code,
      },
    });

    const userRes = await axios.get(`https://graph.facebook.com/me?fields=id,name,email`, {
      headers: { Authorization: `Bearer ${tokenRes.data.access_token}` }
    });

    let user = await prisma.user.findUnique({ where: { providerId: userRes.data.id } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userRes.data.email || "",
          name: userRes.data.name,
          authProvider: "facebook",
          providerId: userRes.data.id,
        }
      });
    }

    res.json({ message: "Facebook login successful", user });
  } catch (error) {
    console.error("Facebook Auth Error", error);
    res.status(500).json({ error: "Authentication failed" });
  }
});

/**
 * Apple OAuth Login Flow
 */
router.get("/apple", (req: Request, res: Response) => {
  const appleAuthUrl = `https://appleid.apple.com/auth/authorize?client_id=${process.env.APPLE_CLIENT_ID}&redirect_uri=${process.env.APPLE_REDIRECT_URI}&response_type=code&scope=name%20email`;
  res.redirect(appleAuthUrl);
});

/**
 * Apple OAuth Callback
 */
router.get("/apple/callback", async (req: Request, res: Response) => {
  try {
    const { code } = req.query;

    const privateKey = fs.readFileSync(process.env.APPLE_PRIVATE_KEY_PATH!, "utf8");

    const tokenRes = await axios.post(`https://appleid.apple.com/auth/token`, null, {
      params: {
        client_id: process.env.APPLE_CLIENT_ID,
        client_secret: privateKey,
        redirect_uri: process.env.APPLE_REDIRECT_URI,
        grant_type: "authorization_code",
        code,
      },
    });

    const decodedToken: any = jwt.decode(tokenRes.data.id_token);
    if (!decodedToken) throw new Error("Invalid Apple token");

    let user = await prisma.user.findUnique({ where: { providerId: decodedToken.sub } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: decodedToken.email || "",
          name: "Apple User",
          authProvider: "apple",
          providerId: decodedToken.sub,
        }
      });
    }

    res.json({ message: "Apple login successful", user });

  } catch (error) {
    console.error("Apple Auth Error", error);
    res.status(500).json({ error: "Authentication failed" });
  }
});

export default router;