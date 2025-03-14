import express, { Request, Response } from "express";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2023-10-16" });
const prisma = new PrismaClient();
const router = express.Router();

/**
 * @swagger
 * /api/stripe/checkout:
 *   post:
 *     summary: Initiate Stripe Checkout for premium subscription
 *     tags: [Payments]
 */
router.post("/checkout", async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    // Get user
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

	// TODO: add expiration date
    // If user doesn't already have a Stripe customer ID, create one
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email });
      customerId = customer.id;
      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId }
      });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: process.env.STRIPE_PREMIUM_PRICE_ID!, quantity: 1 }],
      success_url: `http://localhost:5000/api/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5000/cancel`
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    res.status(500).json({ error: "Unable to start checkout session" });
  }
});

export default router;