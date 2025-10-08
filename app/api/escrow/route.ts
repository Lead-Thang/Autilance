import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { z } from "zod"

/**
 * GET escrow transactions
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (!session?.user || sessionError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const contractId = searchParams.get("contractId")
    const status = searchParams.get("status")
    const limit = parseInt(searchParams.get("limit") || "20")
    const page = parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    const where: any = {
      OR: [
        { clientId: session.user.id },
        { freelancerId: session.user.id },
      ],
    }

    if (contractId) {
      where.contractId = contractId
    }

    if (status) {
      where.status = status
    }

    const [transactions, total] = await Promise.all([
      db.escrowTransaction.findMany({
        where,
        include: {
          client: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          freelancer: {
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
          milestone: {
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
      db.escrowTransaction.count({ where }),
    ])

    return NextResponse.json({
      transactions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching escrow transactions:", error)
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    )
  }
}

/**
 * POST create a new escrow transaction
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
      freelancerId: z.string(),
      amountCents: z.number().int().positive(),
      currency: z.string().default("USD"),
      contractId: z.string().optional(),
      milestoneId: z.string().optional(),
    })

    const validatedData = schema.parse(body)

    // Verify the user is the client (not the freelancer)
    if (validatedData.freelancerId === session.user.id) {
      return NextResponse.json(
        { error: "You cannot create an escrow transaction for yourself" },
        { status: 400 }
      )
    }

    // Verify freelancer exists
    const freelancer = await db.user.findUnique({
      where: { id: validatedData.freelancerId },
    })

    if (!freelancer) {
      return NextResponse.json(
        { error: "Freelancer not found" },
        { status: 404 }
      )
    }

    // If contractId is provided, verify it exists and user is the client
    if (validatedData.contractId) {
      const contract = await db.contract.findUnique({
        where: { id: validatedData.contractId },
      })

      if (!contract) {
        return NextResponse.json(
          { error: "Contract not found" },
          { status: 404 }
        )
      }

      if (contract.clientId !== session.user.id) {
        return NextResponse.json(
          { error: "You are not the client for this contract" },
          { status: 403 }
        )
      }
    }

    // If milestoneId is provided, verify it exists
    if (validatedData.milestoneId) {
      const milestone = await db.milestone.findUnique({
        where: { id: validatedData.milestoneId },
      })

      if (!milestone) {
        return NextResponse.json(
          { error: "Milestone not found" },
          { status: 404 }
        )
      }

      // Check if escrow already exists for this milestone
      const existingEscrow = await db.escrowTransaction.findFirst({
        where: { milestoneId: validatedData.milestoneId },
      })

      if (existingEscrow) {
        return NextResponse.json(
          { error: "Escrow transaction already exists for this milestone" },
          { status: 400 }
        )
      }
    }

    // Create the escrow transaction
    // Note: In a real implementation, this would integrate with a payment processor
    // like Stripe, PayPal, or a blockchain escrow smart contract
    const transaction = await db.escrowTransaction.create({
      data: {
        clientId: session.user.id,
        freelancerId: validatedData.freelancerId,
        amountCents: validatedData.amountCents,
        currency: validatedData.currency,
        contractId: validatedData.contractId,
        milestoneId: validatedData.milestoneId,
        status: "pending", // Would be 'held' after payment confirmation
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        freelancer: {
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
        milestone: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Error creating escrow transaction:", error)
    return NextResponse.json(
      { error: "Failed to create escrow transaction" },
      { status: 500 }
    )
  }
}
