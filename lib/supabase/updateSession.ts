import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { type SupabaseClient } from '@supabase/supabase-js'

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

  // Create a Supabase client for the middleware that's compatible with Edge Runtime
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        detectSessionInUrl: false,
        flowType: 'pkce',
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: {
          'x-client-info': 'middleware',
        },
      },
    }
  )

  // Refresh session to ensure current user data without using Node.js specific APIs
  await supabase.auth.getUser()

  return { supabase, response }
}