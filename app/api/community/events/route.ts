import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { z } from "zod"

/**
 * GET all community events
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const upcoming = searchParams.get("upcoming") === "true"
    const limit = parseInt(searchParams.get("limit") || "20")
    const page = parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    const where: any = {}
    if (upcoming) {
      where.startTime = { gte: new Date() }
    }

    const [events, total] = await Promise.all([
      db.communityEvent.findMany({
        where,
        include: {
          organizer: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          _count: {
            select: {
              attendees: true,
            },
          },
        },
        orderBy: {
          startTime: upcoming ? "asc" : "desc",
        },
        skip,
        take: limit,
      }),
      db.communityEvent.count({ where }),
    ])

    return NextResponse.json({
      events,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    )
  }
}

/**
 * POST create a new event
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
      title: z.string().min(5, "Title must be at least 5 characters"),
      description: z.string().min(20, "Description must be at least 20 characters"),
      eventType: z.enum(["webinar", "workshop", "meetup", "networking"]),
      startTime: z.string().datetime(),
      endTime: z.string().datetime(),
      timezone: z.string(),
      isVirtual: z.boolean().default(true),
      location: z.string().optional(),
      meetingLink: z.string().url().optional(),
      maxAttendees: z.number().int().positive().optional(),
    })

    const validatedData = schema.parse(body)

    // Verify start time is in the future
    const startTime = new Date(validatedData.startTime)
    const endTime = new Date(validatedData.endTime)

    if (startTime <= new Date()) {
      return NextResponse.json(
        { error: "Event start time must be in the future" },
        { status: 400 }
      )
    }

    if (endTime <= startTime) {
      return NextResponse.json(
        { error: "Event end time must be after start time" },
        { status: 400 }
      )
    }

    // Create the event
    const event = await db.communityEvent.create({
      data: {
        organizerId: session.user.id,
        title: validatedData.title,
        description: validatedData.description,
        eventType: validatedData.eventType,
        startTime,
        endTime,
        timezone: validatedData.timezone,
        isVirtual: validatedData.isVirtual,
        location: validatedData.location,
        meetingLink: validatedData.meetingLink,
        maxAttendees: validatedData.maxAttendees,
      },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            attendees: true,
          },
        },
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Error creating event:", error)
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    )
  }
}
