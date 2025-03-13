import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Extend Express request to store user details
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string };
    }
  }
}

/**
 * Middleware: Authenticate user from session & attach `req.user`
 */
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.userId) {
    return next(); // No session, user is not logged in
  }

  const user = await prisma.user.findUnique({
    where: { id: req.session.userId },
    select: { id: true, email: true },
  });

  if (user) req.user = user;

  next();
};

/**
 * Middleware: Protect routes (Only authenticated users can access)
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized - Login required" });
  }
  next();
};