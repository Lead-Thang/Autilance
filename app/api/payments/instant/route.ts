import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.getSession()

    if (!session?.user || error) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { amount, fee } = body

    // Convert amounts to cents to avoid floating-point precision issues
    const amountCents = Math.round(amount * 100)
    const feeCents = Math.round(fee * 100)

    // Check wallet balance
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { walletBalance: true },
    })

    if (!user || user.walletBalance < amountCents + feeCents) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
    }

    // Deduct fee and amount
    await db.user.update({
      where: { id: session.user.id },
      data: { walletBalance: user.walletBalance - amountCents - feeCents },
    })

    // Create transaction
    await db.transaction.create({
      data: {
        type: "instant_payout",
        amount,
        fromId: session.user.id,
        status: "completed",
        metadata: { fee },
      },
    })

    // Log audit
    await db.auditLog.create({
      data: {
        action: "instant_payout",
        actorId: session.user.id,
        payload: { amount, fee },
      },
    })

    return NextResponse.json({ message: "Payout processed" })
  } catch (error) {
    console.error("Error processing payout:", error)
    return NextResponse.json({ error: "Failed to process payout" }, { status: 500 })
  }
}