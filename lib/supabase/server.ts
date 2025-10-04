import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { type Database } from '@/types/supabase'; // Ensure types are generated

export async function createClient() {
  const cookieStore = await cookies(); // In Next.js 14 App Router, cookies() returns a Promise in server components

  // Check if environment variables are set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables');
    // Return a mock client that won't work but won't crash
    return createServerClient<Database>('', '', {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            console.warn('Failed to set cookie in server component:', error);
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            console.warn('Failed to remove cookie in server component:', error);
          }
        },
      },
    });
  }

  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            console.warn('Failed to set cookie in server component:', error);
            // Handle gracefully; middleware or client-side refresh may be needed
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            console.warn('Failed to remove cookie in server component:', error);
            // Handle gracefully; middleware or client-side refresh may be needed
          }
        },
      },
    }
  );

  try {
    // Optionally refresh session to ensure current user data
    await supabase.auth.getUser();
  } catch (error) {
    console.warn('Error getting user:', error);
  }

  return supabase;
}