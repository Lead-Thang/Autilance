import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function updateSession(request: NextRequest) {
  // Get environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables');
    // Return a basic response without Supabase functionality if env vars are missing
    return { 
      supabase: null, 
      response: NextResponse.next() 
    };
  }

  // Create response object - only once at the beginning
  let response = NextResponse.next();

  // Create a Supabase server client with the right configuration for Edge runtime
  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // Just set the cookie on the response, don't create new response
          response.cookies.set(name, value, options);
        },
        remove(name: string, options: CookieOptions) {
          // Just remove the cookie from the response
          response.cookies.set(name, '', { ...options, maxAge: 0 });
        },
      },
    }
  );

  // Optionally, you can perform session validation here if needed
  // await supabase.auth.getUser() // Uncomment if you need to validate session

  return { supabase, response }
}