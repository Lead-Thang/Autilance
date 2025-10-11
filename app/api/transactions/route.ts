import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { z } from "zod"

interface TransactionRecord {
  id: string
  type: "incoming" | "outgoing"
  amount: number
  currency: string
  status: string
  description: string
  date: string
  counterparty: {
    name: string
    image?: string
  }
  category: string
}

/**
 * GET transactions - Aggregates all financial transactions for a user
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (!session?.user || sessionError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const searchQuery = searchParams.get("search") || ""
    const filterType = searchParams.get("type") || "all" // 'all', 'incoming', 'outgoing'
    const filterStatus = searchParams.get("status") || "all" // 'all', 'completed', 'pending', 'failed'
    const limit = parseInt(searchParams.get("limit") || "20")
    const page = parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    const userId = session.user.id
    const transactions: TransactionRecord[] = []

    // Fetch escrow transactions (both as client and freelancer)
    const escrowTransactions = await db.escrowTransaction.findMany({
      where: {
        OR: [
          { clientId: userId },
          { freelancerId: userId },
        ],
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        freelancer: {
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

    // Convert escrow transactions to unified format
    escrowTransactions.forEach(escrow => {
      // For freelancers, escrow releases are incoming
      if (escrow.freelancerId === userId && escrow.status === "released") {
        transactions.push({
          id: escrow.id,
          type: "incoming",
          amount: escrow.amountCents,
          currency: escrow.currency,
          status: escrow.status,
          description: escrow.contract?.title
            ? `Payment received for: ${escrow.contract.title}`
            : "Escrow payment received",
          date: escrow.releasedAt?.toISOString() || escrow.createdAt.toISOString(),
          counterparty: {
            name: escrow.client.name || "Client",
            image: escrow.client.image || undefined,
          },
          category: "escrow",
        })
      }

      // For clients, escrow holds are outgoing
      if (escrow.clientId === userId && escrow.status === "held") {
        transactions.push({
          id: escrow.id,
          type: "outgoing",
          amount: escrow.amountCents,
          currency: escrow.currency,
          status: escrow.status,
          description: escrow.contract?.title
            ? `Escrow held for: ${escrow.contract.title}`
            : "Escrow payment held",
          date: escrow.createdAt.toISOString(),
          counterparty: {
            name: escrow.freelancer.name || "Freelancer",
            image: escrow.freelancer.image || undefined,
          },
          category: "escrow",
        })
      }
    })

    // Fetch marketplace orders (for clients)
    const orders = await db.order.findMany({
      where: {
        clientId: userId,
      },
      include: {
        offer: {
          include: {
            freelancer: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Convert orders to unified format
    orders.forEach(order => {
      transactions.push({
        id: order.id,
        type: "outgoing",
        amount: order.totalPriceCents,
        currency: "USD", // Assuming USD for marketplace
        status: order.status === "completed" ? "completed" : "pending",
        description: order.offer?.title || "Marketplace purchase",
        date: order.createdAt.toISOString(),
        counterparty: {
          name: order.offer?.freelancer?.name || "Freelancer",
          image: order.offer?.freelancer?.image || undefined,
        },
        category: "marketplace",
      })
    })

    // Apply filters
    let filteredTransactions = transactions.filter(transaction => {
      // Search filter
      const matchesSearch =
        transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.counterparty.name.toLowerCase().includes(searchQuery.toLowerCase())

      // Type filter
      const matchesType = filterType === "all" || transaction.type === filterType

      // Status filter
      const matchesStatus = filterStatus === "all" || transaction.status === filterStatus

      return matchesSearch && matchesType && matchesStatus
    })

    // Sort by date descending
    filteredTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Paginate
    const paginatedTransactions = filteredTransactions.slice(skip, skip + limit)

    return NextResponse.json({
      transactions: paginatedTransactions,
      meta: {
        total: filteredTransactions.length,
        page,
        limit,
        totalPages: Math.ceil(filteredTransactions.length / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    )
  }
}