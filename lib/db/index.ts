import { PrismaClient } from '@prisma/client'

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// Create a single instance of PrismaClient
const prismaClient = new PrismaClient()

export const db = globalThis.prisma ?? prismaClient

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db
}