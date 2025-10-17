import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  try {
    // Use the Supabase middleware utility to handle session updates
    const { response } = await updateSession(request)
    return response
  } catch (error) {
    console.error('Error in middleware:', error)
    // Return a safe response if middleware fails
    return new Response('Internal Server Error', { status: 500 })
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     * - auth (authentication pages)
     */
    '/((?!_next/static|_next/image|favicon.ico|api|auth).*)',
  ],
}