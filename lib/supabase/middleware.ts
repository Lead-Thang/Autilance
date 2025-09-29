import { type NextRequest, NextResponse } from 'next/server'

/**
 * updateSession
 *
 * NOTE: This function is intentionally minimal and Edge-runtime safe. The
 * original implementation used `@supabase/ssr` which pulls in Node-only APIs
 * and prevents Next.js middleware from being bundled for the Edge runtime.
 *
 * For middleware (which runs in the Edge), we simply return a NextResponse
 * preserving the incoming request headers. If you need full Supabase session
 * handling in server components or API routes (Node runtime), implement the
 * server-side session sync there instead of in Edge middleware.
 */
export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Keep the shape similar to the previous implementation so callers that
  // destructure { supabase, response } won't break. `supabase` is null here
  // because creating a Supabase client in middleware would pull Node APIs.
  return { supabase: null, response }
}