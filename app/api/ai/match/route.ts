import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { calculateAIFitScore } from "@/lib/ai-matching"

/**
 * POST get AI fit score for freelancer-job pair
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (!session?.user || sessionError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify user has admin or client permissions
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    if (!user || !['admin', 'client'].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const { freelancerId, jobId } = body

    if (!freelancerId || typeof freelancerId !== 'string') {
      return NextResponse.json({ error: "Valid freelancerId required" }, { status: 400 })
    }

    if (!jobId || typeof jobId !== 'string') {
      return NextResponse.json({ error: "Valid jobId required" }, { status: 400 })
    }

    // Fetch freelancer data
    const freelancer = await db.user.findUnique({
      where: { id: freelancerId },
      select: {
        id: true,
        name: true,
        skills: true,
        xp: true,
        trustScore: true
      }
    })

    if (!freelancer) {
      return NextResponse.json({ error: "Freelancer not found" }, { status: 404 })
    }

    // Fetch job data
    const job = await db.jobDescription.findUnique({
      where: { id: jobId },
      include: {
        requiredSkills: true
      }
    })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    const jobRequirements = {
      title: job.title,
      skills: job.requiredSkills.map(skill => ({
        name: skill.name,
        level: (['beginner', 'intermediate', 'advanced', 'expert'].includes(skill.level)
          ? skill.level
          : 'intermediate') as 'beginner' | 'intermediate' | 'advanced' | 'expert'
      })),
      description: job.description || undefined,
      category: job.category || undefined,
      industry: job.industry || undefined
    }

    const fitScore = calculateAIFitScore({
      freelancerId: freelancer.id,
      freelancerSkills: freelancer.skills.map(skill => ({
        name: skill,
        level: 'intermediate' as const // Default level since we only store skill names
      })),
      freelancerXp: freelancer.xp,
      freelancerTrust: freelancer.trustScore,
      job: jobRequirements,
      jobBudget: job.budgetMaxCents ? job.budgetMaxCents / 100 : undefined,
      jobClientRating: job.clientRating ?? 3.0,
      jobRiskFlags: job.riskFlags
    })

    return NextResponse.json({
      freelancerId,
      jobId,
      ...fitScore
    })

  } catch (error) {
    console.error("Error calculating AI fit score:", error)
    return NextResponse.json(
      { error: "Failed to calculate AI fit score" },
      { status: 500 }
    )
  }
}

/**
 * GET suggested freelancers for a job (requires admin/client permissions)
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const jobId = searchParams.get("jobId")

  if (!jobId) {
    return NextResponse.json({ error: "jobId required" }, { status: 400 })
  }

  try {
    const supabase = await createClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (!session?.user || sessionError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Basic implementation - in production you'd fetch real freelancers
    // and calculate fit scores for the top candidates

    return NextResponse.json({
      jobId,
      suggestions: [],
      threshold: "Will show freelancers with 60%+ AI fit scores",
      message: "AI-powered matching system - contact your seller matches"
    })

  } catch (error) {
    console.error("Error getting freelancer suggestions:", error)
    return NextResponse.json(
      { error: "Failed to get suggestions" },
      { status: 500 }
    )
  }
}