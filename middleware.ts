import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Start with a response that preserves the incoming request headers
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  // Read cookies from the incoming request
  const cookiesReader = request.cookies

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Optional: guard for missing env vars
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('Missing Supabase environment variables')
  }

  const supabase = createServerClient(
    SUPABASE_URL!,
    SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Read from the incoming request
        get(name: string) {
          return cookiesReader.get(name)?.value
        },
        // Write to the outgoing response cookies
        set(name: string, value: string, options: CookieOptions) {
          // Update the response cookies; no mutation of `request`
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          // Clear via cookies API on the response
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  try {
    await supabase.auth.getUser()
  } catch (e) {
    // Optional: handle error (log, clear cookies, etc.)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
