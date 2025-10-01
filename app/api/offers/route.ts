import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"

// GET all offers
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get("limit") || "10")
    const page = parseInt(searchParams.get("page") || "1")
    const categoryId = searchParams.get("categoryId")
    const freelancerId = searchParams.get("freelancerId")
    const skip = (page - 1) * limit

    const where: any = {
      isActive: true,
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (freelancerId) {
      where.freelancerId = freelancerId
    }

    const [offers, total] = await Promise.all([
      // @ts-ignore: TypeScript not recognizing the offer model
      db.offer.findMany({
        where,
        include: {
          freelancer: {
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
          tiers: true,
          addons: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      // @ts-ignore: TypeScript not recognizing the offer model
      db.offer.count({ where }),
    ])

    return NextResponse.json({
      offers,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching offers:", error)
    return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 })
  }
}

// POST create a new offer
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (!session?.user || error) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    // Create the offer
    // @ts-ignore: TypeScript not recognizing the offer model
    const offer = await db.offer.create({
      data: {
        freelancerId: session.user.id,
        title: body.title,
        description: body.description,
        categoryId: body.categoryId,
        deliveryTimeDays: body.deliveryTimeDays,
        revisionLimit: body.revisionLimit,
        priceCents: body.priceCents,
        isActive: true,
        tiers: {
          create: body.tiers || [],
        },
        addons: {
          create: body.addons || [],
        },
      },
      include: {
        tiers: true,
        addons: true,
      },
    })

    return NextResponse.json(offer)
  } catch (error) {
    console.error("Error creating offer:", error)
    return NextResponse.json({ error: "Failed to create offer" }, { status: 500 })
  }
}