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

    // Filter parameters
    const jobType = searchParams.get("jobType") // 'full-time', 'freelance', 'contract', 'part-time'
    const budgetType = searchParams.get("budgetType") // 'fixed', 'hourly'
    const isRemote = searchParams.get("isRemote")
    const category = searchParams.get("category")
    const industry = searchParams.get("industry")
    const clientVerified = searchParams.get("clientVerified")
    const minRating = searchParams.get("minRating")
    const search = searchParams.get("search")

    const where: any = {
      isPublic: true,
      ...(companyId ? { companyId } : {}),
      ...(jobType ? { jobType } : {}),
      ...(budgetType ? { budgetType } : {}),
      ...(isRemote !== null && isRemote !== undefined ? { isRemote: isRemote === "true" } : {}),
      ...(category ? { category } : {}),
      ...(industry ? { industry } : {}),
      ...(clientVerified ? { clientVerified: clientVerified === "true" } : {}),
      ...(minRating ? { clientRating: { gte: parseFloat(minRating) } } : {}),
    }

    // Search functionality
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { company: { name: { contains: search, mode: "insensitive" } } },
      ]
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
    const supabase = await createClient()
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

      // Job Type & Classification
      jobType: z.enum(["full-time", "freelance", "contract", "part-time"]).default("full-time"),
      contractType: z.enum(["fixed-price", "hourly", "retainer"]).optional(),
      category: z.string().optional(),
      industry: z.string().optional(),

      // Location & Remote
      isRemote: z.boolean().default(true),
      location: z.string().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
      timezone: z.string().optional(),

      // Budget & Compensation
      budgetType: z.enum(["fixed", "hourly"]).optional(),
      budgetMinCents: z.number().int().positive().optional(),
      budgetMaxCents: z.number().int().positive().optional(),
      hourlyRateMin: z.number().int().positive().optional(),
      hourlyRateMax: z.number().int().positive().optional(),
      currency: z.string().default("USD"),

      // Client Quality Metrics
      clientVerified: z.boolean().default(false),
      clientSpend: z.enum(["0-1k", "1-5k", "5-50k", "50k+"]).optional(),
      clientHireRate: z.number().int().min(0).max(100).optional(),
      clientRating: z.number().min(0).max(5).optional(),

      // Risk Flags
      riskFlags: z.array(z.string()).optional(),

      // Project Details
      projectType: z.enum(["new-build", "maintenance", "research", "consulting"]).optional(),
      estimatedDuration: z.string().optional(),
      deadline: z.string().datetime().optional(),

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

        // Job Type & Classification
        jobType: validatedData.jobType,
        contractType: validatedData.contractType,
        category: validatedData.category,
        industry: validatedData.industry,

        // Location & Remote
        isRemote: validatedData.isRemote,
        location: validatedData.location,
        latitude: validatedData.latitude,
        longitude: validatedData.longitude,
        timezone: validatedData.timezone,

        // Budget & Compensation
        budgetType: validatedData.budgetType,
        budgetMinCents: validatedData.budgetMinCents,
        budgetMaxCents: validatedData.budgetMaxCents,
        hourlyRateMin: validatedData.hourlyRateMin,
        hourlyRateMax: validatedData.hourlyRateMax,
        currency: validatedData.currency,

        // Client Quality Metrics
        clientVerified: validatedData.clientVerified,
        clientSpend: validatedData.clientSpend,
        clientHireRate: validatedData.clientHireRate,
        clientRating: validatedData.clientRating,

        // Risk Flags
        riskFlags: validatedData.riskFlags || [],

        // Project Details
        projectType: validatedData.projectType,
        estimatedDuration: validatedData.estimatedDuration,
        deadline: validatedData.deadline ? new Date(validatedData.deadline) : undefined,

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