import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { z } from "zod"

// GET a specific job description by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    const jobDescription = await db.jobDescription.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            description: true,
          },
        },
        requiredSkills: true,
        requiredBehaviors: true,
        requiredCertifications: true,
        documents: true,
        externalLinks: true,
        rules: true,
        courseRelations: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                description: true,
                price: true,
                isFree: true,
              },
            },
          },
        },
      },
    })

    if (!jobDescription) {
      return NextResponse.json({ error: "Job description not found" }, { status: 404 })
    }

    // If the job description is not public, check if the user is authorized
    if (!jobDescription.isPublic) {
      const supabase = createClient()
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (!session?.user || error) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      
      // Additional authorization checks can be added here
    }

    return NextResponse.json(jobDescription)
  } catch (error) {
    console.error("Error fetching job description:", error)
    return NextResponse.json({ error: "Failed to fetch job description" }, { status: 500 })
  }
}

// PATCH update a job description
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (!session?.user || error) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const body = await req.json()

    // Validate the request body
    const schema = z.object({
      title: z.string().min(3, "Title must be at least 3 characters").optional(),
      description: z.string().optional(),
      isPublic: z.boolean().optional(),
      requiredSkills: z.array(
        z.object({
          id: z.string().optional(),
          name: z.string(),
          level: z.enum(["beginner", "intermediate", "advanced", "expert"]),
          description: z.string().optional(),
        })
      ).optional(),
      requiredBehaviors: z.array(
        z.object({
          id: z.string().optional(),
          title: z.string(),
          description: z.string(),
          importance: z.enum(["low", "medium", "high", "critical"]).default("medium"),
        })
      ).optional(),
      requiredCertifications: z.array(
        z.object({
          id: z.string().optional(),
          name: z.string(),
          issuer: z.string().optional(),
          description: z.string().optional(),
          url: z.string().url("Invalid URL").optional(),
        })
      ).optional(),
      documents: z.array(
        z.object({
          id: z.string().optional(),
          title: z.string(),
          description: z.string().optional(),
          fileUrl: z.string().url("Invalid URL"),
          fileType: z.string(),
        })
      ).optional(),
      externalLinks: z.array(
        z.object({
          id: z.string().optional(),
          title: z.string(),
          url: z.string().url("Invalid URL"),
          description: z.string().optional(),
        })
      ).optional(),
      rules: z.array(
        z.object({
          id: z.string().optional(),
          title: z.string(),
          description: z.string(),
          category: z.string().optional(),
        })
      ).optional(),
    })

    const validatedData = schema.parse(body)

    // Check if the job description exists
    const existingJD = await db.jobDescription.findUnique({
      where: { id },
      include: {
        requiredSkills: true,
        requiredBehaviors: true,
        requiredCertifications: true,
        documents: true,
        externalLinks: true,
        rules: true,
      },
    })

    if (!existingJD) {
      return NextResponse.json({ error: "Job description not found" }, { status: 404 })
    }

    // Update the job description
    const updatedJD = await db.jobDescription.update({
      where: { id },
      data: {
        ...(validatedData.title && { title: validatedData.title }),
        ...(validatedData.description !== undefined && { description: validatedData.description }),
        ...(validatedData.isPublic !== undefined && { isPublic: validatedData.isPublic }),
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

    // Handle updating related entities (skills, behaviors, etc.)
    // This would require additional transaction logic to handle creates, updates, and deletes

    return NextResponse.json(updatedJD)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    
    console.error("Error updating job description:", error)
    return NextResponse.json({ error: "Failed to update job description" }, { status: 500 })
  }
}

// DELETE a job description
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (!session?.user || error) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    // Check if the job description exists
    const existingJD = await db.jobDescription.findUnique({
      where: { id },
    })

    if (!existingJD) {
      return NextResponse.json({ error: "Job description not found" }, { status: 404 })
    }

    // Delete the job description
    await db.jobDescription.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Job description deleted successfully" })
  } catch (error) {
    console.error("Error deleting job description:", error)
    return NextResponse.json({ error: "Failed to delete job description" }, { status: 500 })
  }
}