import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

export function getPrisma(): PrismaClient {
  if (global.prisma) return global.prisma;
  const client = createPrismaClient();
  if (process.env.NODE_ENV !== "production") {
    global.prisma = client;
  }
  return client;
}
