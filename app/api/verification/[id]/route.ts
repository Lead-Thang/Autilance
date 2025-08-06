import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { z } from "zod"

// GET a specific verification submission
export async function GET(
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
    
    const submission = await db.verificationSubmission.findUnique({
      where: { id },
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
            requiredSkills: true,
            requiredBehaviors: true,
            requiredCertifications: true,
          },
        },
        proofs: true,
      },
    })

    if (!submission) {
      return NextResponse.json({ error: "Verification submission not found" }, { status: 404 })
    }

    return NextResponse.json(submission)
  } catch (error) {
    console.error("Error fetching verification submission:", error)
    return NextResponse.json({ error: "Failed to fetch verification submission" }, { status: 500 })
  }
}

// PATCH update a verification submission status (approve/reject)
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
      status: z.enum(["approved", "rejected"]),
      reviewedBy: z.string(),
      notes: z.string().optional(),
    })

    const validatedData = schema.parse(body)

    // Check if the submission exists
    const submission = await db.verificationSubmission.findUnique({
      where: { id },
      include: {
        jobDescription: {
          include: {
            company: true,
          },
        },
      },
    })

    if (!submission) {
      return NextResponse.json({ error: "Verification submission not found" }, { status: 404 })
    }

    // Update the submission status
    const updatedSubmission = await db.verificationSubmission.update({
      where: { id },
      data: {
        status: validatedData.status,
        reviewedBy: validatedData.reviewedBy,
        reviewedAt: new Date(),
        ...(validatedData.notes && { notes: validatedData.notes }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
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
              },
            },
          },
        },
      },
    })

    // If approved, create a badge for the user
    if (validatedData.status === "approved") {
      await db.badge.create({
        data: {
          userId: submission.userId,
          companyId: submission.jobDescription.companyId,
          jdId: submission.jdId,
          name: `${submission.jobDescription.company.name} - ${submission.jobDescription.title}`,
          description: `Successfully verified for ${submission.jobDescription.title} at ${submission.jobDescription.company.name}`,
        },
      })
    }

    return NextResponse.json(updatedSubmission)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    
    console.error("Error updating verification submission:", error)
    return NextResponse.json({ error: "Failed to update verification submission" }, { status: 500 })
  }
}