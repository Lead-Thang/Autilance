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

    const jobId = params.id
    const body = await req.json()
    const { proposalId, milestones } = body // milestones: [{ title, amountCents, dueDate }]

    // Validate request body to prevent runtime errors
    if (!proposalId || !Array.isArray(milestones) || milestones.length === 0) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    // Validate request body
    if (!proposalId || typeof proposalId !== 'string') {
      return NextResponse.json({ error: "Proposal ID is required and must be a string" }, { status: 400 })
    }

    if (!Array.isArray(milestones) || milestones.length === 0) {
      return NextResponse.json({ error: "Milestones must be an array with at least one milestone" }, { status: 400 })
    }

    // Validate each milestone
    for (const [index, m] of milestones.entries()) {
      if (!m.title || typeof m.title !== 'string' || m.title.trim() === '') {
        return NextResponse.json({ error: `Milestone ${index + 1}: title is required and must be a non-empty string` }, { status: 400 })
      }

      if (typeof m.amountCents !== 'number' || !Number.isFinite(m.amountCents) || m.amountCents <= 0) {
        return NextResponse.json({ error: `Milestone ${index + 1}: amountCents must be a positive number` }, { status: 400 })
      }

      if (!m.dueDate || typeof m.dueDate !== 'string') {
        return NextResponse.json({ error: `Milestone ${index + 1}: dueDate is required and must be a valid date string` }, { status: 400 })
      }

      // Check if dueDate is a valid date
      const dueDate = new Date(m.dueDate)
      if (isNaN(dueDate.getTime())) {
        return NextResponse.json({ error: `Milestone ${index + 1}: dueDate must be a valid date` }, { status: 400 })
      }
    }

    // Check if job belongs to user
    const job = await db.project.findUnique({
      where: { id: jobId },
    })

    if (!job || job.clientId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Validate job state - only allow accepting jobs that are open or posted
    const allowedStates = ["open", "posted"]
    if (!allowedStates.includes(job.status)) {
      return NextResponse.json({
        error: `Job cannot be accepted - current status: ${job.status}. Only jobs with status 'open' or 'posted' can be accepted.`
      }, { status: 409 })
    }

    // Get proposal
    const proposal = await db.proposal.findUnique({
      where: { id: proposalId },
      include: { freelancer: true },
    })

    if (!proposal || proposal.projectId !== jobId) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 })
    }

    if (proposal.status !== "submitted") {
      return NextResponse.json({ error: "Proposal has already been accepted or rejected" }, { status: 409 })
    }

    // Calculate total amount for escrow
    const totalAmount = milestones.reduce((sum, m) => sum + m.amountCents, 0)

    // Create contract, milestones, escrow, and update job status atomically
    const result = await db.$transaction(async (tx) => {
      // Create contract
      const contract = await tx.contract.create({
        data: {
          projectId: jobId,
          freelancerId: proposal.freelancerId,
          clientId: session.user.id,
          title: job.title,
          description: job.description,
        },
      })

      // Create all milestones in batch
      await tx.milestone.createMany({
        data: milestones.map(m => ({
          contractId: contract.id,
          title: m.title,
          amountCents: m.amountCents,
          dueDate: new Date(m.dueDate),
        })),
      })

      // Create escrow transaction
      const escrow = await tx.escrowTransaction.create({
        data: {
          clientId: session.user.id,
          freelancerId: proposal.freelancerId,
          amountCents: totalAmount,
          contractId: contract.id,
          status: "pending",
        },
      })

      // Update job status to in_progress
      await tx.project.update({
        where: { id: jobId },
        data: { status: "in_progress", escrowStatus: "PENDING" },
      })

      // Create audit log
      await tx.auditLog.create({
        data: {
          action: "job_accepted",
          actorId: session.user.id,
          payload: { jobId, contractId: contract.id, milestoneCount: milestones.length },
        },
      })

      return { contract, escrow }
    })

    // Fetch created milestones for response
    const createdMilestones = await db.milestone.findMany({
      where: { contractId: result.contract.id },
    })

    return NextResponse.json({
      contract: result.contract,
      milestones: createdMilestones,
      escrow: result.escrow
    })
  } catch (error) {
    console.error("Error accepting job:", error)
    return NextResponse.json({ error: "Failed to accept job" }, { status: 500 })
  }
}