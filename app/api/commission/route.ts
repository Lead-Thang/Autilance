import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getCommissionSummary } from "@/lib/commission"

/**
 * GET commission summary for current user
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (!session?.user || sessionError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const periodParam = searchParams.get("period") || "month"
    const period = (periodParam === "month" || periodParam === "year")
      ? periodParam
      : "month"

    const summary = await getCommissionSummary(session.user.id, period)

    return NextResponse.json({
      ...summary,
      message: "5% commission - lowest in the industry!"
    })
  } catch (error) {
    console.error("Error fetching commission summary:", error)
    return NextResponse.json(
      { error: "Failed to fetch commission data" },
      { status: 500 }
    )
  }
}