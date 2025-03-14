import { Request, Response, NextFunction } from "express";

export const requirePremium = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.isPremium) {
    return res.status(403).json({ error: "Premium membership required" });
  }
  next();
};