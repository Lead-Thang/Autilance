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
    const { reason, evidence } = body

    if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
      return NextResponse.json(
        { error: "Reason is required and must be a non-empty string" },
        { status: 400 }
      )
    }

    if (evidence !== undefined && typeof evidence !== 'string') {
      return NextResponse.json(
        { error: "Evidence must be a string if provided" },
        { status: 400 }
      )
    }

    // Create appeal (placeholder, perhaps add Appeal model or use AuditLog)
    await db.auditLog.create({
      data: {
        action: "appeal_filed",
        actorId: session.user.id,
        payload: { reason, evidence },
      },
    })

    return NextResponse.json({ message: "Appeal submitted" })
  } catch (error) {
    console.error("Error creating appeal:", error)
    return NextResponse.json({ error: "Failed to create appeal" }, { status: 500 })
  }
}