import { db } from "@/lib/db"

/**
 * Calculate the commission for a transaction based on Autilance's 5% rate
 * with XP level discounts for elite users
 */
export function calculateCommission(grossAmountCents: number, userLevel: number): {
  commissionAmount: number
  netAmount: number
  levelDiscount: number
  finalCommission: number
  commissionRate: number
} {
  const baseRate = 0.05 // 5% base rate

  // Level discount: Elite users (level 30+) get 1% off
  let levelDiscount = 0
  if (userLevel >= 30) {
    levelDiscount = 0.01 // 1% discount
  }

  const effectiveRate = Math.max(0, baseRate - levelDiscount)
  const commissionAmount = Math.round(grossAmountCents * baseRate) // Full 5%
  const finalCommission = Math.round(grossAmountCents * effectiveRate) // After discount
  const netAmount = grossAmountCents - finalCommission

  return {
    commissionAmount,
    netAmount,
    levelDiscount,
    finalCommission,
    commissionRate: baseRate
  }
}

/**
 * Get user's current level for commission calculations
 */
export async function getUserLevel(userId: string): Promise<number> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { level: true }
  })

  return user?.level || 1
}

/**
 * Create a commission log entry for transparency
 */
export async function createCommissionLog({
  transactionId,
  grossAmount,
  userId
}: {
  transactionId: string
  grossAmount: number
  userId: string
}) {
  const userLevel = await getUserLevel(userId)
  const {
    commissionAmount,
    netAmount,
    levelDiscount,
    finalCommission,
    commissionRate
  } = calculateCommission(grossAmount, userLevel)

  return db.commissionLog.create({
    data: {
      transactionId,
      grossAmount,
      commissionRate,
      commissionAmount,
      netAmount,
      levelDiscount,
      finalCommission
    }
  })
}

/**
 * Get commission summary for a user (month/year)
 */
export async function getCommissionSummary(userId: string, period: 'month' | 'year' = 'month') {
  const startDate = new Date()
  if (period === 'month') {
    startDate.setMonth(startDate.getMonth() - 1)
  } else {
    startDate.setFullYear(startDate.getFullYear() - 1)
  }

  const logs = await db.commissionLog.findMany({
    where: {
      transaction: {
        clientId: userId
      },
      createdAt: {
        gte: startDate
      }
    },
    include: {
      transaction: {
        select: {
          freelancer: {
            select: { name: true }
          }
        }
      }
    }
  })

  const totalCommission = logs.reduce((sum, log) => sum + log.finalCommission, 0)
  const totalVolume = logs.reduce((sum, log) => sum + log.grossAmount, 0)
  const transactionCount = logs.length

  return {
    period,
    totalCommission,
    totalVolume,
    transactionCount,
    averageRate: totalVolume > 0 ? totalCommission / totalVolume : 0,
    transactions: logs.map(log => ({
      id: log.id,
      amount: log.grossAmount,
      commission: log.finalCommission,
      rate: log.grossAmount > 0 ? log.finalCommission / log.grossAmount : 0,
      freelancer: log.transaction.freelancer?.name,
      date: log.createdAt
    }))
  }
}