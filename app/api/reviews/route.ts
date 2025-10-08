import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { z } from "zod"

/**
 * GET reviews for a user or contract
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    const contractId = searchParams.get("contractId")
    const type = searchParams.get("type") // 'received' or 'given'
    const limit = parseInt(searchParams.get("limit") || "10")
    const page = parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    if (!userId && !contractId) {
      return NextResponse.json(
        { error: "Either userId or contractId is required" },
        { status: 400 }
      )
    }

    const where: any = {}

    if (contractId) {
      where.contractId = contractId
    } else if (userId) {
      if (type === "received") {
        where.revieweeId = userId
      } else if (type === "given") {
        where.reviewerId = userId
      } else {
        // Return both given and received
        where.OR = [
          { revieweeId: userId },
          { reviewerId: userId },
        ]
      }
    }

    const [reviews, total] = await Promise.all([
      db.review.findMany({
        where,
        include: {
          reviewer: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          reviewee: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          contract: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      db.review.count({ where }),
    ])

    // Calculate average rating for the user
    let averageRating = null
    if (userId && type === "received") {
      const avgResult = await db.review.aggregate({
        where: { revieweeId: userId },
        _avg: {
          rating: true,
        },
      })
      averageRating = avgResult._avg.rating
    }

    return NextResponse.json({
      reviews,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        averageRating,
      },
    })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    )
  }
}

/**
 * POST create a new review
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (!session?.user || sessionError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    // Validate the request body
    const schema = z.object({
      revieweeId: z.string(),
      contractId: z.string().optional(),
      rating: z.number().int().min(1).max(5),
      comment: z.string().optional(),
    })

    const validatedData = schema.parse(body)

    // Prevent self-review
    if (validatedData.revieweeId === session.user.id) {
      return NextResponse.json(
        { error: "You cannot review yourself" },
        { status: 400 }
      )
    }

    // Check if review already exists for this contract
    if (validatedData.contractId) {
      const existingReview = await db.review.findFirst({
        where: {
          contractId: validatedData.contractId,
          reviewerId: session.user.id,
        },
      })

      if (existingReview) {
        return NextResponse.json(
          { error: "You have already reviewed this contract" },
          { status: 400 }
        )
      }

      // Verify the contract exists and user is part of it
      const contract = await db.contract.findUnique({
        where: { id: validatedData.contractId },
      })

      if (!contract) {
        return NextResponse.json(
          { error: "Contract not found" },
          { status: 404 }
        )
      }

      if (
        contract.freelancerId !== session.user.id &&
        contract.clientId !== session.user.id
      ) {
        return NextResponse.json(
          { error: "You are not part of this contract" },
          { status: 403 }
        )
      }

      // Contract must be completed to leave verified review
      const isVerified = contract.status === "completed"

      // Create the review
      const review = await db.review.create({
        data: {
          reviewerId: session.user.id,
          revieweeId: validatedData.revieweeId,
          contractId: validatedData.contractId,
          rating: validatedData.rating,
          comment: validatedData.comment,
          isVerified,
        },
        include: {
          reviewer: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          reviewee: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          contract: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      })

      return NextResponse.json(review, { status: 201 })
    } else {
      // Create unverified review (without contract)
      const review = await db.review.create({
        data: {
          reviewerId: session.user.id,
          revieweeId: validatedData.revieweeId,
          rating: validatedData.rating,
          comment: validatedData.comment,
          isVerified: false,
        },
        include: {
          reviewer: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          reviewee: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      })

      return NextResponse.json(review, { status: 201 })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Error creating review:", error)
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    )
  }
}
