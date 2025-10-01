import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"

// GET all projects
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get("limit") || "10")
    const page = parseInt(searchParams.get("page") || "1")
    const categoryId = searchParams.get("categoryId")
    const clientId = searchParams.get("clientId")
    const status = searchParams.get("status")
    const skip = (page - 1) * limit

    const where: any = {
      status: "open",
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (clientId) {
      where.clientId = clientId
    }

    if (status) {
      where.status = status
    }

    const [projects, total] = await Promise.all([
      db.project.findMany({
        where,
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
          proposals: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      db.project.count({ where }),
    ])

    return NextResponse.json({
      projects,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

// POST create a new project
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (!session?.user || error) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    // Create the project
    const project = await db.project.create({
      data: {
        clientId: session.user.id,
        title: body.title,
        description: body.description,
        categoryId: body.categoryId,
        budgetMinCents: body.budgetMinCents,
        budgetMaxCents: body.budgetMaxCents,
        estimatedDuration: body.estimatedDuration,
        isRemote: body.isRemote,
        location: body.location,
        status: "open",
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

    return NextResponse.json(project)
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}