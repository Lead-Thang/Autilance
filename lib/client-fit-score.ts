/**
 * Calculate a client fit score based on various job and client attributes
 * @param job - The job object with client and project information
 * @returns A score between 0-100 representing the fit quality
 */
export function calculateClientFitScore(job: any): number {
  let score = 0;
  const maxScore = 100;
  
  // Client reliability (25%)
  if (job.clientVerified) score += 8; // Verified payment
  if (job.clientSpend === "5-50k" || job.clientSpend === "50k+") score += 7; // Decent spend
  if (job.clientHireRate && job.clientHireRate >= 30) score += 5; // Good hire rate
  if (job.clientRating && job.clientRating >= 4.5) score += 5; // High rating
  
  // Budget realism (15%)
  if (job.budgetType) score += 5; // Has budget type
  if (job.hourlyRate) score += 5; // Has hourly rate
  if (job.clientSpend) score += 5; // Has spend history
  
  // Scope clarity (15%)
  // Would need more detailed job description analysis
  
  // Decision speed (10%)
  // Would need historical data on time to hire
  
  // Skills/industry fit (20%)
  if (job.industry) score += 10;
  if (job.projectType) score += 10;
  
  // Communication/culture (10%)
  // Would need more data about tools, language, etc.
  
  // Risk penalty (-10% to -30%)
  if (job.riskFlags) {
    if (job.riskFlags.includes("unpaid-test")) score -= 10;
    if (job.riskFlags.includes("scope-creep")) score -= 10;
    if (job.riskFlags.includes("extreme-nda")) score -= 10;
  }
  
  return Math.max(0, Math.min(maxScore, score));
}

/**
 * Get reasons why a job is a good fit
 * @param job - The job object
 * @returns Array of reasons
 */
export function getFitReasons(job: any): string[] {
  const reasons = [];
  
  if (job.clientVerified) {
    reasons.push("Verified payment method");
  }
  
  if (job.clientSpend === "5-50k" || job.clientSpend === "50k+") {
    reasons.push("Significant spending history");
  }
  
  if (job.clientHireRate && job.clientHireRate >= 30) {
    reasons.push("High hire rate (" + job.clientHireRate + "%)");
  }
  
  if (job.clientRating && job.clientRating >= 4.5) {
    reasons.push("High client rating (" + job.clientRating + "/5)");
  }
  
  if (job.industry) {
    reasons.push("Industry match: " + job.industry);
  }
  
  if (job.projectType) {
    reasons.push("Project type: " + job.projectType);
  }
  
  return reasons.slice(0, 3); // Return top 3 reasons
}

/**
 * Get risk factors for a job
 * @param job - The job object
 * @returns Array of risk factors
 */
export function getRiskFactors(job: any): string[] {
  const risks = [];
  
  if (job.riskFlags) {
    if (job.riskFlags.includes("unpaid-test")) {
      risks.push("Requires unpaid test work");
    }
    
    if (job.riskFlags.includes("scope-creep")) {
      risks.push("History of scope creep");
    }
    
    if (job.riskFlags.includes("extreme-nda")) {
      risks.push("Extreme NDA/IP clauses");
    }
  }
  
  return risks.slice(0, 2); // Return top 2 risks
}