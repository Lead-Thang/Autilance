import { NextRequest, NextResponse } from "next/server"

import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get("limit") || "10")
    const page = parseInt(searchParams.get("page") || "1")
    const categoryId = searchParams.get("categoryId")
    const clientId = searchParams.get("clientId")
    const status = searchParams.get("status")
    const aiMatch = searchParams.get("aiMatch") // user id for AI matching
    const skip = (page - 1) * limit

    const where: any = {
      status: "open",
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (clientId) {
      where.clientId = clientId
    }

    if (status) {
      where.status = status
    }

    // If AI matching requested, filter by user skills or something
    // For now, simple filter, later integrate AI
    if (aiMatch) {
      // Placeholder: in real impl, use AI to match
      // For now, just return all
    }

    const [jobs, total] = await Promise.all([
      db.project.findMany({
        where,
        include: {
          client: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          proposals: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      db.project.count({ where }),
    ])

    return NextResponse.json({
      jobs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }
}