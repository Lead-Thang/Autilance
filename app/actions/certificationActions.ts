"use server"

import { getCurrentUser } from "@/lib/session"
import { prisma } from "@/lib/prisma"

export async function getUserCertifications() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      throw new Error("User not found")
    }

    // Fetch user's badges (which represent earned certifications)
    const badges = await prisma.badge.findMany({
      where: {
        userId: user.id,
      },
      include: {
        company: true,
        jobDescription: true,
      },
      orderBy: {
        issuedAt: 'desc',
      },
    })

    // Fetch user's verification submissions (which represent certifications in progress)
    const verificationSubmissions = await prisma.verificationSubmission.findMany({
      where: {
        userId: user.id,
      },
      include: {
        jobDescription: {
          include: {
            company: true,
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
    })

    // Transform the data for the frontend
    const earnedCertifications = badges.map(badge => ({
      id: badge.id,
      name: badge.name,
      description: badge.description,
      issuedAt: badge.issuedAt,
      expiresAt: badge.expiresAt,
      company: {
        id: badge.company.id,
        name: badge.company.name,
        logo: badge.company.logo,
        industry: badge.company.industry,
      },
      jobDescription: {
        id: badge.jobDescription.id,
        title: badge.jobDescription.title,
      },
    }))

    const inProgressCertifications = verificationSubmissions.map(submission => ({
      id: submission.id,
      status: submission.status,
      submittedAt: submission.submittedAt,
      reviewedAt: submission.reviewedAt,
      notes: submission.notes,
      jobDescription: {
        id: submission.jobDescription.id,
        title: submission.jobDescription.title,
      },
      company: {
        id: submission.jobDescription.company.id,
        name: submission.jobDescription.company.name,
        logo: submission.jobDescription.company.logo,
        industry: submission.jobDescription.company.industry,
      },
    }))

    return {
      success: true,
      data: {
        earnedCertifications,
        inProgressCertifications,
      },
    }
  } catch (error) {
    console.error("Error fetching user certifications:", error)
    return {
      success: false,
      error: "Failed to fetch certifications",
    }
  }
}