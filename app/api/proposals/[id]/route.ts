import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"

// PUT update a specific proposal (accept/reject)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (!session?.user || error) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    // Check if the proposal exists
    const proposal = await db.proposal.findUnique({
      where: {
        id: params.id,
      },
      include: {
        project: true,
      },
    })

    if (!proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 })
    }

    // Check if the project belongs to the user (only client can accept/reject)
    if (proposal.project.clientId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Update the proposal status
    const updatedProposal = await db.proposal.update({
      where: {
        id: params.id,
      },
      data: {
        status: body.status, // 'accepted' or 'rejected'
      },
      include: {
        freelancer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    // If accepted, create a contract
    if (body.status === "accepted") {
      await db.contract.create({
        data: {
          projectId: proposal.projectId,
          freelancerId: proposal.freelancerId,
          clientId: session.user.id,
          title: `Contract for ${proposal.project.title}`,
          description: proposal.coverLetter || `Contract for project: ${proposal.project.title}`,
          status: "active",
        },
      })

      // Update project status to in_progress
      await db.project.update({
        where: {
          id: proposal.projectId,
        },
        data: {
          status: "in_progress",
        },
      })
    }

    return NextResponse.json(updatedProposal)
  } catch (error) {
    console.error("Error updating proposal:", error)
    return NextResponse.json({ error: "Failed to update proposal" }, { status: 500 })
  }
}