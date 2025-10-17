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
    const { contractId, revieweeId, rating, comment } = body

    // Check if user completed contract
    const contract = await db.contract.findUnique({
      where: { id: contractId },
    })

    if (!contract || (contract.clientId !== session.user.id && contract.freelancerId !== session.user.id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Create review
    const review = await db.review.create({
      data: {
        reviewerId: session.user.id,
        revieweeId,
        contractId,
        rating,
        comment,
        visible: false, // Set visible after evaluation window or mutual completion
      },
    })

    // Log audit
    await db.auditLog.create({
      data: {
        action: "review_created",
        actorId: session.user.id,
        payload: { reviewId: review.id, contractId },
      },
    })

    return NextResponse.json(review)
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}