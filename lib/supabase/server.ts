import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { type Database } from '@/types/supabase'; // Ensure types are generated

export async function createClient() {
  const cookieStore = await cookies(); // In Next.js 14+, cookies() returns a Promise

  // Check if environment variables are set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
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

  // Optionally refresh session to ensure current user data
  await supabase.auth.getUser();

  return supabase;
}