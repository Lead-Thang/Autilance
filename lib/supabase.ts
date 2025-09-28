/**
 * @deprecated This file uses the legacy Supabase approach.
 * Please use the client wrappers in @/lib/supabase/client.ts for browser-side
 * and @/lib/supabase/server.ts for server-side operations.
 * 
 * This approach doesn't properly handle cookies in Next.js App Router.
 */
import { createClient } from '@supabase/supabase-js'

// Ensure your environment variables are set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be defined in your environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)