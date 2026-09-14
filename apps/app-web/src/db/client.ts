import { PrismaClient } from './generated/client'

// Serverless 环境下避免热重载/多实例导致连接数暴涨，复用全局单例。
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma: PrismaClient = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
