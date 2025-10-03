import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

/**
 * updateSession
 *
 * This function handles Supabase session updates in middleware running in Edge Runtime.
 * It avoids using Node.js specific APIs to ensure compatibility.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create a Supabase client for the middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options })
        },
      },
      // Disable features that use Node.js specific APIs in Edge Runtime
      auth: {
        detectSessionInUrl: false,
        flowType: 'pkce',
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )

  // Refresh session to ensure current user data without using Node.js specific APIs
  await supabase.auth.getUser()

  return { supabase, response }
}