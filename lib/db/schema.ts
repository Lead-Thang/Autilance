// Schema for Autilance platform
import { z } from "zod"

// Company Schema
export const companySchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Company name must be at least 2 characters"),
  description: z.string().optional(),
  logo: z.string().optional(),
  website: z.string().url("Invalid URL").optional(),
  industry: z.string().optional(),
  size: z.string().optional(),
  location: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Company = z.infer<typeof companySchema>

// Job Description (JD) Schema
export const jdSchema = z.object({
  id: z.string(),
  companyId: z.string(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  isPublic: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
  
  // Core JD components
  requiredSkills: z.array(z.object({
    name: z.string(),
    level: z.enum(["beginner", "intermediate", "advanced", "expert"]),
    description: z.string().optional(),
  })),
  
  requiredBehaviors: z.array(z.object({
    title: z.string(),
    description: z.string(),
    importance: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  })),
  
  requiredCertifications: z.array(z.object({
    name: z.string(),
    issuer: z.string().optional(),
    description: z.string().optional(),
    url: z.string().url("Invalid URL").optional(),
  })),
  
  documents: z.array(z.object({
    title: z.string(),
    description: z.string().optional(),
    fileUrl: z.string().url("Invalid URL"),
    fileType: z.string(),
  })).optional(),
  
  externalLinks: z.array(z.object({
    title: z.string(),
    url: z.string().url("Invalid URL"),
    description: z.string().optional(),
  })).optional(),
  
  rules: z.array(z.object({
    title: z.string(),
    description: z.string(),
    category: z.string().optional(),
  })).optional(),
  
  courses: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    price: z.number().optional(),
    isFree: z.boolean().default(false),
  })).optional(),
})

export type JobDescription = z.infer<typeof jdSchema>

// User Schema
export const userSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string().email("Invalid email address"),
  image: z.string().optional(),
  bio: z.string().optional(),
  title: z.string().optional(),
  skills: z.array(z.string()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type User = z.infer<typeof userSchema>

// Verification Submission Schema
export const verificationSubmissionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  jdId: z.string(),
  status: z.enum(["pending", "approved", "rejected"]),
  submittedAt: z.date(),
  reviewedAt: z.date().optional(),
  reviewedBy: z.string().optional(),
  
  // Proof of skills, certifications, etc.
  proofs: z.array(z.object({
    type: z.enum(["skill", "certification", "behavior", "other"]),
    title: z.string(),
    description: z.string().optional(),
    fileUrl: z.string().url("Invalid URL").optional(),
    linkUrl: z.string().url("Invalid URL").optional(),
  })),
  
  notes: z.string().optional(),
})

export type VerificationSubmission = z.infer<typeof verificationSubmissionSchema>

// Badge Schema
export const badgeSchema = z.object({
  id: z.string(),
  userId: z.string(),
  companyId: z.string(),
  jdId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  issuedAt: z.date(),
  expiresAt: z.date().optional(),
})

export type Badge = z.infer<typeof badgeSchema>

// Course Schema
export const courseSchema = z.object({
  id: z.string(),
  companyId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  price: z.number().optional(),
  isFree: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
  
  // Course content
  modules: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    order: z.number(),
    
    lessons: z.array(z.object({
      id: z.string(),
      title: z.string(),
      content: z.string(),
      videoUrl: z.string().url("Invalid URL").optional(),
      order: z.number(),
    })),
  })),
  
  // Related JDs
  relatedJdIds: z.array(z.string()).optional(),
})

export type Course = z.infer<typeof courseSchema>