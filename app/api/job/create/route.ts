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
    const { title, description, type, kpiSpec, evaluationWindowDays, categoryId, budgetMinCents, budgetMaxCents, estimatedDuration, isRemote, location } = body

    // Validate required fields
    if (!title || !description || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create the job (project)
    const job = await db.project.create({
      data: {
        clientId: session.user.id,
        title,
        description,
        type,
        kpiSpec,
        evaluationWindowDays: evaluationWindowDays || 7,
        budgetMinCents,
        budgetMaxCents,
        estimatedDuration,
        isRemote: isRemote ?? true,
        location,
        categoryId,
        status: "open",
        escrowStatus: "PENDING",
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    // Log audit
    await db.auditLog.create({
      data: {
        action: "job_created",
        actorId: session.user.id,
        payload: { jobId: job.id },
      },
    })

    return NextResponse.json(job)
  } catch (error) {
    console.error("Error creating job:", error)
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 })
  }
}