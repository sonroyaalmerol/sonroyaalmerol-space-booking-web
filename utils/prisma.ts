import { PrismaClient } from "@prisma/client"

// Add prisma to the NodeJS global type
declare global {
  var prisma: PrismaClient | undefined
}

// Prevent multiple instances of Prisma Client in development
const client = globalThis.prisma || new PrismaClient()
if (process.env.NODE_ENV !== "production") globalThis.prisma = client

export default client