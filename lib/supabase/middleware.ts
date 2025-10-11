import { type NextRequest, NextResponse } from 'next/server'

// IMPORTANT: This helper runs inside Next.js middleware which executes in the
// Edge runtime. Avoid importing Node-only modules (like server-side Supabase
// clients) at the top level here. If you need server-side session validation
// use a separate-server route (e.g. `app/api/session/route.ts`).

export async function updateSession(request: NextRequest) {
  // Return a minimal response that is safe for the Edge runtime. We intentionally
  // avoid creating any Supabase server client here to prevent Node-only module
  // imports from leaking into the Edge bundle.
  const response = NextResponse.next({ request })

  return { supabase: null, response }
}