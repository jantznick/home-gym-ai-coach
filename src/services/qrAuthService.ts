import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export const createQrSession = async () => {
  const sessionToken = uuidv4(); // Unique session ID
  await prisma.qrAuthSession.create({
    data: { token: sessionToken, status: "pending" },
  });
  return sessionToken;
};

export const checkQrSessionStatus = async (sessionToken: string) => {
  const session = await prisma.qrAuthSession.findUnique({ where: { token: sessionToken } });
  return session ? { authenticated: session.status === "authenticated", userId: session.userId } : null;
};