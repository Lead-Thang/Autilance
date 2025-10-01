import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"

// GET all proposals for a project
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (!session?.user || error) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the project belongs to the user (client)
    const project = await db.project.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    if (project.clientId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get("limit") || "10")
    const page = parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    const [proposals, total] = await Promise.all([
      db.proposal.findMany({
        where: {
          projectId: params.id,
        },
        include: {
          freelancer: {
            select: {
              id: true,
              name: true,
              image: true,
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      db.proposal.count({
        where: {
          projectId: params.id,
        },
      }),
    ])

    return NextResponse.json({
      proposals,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching proposals:", error)
    return NextResponse.json({ error: "Failed to fetch proposals" }, { status: 500 })
  }
}

// POST create a new proposal for a project
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (!session?.user || error) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the project exists and is open
    const project = await db.project.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    if (project.status !== "open") {
      return NextResponse.json({ error: "Project is not open for proposals" }, { status: 400 })
    }

    // Check if freelancer has already submitted a proposal
    const existingProposal = await db.proposal.findFirst({
      where: {
        projectId: params.id,
        freelancerId: session.user.id,
      },
    })

    if (existingProposal) {
      return NextResponse.json({ error: "You have already submitted a proposal for this project" }, { status: 400 })
    }

    const body = await req.json()

    // Create the proposal
    const proposal = await db.proposal.create({
      data: {
        projectId: params.id,
        freelancerId: session.user.id,
        coverLetter: body.coverLetter,
        estimatedPriceCents: body.estimatedPriceCents,
        estimatedDuration: body.estimatedDuration,
        status: "submitted",
      },
      include: {
        freelancer: {
          select: {
            id: true,
            name: true,
            image: true,
            profile: true,
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

    return NextResponse.json(proposal)
  } catch (error) {
    console.error("Error creating proposal:", error)
    return NextResponse.json({ error: "Failed to create proposal" }, { status: 500 })
  }
}