/**
 * Personalized Job Matching Algorithm
 *
 * This algorithm scores jobs based on user profile, skills, preferences,
 * and work history to provide personalized recommendations.
 */

interface UserProfile {
  id: string
  skills: string[]
  hourlyRate?: number
  preferredJobTypes?: string[]
  preferredIndustries?: string[]
  experience?: string[]
  certifications?: string[]
  rating?: number
  completedProjects?: number
  successRate?: number
  location?: string
  timezone?: string
  preferRemote?: boolean
}

interface JobPosting {
  id: string
  title: string
  jobType: string
  industry?: string
  requiredSkills: Array<{ name: string; level: string }>
  budgetMinCents?: number
  budgetMaxCents?: number
  hourlyRateMin?: number
  hourlyRateMax?: number
  clientRating?: number
  clientHireRate?: number
  clientVerified: boolean
  isRemote: boolean
  location?: string
  timezone?: string
  riskFlags: string[]
  projectType?: string
  estimatedDuration?: string
}

interface MatchScore {
  totalScore: number // 0-100
  breakdown: {
    skillsMatch: number // 0-30
    budgetFit: number // 0-20
    clientQuality: number // 0-20
    jobTypePreference: number // 0-10
    locationMatch: number // 0-10
    riskAssessment: number // 0-10 (negative for high risk)
  }
  reasons: string[]
  warnings: string[]
}

/**
 * Calculate skill match score
 */
function calculateSkillsMatch(
  userSkills: string[],
  requiredSkills: Array<{ name: string; level: string }>
): { score: number; reasons: string[] } {
  if (requiredSkills.length === 0) {
    return { score: 15, reasons: ["No specific skills required"] }
  }

  const userSkillsLower = userSkills.map(s => s.toLowerCase())
  const matchedSkills = requiredSkills.filter(rs =>
    userSkillsLower.includes(rs.name.toLowerCase())
  )

  const matchPercentage = matchedSkills.length / requiredSkills.length
  const score = Math.round(matchPercentage * 30)

  const reasons: string[] = []
  if (matchPercentage >= 0.8) {
    reasons.push(`Strong skill match: ${matchedSkills.length}/${requiredSkills.length} skills`)
  } else if (matchPercentage >= 0.5) {
    reasons.push(`Good skill match: ${matchedSkills.length}/${requiredSkills.length} skills`)
  } else if (matchPercentage > 0) {
    reasons.push(`Partial skill match: ${matchedSkills.length}/${requiredSkills.length} skills`)
  }

  return { score, reasons }
}

/**
 * Calculate budget fit score
 */
function calculateBudgetFit(
  userHourlyRate: number | undefined,
  job: JobPosting
): { score: number; reasons: string[] } {
  const reasons: string[] = []

  // If no user rate specified, give neutral score
  if (!userHourlyRate) {
    return { score: 10, reasons: [] }
  }

  // Convert user rate from cents to dollars for comparison
  const userRateDollars = userHourlyRate / 100

  // Check hourly jobs
  if (job.hourlyRateMin && job.hourlyRateMax) {
    const midpoint = (job.hourlyRateMin + job.hourlyRateMax) / 2

    if (userRateDollars >= job.hourlyRateMin && userRateDollars <= job.hourlyRateMax) {
      reasons.push("Perfect budget match for your rate")
      return { score: 20, reasons }
    } else if (userRateDollars < job.hourlyRateMin) {
      const premium = ((job.hourlyRateMin - userRateDollars) / userRateDollars) * 100
      reasons.push(`Premium opportunity: ${premium.toFixed(0)}% above your rate`)
      return { score: 18, reasons }
    } else if (userRateDollars <= job.hourlyRateMax * 1.2) {
      reasons.push("Slightly below your rate, but negotiable")
      return { score: 12, reasons }
    } else {
      reasons.push("Budget significantly below your rate")
      return { score: 5, reasons }
    }
  }

  // Check fixed price jobs
  if (job.budgetMinCents && job.budgetMaxCents) {
    const estimatedHours = 40 // Assume ~1 week of work as baseline
    const effectiveHourlyRate = ((job.budgetMinCents + job.budgetMaxCents) / 2) / estimatedHours

    if (effectiveHourlyRate >= userRateDollars * 0.8) {
      reasons.push("Good effective hourly rate")
      return { score: 15, reasons }
    } else {
      reasons.push("Low effective hourly rate")
      return { score: 8, reasons }
    }
  }

  return { score: 10, reasons: [] }
}

/**
 * Calculate client quality score
 */
function calculateClientQuality(job: JobPosting): { score: number; reasons: string[] } {
  let score = 0
  const reasons: string[] = []

  // Client verified (+5)
  if (job.clientVerified) {
    score += 5
    reasons.push("Verified payment method")
  }

  // Client rating (+5 max)
  if (job.clientRating) {
    const ratingScore = (job.clientRating / 5) * 5
    score += ratingScore
    if (job.clientRating >= 4.5) {
      reasons.push("Excellent client rating")
    } else if (job.clientRating >= 4.0) {
      reasons.push("Good client rating")
    }
  }

  // Client hire rate (+5 max)
  if (job.clientHireRate) {
    const hireRateScore = (job.clientHireRate / 100) * 5
    score += hireRateScore
    if (job.clientHireRate >= 50) {
      reasons.push("High hire rate - likely to hire")
    }
  }

  // Risk penalty (up to -5)
  const riskPenalty = Math.min(job.riskFlags.length * 2, 5)
  score -= riskPenalty

  return { score: Math.max(0, Math.min(20, score)), reasons }
}

