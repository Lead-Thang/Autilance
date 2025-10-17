import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.getSession()

    if (!session?.user || error) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const milestoneId = params.id
    const body = await req.json()
    const { partialRelease } = body // optional partial amount

    // Check if milestone belongs to client
    const milestone = await db.milestone.findUnique({
      where: { id: milestoneId },
      include: { contract: { include: { client: true, freelancer: true } }, escrowTransaction: true },
    })

    if (!milestone || milestone.contract.clientId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    if (partialRelease !== undefined && partialRelease !== null) {
      if (!Number.isFinite(partialRelease) || partialRelease <= 0 || partialRelease > milestone.amountCents) {
        return NextResponse.json({ error: "Invalid partialRelease value" }, { status: 400 })
      }
    }

    const releaseAmount = partialRelease ?? milestone.amountCents

    await db.$transaction(async (tx) => {
      // Update escrow (placeholder, integrate Stripe)
      if (milestone.escrowTransaction) {
        await tx.escrowTransaction.update({
          where: { id: milestone.escrowTransaction.id },
          data: { status: "released", releasedAt: new Date() },
        })
      }

      // Update milestone status
      await tx.milestone.update({
        where: { id: milestoneId },
        data: { status: "approved" },
      })

      // Create transaction record
      await tx.transaction.create({
        data: {
          type: "escrow_release",
          amount: releaseAmount,
          fromId: session.user.id,
          toId: milestone.contract.freelancerId,
          status: "completed",
          metadata: { milestoneId },
        },
      })

      // Log audit
      await tx.auditLog.create({
        data: {
          action: "milestone_accepted",
          actorId: session.user.id,
          payload: { milestoneId, releaseAmount },
        },
      })
    })

    return NextResponse.json({ message: "Milestone accepted", releaseAmount })
  } catch (error) {
    console.error("Error accepting milestone:", error)
    return NextResponse.json({ error: "Failed to accept milestone" }, { status: 500 })
  }
}