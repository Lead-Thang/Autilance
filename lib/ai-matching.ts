interface Skill {
  name: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
}

interface JobRequirements {
  title: string
  skills: Skill[]
  description?: string
  category?: string
  industry?: string
}

/**
 * Calculate skill-level weights for matching
 * Expert skills get highest weight, beginner gets lowest
 */
const skillLevelWeights = {
  'expert': 1.0,
  'advanced': 0.8,
  'intermediate': 0.6,
  'beginner': 0.4
}

/**
 * Calculate similarity score between freelancer and job requirements
 */
export function calculateSkillMatchScore(freelancerSkills: Skill[], jobSkills: Skill[]): number {
  if (jobSkills.length === 0) return 0
  if (freelancerSkills.length === 0) return 0

  let totalCompatibility = 0

  // For each required skill in the job
  for (const jobSkill of jobSkills) {
    const freelancerMatch = freelancerSkills.find(
      fs => fs.name.toLowerCase() === jobSkill.name.toLowerCase()
    )

    if (freelancerMatch) {
      // Calculate level compatibility
      const levelCompatibility = calculateLevelCompatibility(freelancerMatch.level, jobSkill.level)
      totalCompatibility += levelCompatibility
    }
  }

  // Penalize overqualification slightly (prefer exact matches)
  const overqualificationPenalty = calculateOverqualificationPenalty(freelancerSkills.length, jobSkills.length)

  const baseScore = (totalCompatibility / jobSkills.length) * 100
  return Math.max(0, Math.min(100, baseScore - overqualificationPenalty))
}

/**
 * Calculate how well freelancer's skill level matches job requirement
 */
function calculateLevelCompatibility(freelancerLevel: string, requiredLevel: string): number {
  const levelOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3, 'expert': 4 }

  const freelancerRank = levelOrder[freelancerLevel as keyof typeof levelOrder] || 1
  const requiredRank = levelOrder[requiredLevel as keyof typeof levelOrder] || 2

  // Exact match gets full point
  if (freelancerRank === requiredRank) return 1.0

  // One level off gets partial credit
  if (Math.abs(freelancerRank - requiredRank) === 1) return 0.7

  // Too lower skilled gets reduced credit
  if (freelancerRank < requiredRank) return 0.4

  // Overskilled gets full credit (prevents overpenalization)
  return 0.9
}

/**
 * Penalize freelancers with too many irrelevant skills
 */
function calculateOverqualificationPenalty(freelancerSkillCount: number, jobSkillCount: number): number {
  const ratio = freelancerSkillCount / jobSkillCount
  if (ratio <= 2) return 0 // No penalty for reasonable overlap
  if (ratio <= 3) return 5 // Small penalty for some excess
  return 10 // Larger penalty for massive overqualification
}

/**
 * Calculate overall AI fit score considering multiple factors
 */
export function calculateAIFitScore(params: {
  freelancerId: string
  freelancerSkills: Skill[]
  freelancerXp?: number
  freelancerTrust?: number
  job: JobRequirements
  jobBudget?: number
  jobClientRating?: number
  jobRiskFlags?: string[]
}): {
  totalScore: number
  skillScore: number
  trustScore: number
  budgetAlignment: number
  reasoning: string[]
} {
  const {
    freelancerSkills,
    freelancerXp = 0,
    freelancerTrust = 0.5,
    job,
    jobBudget,
    jobClientRating = 4.0,
    jobRiskFlags = []
  } = params

  // Skill matching (40% weight)
  const skillScore = calculateSkillMatchScore(freelancerSkills, job.skills)

  // Trust score (30% weight) - based on verified work, reviews, etc.
  const trustScore = freelancerTrust * 100

  // Project fit (20% weight) - budget alignment, client quality, risk assessment
  let budgetAlignment = 50 // Default neutral
  if (jobBudget) {
    // Higher budget jobs prefer more experienced freelancers
    budgetAlignment = Math.min(100, freelancerXp * 2 + 40)
  }

  // Risk adjustment
  let riskPenalty = 0
  if (jobRiskFlags.includes('scope-creep')) riskPenalty -= 10
  if (jobRiskFlags.includes('extreme-nda')) riskPenalty -= 10
  if (jobRiskFlags.includes('unpaid-test')) riskPenalty -= 15

  // Low client rating reduces attractiveness
  const clientQualityBonus = jobClientRating >= 4.5 ? 10 : jobClientRating >= 4.0 ? 5 : 0

  const totalScore = Math.max(0, Math.min(100,
    (skillScore * 0.4) +
    (trustScore * 0.3) +
    (budgetAlignment * 0.2) +
    riskPenalty +
    clientQualityBonus
  ))

  const reasoning = generateReasoning({
    skillScore,
    trustScore,
    budgetAlignment,
    job,
    freelancerSkills,
    jobRiskFlags,
    clientRating: jobClientRating
  })

  return {
    totalScore: Math.round(totalScore),
    skillScore: Math.round(skillScore),
    trustScore: Math.round(trustScore),
    budgetAlignment: Math.round(budgetAlignment),
    reasoning
  }
}

