import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/updateSession'; // Adjust path based on your project structure
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  // Start with a response that preserves the incoming request headers
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  // Read cookies from the incoming request
  const cookiesReader = request.cookies

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Guard for missing env vars
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('Missing Supabase environment variables')
    return response; // Early return to avoid further errors
  }

  const supabase = createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        // Read from the incoming request
        get(name: string) {
          return cookiesReader.get(name)?.value
        },
        // Write to the outgoing response cookies
        set(name: string, value: string, options: CookieOptions) {
          // Update the response cookies without mutating the original request
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          // Clear via cookies API on the response
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  try {
    // Use the appropriate method based on Supabase version
    const auth = supabase.auth;
    // Prefer getUser for newer versions; fallback to refreshSession if needed
    if (typeof auth.getUser === 'function') {
      await auth.getUser();
    } else if (typeof auth.refreshSession === 'function') {
      await auth.refreshSession();
    }
    // If neither exists, no action is taken
  } catch (e) {
    console.error('Supabase auth refresh failed:', e);
    // Optionally, clear cookies or redirect if critical
  }

  return response
}

export const config = {
  runtime: 'nodejs', // Explicitly set to Node.js Runtime to resolve Edge incompatibilities
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
