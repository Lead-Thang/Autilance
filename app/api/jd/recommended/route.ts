import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { sortJobsByMatch } from "@/lib/job-matching"

/**
 * GET recommended jobs based on user profile
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (!session?.user || sessionError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get("limit") || "20")
    const minScore = parseInt(searchParams.get("minScore") || "60")

    // Fetch user profile
    const userProfile = await db.profile.findUnique({
      where: { userId: session.user.id },
    })

    const user = await db.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Prepare user matching profile
    const matchingProfile = {
      id: user.id,
      skills: user.skills || [],
      hourlyRate: userProfile?.hourlyRateCents,
      preferredJobTypes: [], // Would come from user preferences
      preferredIndustries: [], // Would come from user preferences
      experience: [], // Would come from user work history
      certifications: [], // Would come from user certifications
      location: userProfile?.location,
      timezone: userProfile?.timezone,
      preferRemote: true, // Would come from user preferences
    }

    // Fetch all public jobs
    const jobs = await db.jobDescription.findMany({
      where: { isPublic: true },
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
      take: 100, // Fetch more to have a good pool for matching
    })

    // Transform jobs to matching format
    const jobsForMatching = jobs.map(job => ({
      id: job.id,
      title: job.title,
      jobType: job.jobType,
      industry: job.industry || undefined,
      requiredSkills: job.requiredSkills.map(skill => ({
        name: skill.name,
        level: skill.level,
      })),
      budgetMinCents: job.budgetMinCents || undefined,
      budgetMaxCents: job.budgetMaxCents || undefined,
      hourlyRateMin: job.hourlyRateMin || undefined,
      hourlyRateMax: job.hourlyRateMax || undefined,
      clientRating: job.clientRating || undefined,
      clientHireRate: job.clientHireRate || undefined,
      clientVerified: job.clientVerified,
      isRemote: job.isRemote,
      location: job.location || undefined,
      timezone: job.timezone || undefined,
      riskFlags: job.riskFlags,
      projectType: job.projectType || undefined,
      estimatedDuration: job.estimatedDuration || undefined,
    }))

    // Calculate match scores and sort
    const matchedJobs = sortJobsByMatch(matchingProfile, jobsForMatching)

    // Filter by minimum score and limit
    const recommendedJobs = matchedJobs
      .filter(job => job.matchScore.totalScore >= minScore)
      .slice(0, limit)

    // Enrich with full job data
    const enrichedJobs = recommendedJobs.map(matchedJob => {
      const fullJob = jobs.find(j => j.id === matchedJob.id)
      return {
        ...fullJob,
        matchScore: matchedJob.matchScore,
      }
    })

    return NextResponse.json({
      jobs: enrichedJobs,
      meta: {
        total: enrichedJobs.length,
        minScore,
        limit,
      },
    })
  } catch (error) {
    console.error("Error fetching recommended jobs:", error)
    return NextResponse.json(
      { error: "Failed to fetch recommended jobs" },
      { status: 500 }
    )
  }
}
