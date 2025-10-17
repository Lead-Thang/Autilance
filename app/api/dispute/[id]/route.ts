import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.getSession()

    if (!session?.user || error) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const disputeId = id

    const dispute = await db.dispute.findUnique({
      where: { id: disputeId },
      include: {
        contract: {
          include: {
            client: { select: { id: true, name: true } },
            freelancer: { select: { id: true, name: true } },
          },
        },
        filedBy: { select: { id: true, name: true } },
        resolutions: true,
      },
    })

    if (!dispute) {
      return NextResponse.json({ error: "Dispute not found" }, { status: 404 })
    }

    // Check if user is authorized to view this dispute
    const userId = session.user.id
    const userRole = (session.user as any).role // Type assertion in case `role` isn’t on the Supabase User type

    const isParticipant =
      dispute.contract.clientId === userId ||
      dispute.contract.freelancerId === userId
    const isModerator = userRole === "MODERATOR"

    if (!isParticipant && !isModerator) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(dispute)
  } catch (error) {
    console.error("Error fetching dispute:", error)
    return NextResponse.json({ error: "Failed to fetch dispute" }, { status: 500 })
  }
}