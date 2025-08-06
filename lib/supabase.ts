// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

// Ensure your environment variables are set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be defined in your environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
