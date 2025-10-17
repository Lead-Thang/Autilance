import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { z } from "zod"

interface EarningsStats {
  totalEarned: number
  totalAvailable: number
  totalPending: number
  totalWithdrawn: number
  monthlyBreakdown: Array<{
    month: string
    year: number
    amount: number
    transactions: number
  }>
  recentTransactions: Array<{
    id: string
    amount: number
    currency: string
    description: string
    date: string
    counterparty: {
      name: string
      image?: string
    }
  }>
}

/**
 * GET earnings statistics for freelancers
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (!session?.user || sessionError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const stats: EarningsStats = {
      totalEarned: 0,
      totalAvailable: 0,
      totalPending: 0,
      totalWithdrawn: 0,
      monthlyBreakdown: [],
      recentTransactions: [],
    }

    // Fetch all escrow transactions where user is freelancer
    const escrowTransactions = await db.escrowTransaction.findMany({
      where: {
        freelancerId: userId,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        contract: {
          select: {
            id: true,
            title: true,
          },
        },
        milestone: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Calculate earnings stats
    escrowTransactions.forEach(transaction => {
      const amount = transaction.amountCents

      // Total earned (all completed releases)
      if (transaction.status === "released") {
        stats.totalEarned += amount
        stats.totalAvailable += amount
      }

      // Currently held in escrow
      if (transaction.status === "held") {
        stats.totalPending += amount
      }

      // TODO: Add withdrawn tracking when withdrawal functionality is implemented
    })

    // Calculate monthly breakdown
    const monthlyMap = new Map<string, { amount: number; transactions: number }>()

    escrowTransactions
      .filter(t => t.status === "released" && t.releasedAt)
      .forEach(transaction => {
        const date = new Date(transaction.releasedAt!)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

        if (!monthlyMap.has(monthKey)) {
          monthlyMap.set(monthKey, { amount: 0, transactions: 0 })
        }

        const monthData = monthlyMap.get(monthKey)!
        monthData.amount += transaction.amountCents
        monthData.transactions += 1
      })

    // Convert monthly map to array format
    stats.monthlyBreakdown = Array.from(monthlyMap.entries())
      .map(([monthKey, data]) => {
        const [year, month] = monthKey.split('-')
        return {
          month: new Date(parseInt(year), parseInt(month) - 1).toLocaleString('en-US', { month: 'long' }),
          year: parseInt(year),
          amount: data.amount,
          transactions: data.transactions,
        }
      })
      .sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year
        return new Date(`${b.month} 1, 2000`).getMonth() - new Date(`${a.month} 1, 2000`).getMonth()
      })

    // Recent transactions (last 10)
    stats.recentTransactions = escrowTransactions
      .filter(t => t.status === "released")
      .sort((a, b) => (b.releasedAt ?? b.createdAt).getTime() - (a.releasedAt ?? a.createdAt).getTime())
      .slice(0, 10)
      .map(transaction => ({
        id: transaction.id,
        amount: transaction.amountCents,
        currency: transaction.currency,
        description: transaction.contract?.title
          ? `Payment for: ${transaction.contract.title}`
          : "Escrow payment",
        date: transaction.releasedAt?.toISOString() || transaction.createdAt.toISOString(),
        counterparty: {
          name: transaction.client.name || "Client",
          image: transaction.client.image || undefined,
        },
      }))

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching earnings:", error)
    return NextResponse.json(
      { error: "Failed to fetch earnings data" },
      { status: 500 }
    )
  }
}