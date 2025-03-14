import express, { Request, Response } from "express";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2023-10-16" });
const prisma = new PrismaClient();
const router = express.Router();

// TODO: Add subscription expiration date
/**
 * @swagger
 * /api/stripe/webhook:
 *   post:
 *     summary: Handle Stripe webhook events to update subscription status
 *     tags: [Payments]
 */
router.post("/webhook", express.raw({ type: "application/json" }), async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return res.status(400).json({ error: "Invalid webhook signature" });
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      if (!session.customer || !session.subscription) return;

      await prisma.user.update({
        where: { stripeCustomerId: session.customer as string },
        data: { isPremium: true, stripeSubscriptionId: session.subscription as string }
      });
      break;

    case "customer.subscription.deleted":
      const deletedSubscription = event.data.object as Stripe.Subscription;

      await prisma.user.updateMany({
        where: { stripeSubscriptionId: deletedSubscription.id },
        data: { isPremium: false, stripeSubscriptionId: null }
      });
      break;
  }

  res.json({ received: true });
});

export default router;