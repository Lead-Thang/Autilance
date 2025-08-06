import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { z } from "zod"

// GET all public job descriptions
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const companyId = searchParams.get("companyId")
    const limit = parseInt(searchParams.get("limit") || "10")
    const page = parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    const where = {
      isPublic: true,
      ...(companyId ? { companyId } : {}),
    }

    const [jobDescriptions, total] = await Promise.all([
      db.jobDescription.findMany({
        where,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              logo: true,
            },
          },
          requiredSkills: true,
          requiredBehaviors: true,
          requiredCertifications: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      db.jobDescription.count({ where }),
    ])

    return NextResponse.json({
      jobDescriptions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching job descriptions:", error)
    return NextResponse.json({ error: "Failed to fetch job descriptions" }, { status: 500 })
  }
}

// POST create a new job description
export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (!session?.user || error) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    // Validate the request body
    const schema = z.object({
      companyId: z.string(),
      title: z.string().min(3, "Title must be at least 3 characters"),
      description: z.string().optional(),
      isPublic: z.boolean().default(true),
      requiredSkills: z.array(
        z.object({
          name: z.string(),
          level: z.enum(["beginner", "intermediate", "advanced", "expert"]),
          description: z.string().optional(),
        })
      ).optional(),
      requiredBehaviors: z.array(
        z.object({
          title: z.string(),
          description: z.string(),
          importance: z.enum(["low", "medium", "high", "critical"]).default("medium"),
        })
      ).optional(),
      requiredCertifications: z.array(
        z.object({
          name: z.string(),
          issuer: z.string().optional(),
          description: z.string().optional(),
          url: z.string().url("Invalid URL").optional(),
        })
      ).optional(),
      documents: z.array(
        z.object({
          title: z.string(),
          description: z.string().optional(),
          fileUrl: z.string().url("Invalid URL"),
          fileType: z.string(),
        })
      ).optional(),
      externalLinks: z.array(
        z.object({
          title: z.string(),
          url: z.string().url("Invalid URL"),
          description: z.string().optional(),
        })
      ).optional(),
      rules: z.array(
        z.object({
          title: z.string(),
          description: z.string(),
          category: z.string().optional(),
        })
      ).optional(),
    })

    const validatedData = schema.parse(body)

    // Create the job description
    const jobDescription = await db.jobDescription.create({
      data: {
        companyId: validatedData.companyId,
        title: validatedData.title,
        description: validatedData.description,
        isPublic: validatedData.isPublic,
        requiredSkills: {
          create: validatedData.requiredSkills || [],
        },
        requiredBehaviors: {
          create: validatedData.requiredBehaviors || [],
        },
        requiredCertifications: {
          create: validatedData.requiredCertifications || [],
        },
        documents: {
          create: validatedData.documents || [],
        },
        externalLinks: {
          create: validatedData.externalLinks || [],
        },
        rules: {
          create: validatedData.rules || [],
        },
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
        requiredSkills: true,
        requiredBehaviors: true,
        requiredCertifications: true,
        documents: true,
        externalLinks: true,
        rules: true,
      },
    })

    return NextResponse.json(jobDescription, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    
    console.error("Error creating job description:", error)
    return NextResponse.json({ error: "Failed to create job description" }, { status: 500 })
  }
}