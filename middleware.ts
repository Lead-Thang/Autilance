import { type NextRequest, NextResponse } from 'next/server'

// Minimal Edge-safe middleware: avoid importing any modules that may pull
// Node-only APIs into the Edge bundle (for example, @supabase/ssr). If you
// need to run Supabase session checks, perform them in server routes or
// server components instead.
export async function middleware(request: NextRequest) {
  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  })
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