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
    const { contractId, subject, description, evidence } = body

    // Server-side validation
    if (!contractId || typeof contractId !== 'string' || contractId.trim() === '') {
      return NextResponse.json({ error: "contractId is required and must be a non-empty string" }, { status: 400 })
    }

    // Validate UUID format for contractId
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(contractId.trim())) {
      return NextResponse.json({ error: "contractId must be a valid UUID" }, { status: 400 })
    }

    if (!subject || typeof subject !== 'string' || subject.trim() === '') {
      return NextResponse.json({ error: "subject is required and must be a non-empty string" }, { status: 400 })
    }

    if (!description || typeof description !== 'string' || description.trim() === '') {
      return NextResponse.json({ error: "description is required and must be a non-empty string" }, { status: 400 })
    }

    // Validate evidence if provided
    if (evidence !== undefined && evidence !== null) {
      if (!Array.isArray(evidence) && typeof evidence !== 'string') {
        return NextResponse.json({ error: "evidence must be an array or string if provided" }, { status: 400 })
      }
    }

    // Sanitize string inputs
    const sanitizedContractId = contractId.trim()
    const sanitizedSubject = subject.trim()
    const sanitizedDescription = description.trim()

    // Check if user is part of contract
    const contract = await db.contract.findUnique({
      where: { id: sanitizedContractId }
    })

    if (!contract || (contract.clientId !== session.user.id && contract.freelancerId !== session.user.id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Create dispute and log audit in a transaction
    const dispute = await db.$transaction(async (tx) => {
      const dispute = await tx.dispute.create({
        data: {
          contractId: sanitizedContractId,
          filedById: session.user.id,
          subject: sanitizedSubject,
          description: sanitizedDescription,
          evidence: evidence || [],
        },
      })

      // Log audit
      await tx.auditLog.create({
        data: {
          action: "dispute_filed",
          actorId: session.user.id,
          payload: { disputeId: dispute.id, contractId: sanitizedContractId },
        },
      })

      return dispute
    })

    // AI summarizer (placeholder)
    // TODO: call AI to summarize dispute

    return NextResponse.json(dispute)
  } catch (error) {
    console.error("Error creating dispute:", error instanceof Error ? error.message : "Unknown error")
    return NextResponse.json({ error: "Failed to create dispute" }, { status: 500 })
  }
}