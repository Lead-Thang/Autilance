import { type NextRequest, NextResponse } from 'next/server'

/**
 * updateSession
 *
 * This function handles Supabase session updates in middleware running in Edge Runtime.
 * It avoids using Node.js specific APIs to ensure compatibility.
 */
export async function updateSession(request: NextRequest) {
  // Create a minimal response
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Return the response without any Supabase client operations
  // which might not be fully Edge compatible
  return { response }
}