import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { type NextFetchEvent } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session
  const { data, error } = await supabase.auth.getSession()
  
  // List of paths that should be publicly accessible
  const publicPaths = [
    '/auth/signin',
    '/auth/signup',
    '/',
    '/terms',
    '/privacy'
  ]
  
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname === path || 
    (path !== '/' && request.nextUrl.pathname.startsWith(path))
  )
  
  // If user is not authenticated and trying to access protected routes
  if (!data.session && !isPublicPath) {
    // Redirect to sign in page
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/auth/signin'
    return NextResponse.redirect(redirectUrl)
  }
  
  // If user is authenticated and trying to access auth pages
  if (data.session && isPublicPath && !['/', '/terms', '/privacy'].includes(request.nextUrl.pathname)) {
    // Redirect to dashboard
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/dashboard'
    return NextResponse.redirect(redirectUrl)
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