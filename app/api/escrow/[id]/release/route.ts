import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"

/**
 * POST release escrow funds to freelancer
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (!session?.user || sessionError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const transactionId = params.id

    // Find the escrow transaction
    const transaction = await db.escrowTransaction.findUnique({
      where: { id: transactionId },
      include: {
        contract: true,
        milestone: true,
      },
    })

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      )
    }

    // Verify the user is the client
    if (transaction.clientId !== session.user.id) {
      return NextResponse.json(
        { error: "Only the client can release funds" },
        { status: 403 }
      )
    }

    // Verify the transaction is in 'held' status
    if (transaction.status !== "held") {
      return NextResponse.json(
        { error: `Cannot release funds. Transaction status is ${transaction.status}` },
        { status: 400 }
      )
    }

    // Update the transaction status to 'released'
    // In a real implementation, this would trigger the actual payment to the freelancer
    const updatedTransaction = await db.escrowTransaction.update({
      where: { id: transactionId },
      data: {
        status: "released",
        releasedAt: new Date(),
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
    })

    // If this is for a milestone, update the milestone status
    if (transaction.milestoneId) {
      await db.milestone.update({
        where: { id: transaction.milestoneId },
        data: { status: "approved" },
      })
    }

    return NextResponse.json({
      message: "Funds released successfully",
      transaction: updatedTransaction,
    })
  } catch (error) {
    console.error("Error releasing escrow funds:", error)
    return NextResponse.json(
      { error: "Failed to release funds" },
      { status: 500 }
    )
  }
}
