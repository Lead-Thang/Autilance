import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"

// GET specific offer
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const offer = await db.offer.findUnique({
      where: {
        id: params.id,
      },
      include: {
        freelancer: {
          select: {
            id: true,
            name: true,
            image: true,
            profile: true,
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
    })

    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 })
    }

    return NextResponse.json(offer)
  } catch (error) {
    console.error("Error fetching offer:", error)
    return NextResponse.json({ error: "Failed to fetch offer" }, { status: 500 })
  }
}

// PUT update specific offer
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (!session?.user || error) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    // Check if the offer belongs to the user
    const existingOffer = await db.offer.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!existingOffer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 })
    }

    if (existingOffer.freelancerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Update the offer
    const offer = await db.offer.update({
      where: {
        id: params.id,
      },
      data: {
        title: body.title,
        description: body.description,
        categoryId: body.categoryId,
        deliveryTimeDays: body.deliveryTimeDays,
        revisionLimit: body.revisionLimit,
        priceCents: body.priceCents,
        isActive: body.isActive,
      },
      include: {
        tiers: true,
        addons: true,
      },
    })

    return NextResponse.json(offer)
  } catch (error) {
    console.error("Error updating offer:", error)
    return NextResponse.json({ error: "Failed to update offer" }, { status: 500 })
  }
}

// DELETE specific offer
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (!session?.user || error) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the offer belongs to the user
    const existingOffer = await db.offer.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!existingOffer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 })
    }

    if (existingOffer.freelancerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Delete the offer
    await db.offer.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ message: "Offer deleted successfully" })
  } catch (error) {
    console.error("Error deleting offer:", error)
    return NextResponse.json({ error: "Failed to delete offer" }, { status: 500 })
  }
}