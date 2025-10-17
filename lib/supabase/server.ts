import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { type Database } from '@/types/supabase'; // Ensure types are generated

export async function createClient() {
  // Check if environment variables are set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables');
    // Return a client that won't work but won't crash
    return createSupabaseClient<Database>('', '', {});
  }

  const supabase = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
    }
  });

  try {
    // Optionally refresh session to ensure current user data
    await supabase.auth.getUser();
  } catch (error) {
    console.warn('Error getting user:', error);
  }

  return supabase;
}