/**
 * Generate readable reasons for the AI fit score
 */
function generateReasoning(params: {
  skillScore: number
  trustScore: number
  budgetAlignment: number
  job: JobRequirements
  freelancerSkills: Skill[]
  jobRiskFlags: string[]
  clientRating: number
}): string[] {
  const reasons: string[] = []
  const riskWarnings: string[] = []

  // Skill matching reasons
  if (params.skillScore >= 80) {
    reasons.push("Excellent skill match - most required skills at appropriate levels")
  } else if (params.skillScore >= 60) {
    reasons.push("Good skill foundation with room for growth")
  } else if (params.skillScore >= 40) {
    reasons.push("Basic skill overlap - may require mentorship")
  } else {
    reasons.push("Limited skill match - significant upskilling needed")
  }

  // Trust reasons
  if (params.trustScore >= 80) {
    reasons.push("High reputation and verified work history")
  } else if (params.trustScore >= 60) {
    reasons.push("Solid track record with good feedback")
  } else {
    reasons.push("Limited verified work - use caution")
  }

  // Client quality reasons
  if (params.clientRating >= 4.5) {
    reasons.push("Top-tier client with excellent payment history")
  } else if (params.clientRating >= 4.0) {
    reasons.push("Reliable client with good track record")
  } else {
    reasons.push("Client quality needs verification")
  }

  // Risk warnings
  if (params.jobRiskFlags.includes('scope-creep')) {
    riskWarnings.push("⚠️ Client has scope creep history - clear contracts needed")
  }
  if (params.jobRiskFlags.includes('unpaid-test')) {
    riskWarnings.push("⚠️ Requests unpaid test work - proceed with caution")
  }
  if (params.jobRiskFlags.includes('extreme-nda')) {
    riskWarnings.push("⚠️ Extreme NDA requirements - review legal terms")
  }

  const MAX = 3
  const positiveLimit = Math.max(0, MAX - riskWarnings.length)
  return [...reasons.slice(0, positiveLimit), ...riskWarnings]
}

/**
 * Suggest freelancers for a job posting
 */
export async function suggestFreelancersForJob(jobId: string, limit = 20) {
  // This would integrate with your database to find and rank freelancers
  // For now, this is a placeholder - in production you'd:
  // 1. Query freelancers with relevant skills
  // 2. Calculate AI fit scores for each
  // 3. Return ranked list

  return {
    jobId,
    suggestions: [],
    generatedAt: new Date(),
    note: "AI matching system ready - integrate with freelancer database"
  }
}

/**
 * Find best jobs for a freelancer
 */
export async function suggestJobsForFreelancer(freelancerId: string, limit = 10) {
  // Similar to above - would query and score jobs
  return {
    freelancerId,
    suggestions: [],
    generatedAt: new Date(),
    note: "AI matching system ready - integrate with jobs database"
  }
}