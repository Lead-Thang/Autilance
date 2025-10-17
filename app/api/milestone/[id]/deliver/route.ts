import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import crypto from "crypto"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.getSession()

    if (!session?.user || error) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const milestoneId = params.id
    const body = await req.json()
    const { fileUrl } = body

    // Check if milestone belongs to user
    const milestone = await db.milestone.findUnique({
      where: { id: milestoneId },
      include: { contract: { include: { freelancer: true, client: true } } },
    })

    if (!milestone || milestone.contract.freelancerId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Compute file hash (placeholder, in real impl fetch file and hash)
    const fileHash = crypto.createHash("sha256").update(fileUrl).digest("hex") // placeholder

    // Create delivery
    const delivery = await db.delivery.create({
      data: {
        milestoneId,
        fileUrl,
        fileHash,
        notified: false,
      },
    })

    // Update milestone status
    await db.milestone.update({
      where: { id: milestoneId },
      data: { status: "review" },
    })

    // Notify buyer (placeholder, implement notification)
    // TODO: send notification

    // Log audit
    await db.auditLog.create({
      data: {
        action: "milestone_delivered",
        actorId: session.user.id,
        payload: { milestoneId, deliveryId: delivery.id, fileHash },
      },
    })

    return NextResponse.json(delivery)
  } catch (error) {
    console.error("Error delivering milestone:", error)
    return NextResponse.json({ error: "Failed to deliver milestone" }, { status: 500 })
  }
}