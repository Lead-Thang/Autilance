import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { z } from "zod"

// GET verification submissions (for a user or company)
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (!session?.user || error) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    const jdId = searchParams.get("jdId")
    const status = searchParams.get("status")
    const limit = parseInt(searchParams.get("limit") || "10")
    const page = parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    // Build the where clause
    const where: any = {}
    
    if (userId) {
      where.userId = userId
    }
    
    if (jdId) {
      where.jdId = jdId
    }
    
    if (status && ["pending", "approved", "rejected"].includes(status)) {
      where.status = status
    }

    const [submissions, total] = await Promise.all([
      db.verificationSubmission.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          jobDescription: {
            select: {
              id: true,
              title: true,
              company: {
                select: {
                  id: true,
                  name: true,
                  logo: true,
                },
              },
            },
          },
          proofs: true,
        },
        orderBy: {
          submittedAt: "desc",
        },
        skip,
        take: limit,
      }),
      db.verificationSubmission.count({ where }),
    ])

    return NextResponse.json({
      submissions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching verification submissions:", error)
    return NextResponse.json({ error: "Failed to fetch verification submissions" }, { status: 500 })
  }
}

// POST create a new verification submission
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (!session?.user || error) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    // Validate the request body
    const schema = z.object({
      userId: z.string(),
      jdId: z.string(),
      proofs: z.array(
        z.object({
          type: z.enum(["skill", "certification", "behavior", "other"]),
          title: z.string(),
          description: z.string().optional(),
          fileUrl: z.string().url("Invalid URL").optional(),
          linkUrl: z.string().url("Invalid URL").optional(),
        })
      ),
      notes: z.string().optional(),
    })

    const validatedData = schema.parse(body)

    // Check if the user already has a pending submission for this JD
    const existingSubmission = await db.verificationSubmission.findFirst({
      where: {
        userId: validatedData.userId,
        jdId: validatedData.jdId,
        status: "pending",
      },
    })

    if (existingSubmission) {
      return NextResponse.json(
        { error: "You already have a pending submission for this job description" },
        { status: 400 }
      )
    }

    // Create the verification submission
    const submission = await db.verificationSubmission.create({
      data: {
        userId: validatedData.userId,
        jdId: validatedData.jdId,
        status: "pending",
        notes: validatedData.notes,
        proofs: {
          create: validatedData.proofs,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        jobDescription: {
          select: {
            id: true,
            title: true,
            company: {
              select: {
                id: true,
                name: true,
                logo: true,
              },
            },
          },
        },
        proofs: true,
      },
    })

    return NextResponse.json(submission, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    
    console.error("Error creating verification submission:", error)
    return NextResponse.json({ error: "Failed to create verification submission" }, { status: 500 })
  }
}