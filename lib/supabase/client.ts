
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables')
    // Return a mock client or throw an error depending on your needs
    // For now, we'll return a client that won't work but won't crash
    return createBrowserClient('', '')
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
