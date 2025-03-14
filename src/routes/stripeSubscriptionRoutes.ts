import express, { Request, Response } from "express";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { requireAuth } from "../middleware/authMiddleware";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2023-10-16" });
const prisma = new PrismaClient();
const router = express.Router();

/**
 * @swagger
 * /api/stripe/subscription/status:
 *   get:
 *     summary: Get current user's subscription status
 *     tags: [Payments]
 */
router.get("/status", requireAuth, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      select: { isPremium: true, stripeSubscriptionId: true }
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ isPremium: user.isPremium, subscriptionId: user.stripeSubscriptionId });
  } catch (error) {
    console.error("Error fetching subscription status:", error);
    res.status(500).json({ error: "Unable to fetch subscription status" });
  }
});

/**
 * @swagger
 * /api/stripe/subscription/cancel:
 *   post:
 *     summary: Cancel current user's subscription
 *     tags: [Payments]
 */
router.post("/cancel", requireAuth, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      select: { stripeSubscriptionId: true }
    });

    if (!user || !user.stripeSubscriptionId) return res.status(400).json({ error: "No active subscription to cancel" });

    // Cancel the Stripe subscription
    await stripe.subscriptions.update(user.stripeSubscriptionId, { cancel_at_period_end: true });

    res.json({ message: "Subscription cancellation scheduled" });
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    res.status(500).json({ error: "Unable to cancel subscription" });
  }
});

/**
 * @swagger
 * /api/stripe/subscription/update:
 *   post:
 *     summary: Update user's subscription to a different plan
 *     tags: [Payments]
 */
router.post("/update", requireAuth, async (req: Request, res: Response) => {
  try {
    const { newPriceId } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      select: { stripeSubscriptionId: true }
    });

    if (!user || !user.stripeSubscriptionId) return res.status(400).json({ error: "No active subscription to update" });

    const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
    const currentItemId = subscription.items.data[0].id; // Get current subscription item

    await stripe.subscriptions.update(user.stripeSubscriptionId, {
      items: [{ id: currentItemId, price: newPriceId }]
    });

    res.json({ message: "Subscription updated successfully" });
  } catch (error) {
    console.error("Error updating subscription:", error);
    res.status(500).json({ error: "Unable to update subscription" });
  }
});

export default router;