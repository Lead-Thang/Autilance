import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { z } from "zod"

const proposalSchema = z.object({
  coverLetter: z.string().min(1, "Cover letter cannot be empty"),
  estimatedPriceCents: z.number().int().positive("Estimated price must be a positive integer"),
  estimatedDuration: z.string().min(1, "Estimated duration cannot be empty"),
  price: z.number().positive("Price must be a positive number"),
  terms: z.string().optional(),
})

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.getSession()

    if (!session?.user || error) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const jobId = params.id

    let body
    try {
      body = await req.json()
    } catch (error) {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    }

    const validationResult = proposalSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { coverLetter, estimatedPriceCents, estimatedDuration, price, terms } = validationResult.data

    // Check if job exists and is open
    const job = await db.project.findUnique({
      where: { id: jobId },
    })

    if (!job || job.status !== "open") {
      return NextResponse.json({ error: "Job not found or not open" }, { status: 404 })
    }

    // Create proposal
    const proposal = await db.proposal.create({
      data: {
        projectId: jobId,
        freelancerId: session.user.id,
        coverLetter,
        estimatedPriceCents,
        estimatedDuration,
        price,
        terms,
      },
    })

    // Log audit
    await db.auditLog.create({
      data: {
        action: "proposal_submitted",
        actorId: session.user.id,
        payload: { jobId, proposalId: proposal.id },
      },
    })

    return NextResponse.json(proposal)
  } catch (error) {
    console.error("Error creating proposal:", error)
    return NextResponse.json({ error: "Failed to create proposal" }, { status: 500 })
  }
}