/**
 * Calculate job type preference score
 */
function calculateJobTypePreference(
  userPreferredTypes: string[] | undefined,
  jobType: string
): { score: number; reasons: string[] } {
  if (!userPreferredTypes || userPreferredTypes.length === 0) {
    return { score: 5, reasons: [] }
  }

  const reasons: string[] = []
  if (userPreferredTypes.includes(jobType)) {
    reasons.push("Matches your job type preference")
    return { score: 10, reasons }
  }

  return { score: 3, reasons: [] }
}

/**
 * Calculate location match score
 */
function calculateLocationMatch(
  user: UserProfile,
  job: JobPosting
): { score: number; reasons: string[] } {
  const reasons: string[] = []

  // Remote preference match
  if (user.preferRemote && job.isRemote) {
    reasons.push("Remote position matches your preference")
    return { score: 10, reasons }
  }

  // Timezone match (if both specified)
  if (user.timezone && job.timezone) {
    if (user.timezone === job.timezone) {
      reasons.push("Same timezone - easier collaboration")
      return { score: 8, reasons }
    }
  }

  // Location match
  if (user.location && job.location && !job.isRemote) {
    if (user.location.toLowerCase() === job.location.toLowerCase()) {
      reasons.push("Same location")
      return { score: 10, reasons }
    }
  }

  return { score: 5, reasons: [] }
}

/**
 * Calculate risk assessment score
 */
function calculateRiskAssessment(job: JobPosting): { score: number; warnings: string[] } {
  const warnings: string[] = []
  let score = 10

  // Check risk flags
  if (job.riskFlags.includes("unpaid-test")) {
    warnings.push("⚠️ Requires unpaid test work")
    score -= 3
  }

  if (job.riskFlags.includes("scope-creep")) {
    warnings.push("⚠️ Client has history of scope creep")
    score -= 3
  }

  if (job.riskFlags.includes("extreme-nda")) {
    warnings.push("⚠️ Extreme NDA/IP requirements")
    score -= 2
  }

  // Low client rating
  if (job.clientRating && job.clientRating < 3.0) {
    warnings.push("⚠️ Low client rating")
    score -= 3
  }

  // Low hire rate
  if (job.clientHireRate && job.clientHireRate < 20) {
    warnings.push("⚠️ Client rarely hires")
    score -= 2
  }

  // Unverified client
  if (!job.clientVerified) {
    warnings.push("⚠️ Unverified payment method")
    score -= 2
  }

  return { score: Math.max(0, score), warnings }
}

/**
 * Main matching function - calculates overall match score
 */
export function calculateJobMatchScore(
  user: UserProfile,
  job: JobPosting
): MatchScore {
  const skillsMatch = calculateSkillsMatch(user.skills, job.requiredSkills)
  const budgetFit = calculateBudgetFit(user.hourlyRate, job)
  const clientQuality = calculateClientQuality(job)
  const jobTypePreference = calculateJobTypePreference(user.preferredJobTypes, job.jobType)
  const locationMatch = calculateLocationMatch(user, job)
  const riskAssessment = calculateRiskAssessment(job)

  const totalScore = Math.round(
    skillsMatch.score +
    budgetFit.score +
    clientQuality.score +
    jobTypePreference.score +
    locationMatch.score +
    riskAssessment.score
  )

  const reasons = [
    ...skillsMatch.reasons,
    ...budgetFit.reasons,
    ...clientQuality.reasons,
    ...jobTypePreference.reasons,
    ...locationMatch.reasons,
  ]

  return {
    totalScore: Math.min(100, Math.max(0, totalScore)),
    breakdown: {
      skillsMatch: skillsMatch.score,
      budgetFit: budgetFit.score,
      clientQuality: clientQuality.score,
      jobTypePreference: jobTypePreference.score,
      locationMatch: locationMatch.score,
      riskAssessment: riskAssessment.score,
    },
    reasons,
    warnings: riskAssessment.warnings,
  }
}

/**
 * Sort jobs by match score
 */
export function sortJobsByMatch(
  user: UserProfile,
  jobs: JobPosting[]
): Array<JobPosting & { matchScore: MatchScore }> {
  return jobs
    .map(job => ({
      ...job,
      matchScore: calculateJobMatchScore(user, job),
    }))
    .sort((a, b) => b.matchScore.totalScore - a.matchScore.totalScore)
}

/**
 * Get recommended jobs (match score >= 60)
 */
export function getRecommendedJobs(
  user: UserProfile,
  jobs: JobPosting[]
): Array<JobPosting & { matchScore: MatchScore }> {
  return sortJobsByMatch(user, jobs).filter(job => job.matchScore.totalScore >= 60)
}
