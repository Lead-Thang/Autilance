import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Check if the client was created properly (environment variables exist)
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    // getSession is not available in the standard Supabase client
    // We'll use getUser instead which returns user information
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      console.error('Error getting user:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ user: user ?? null })
  } catch (err) {
    console.error('Unexpected error in session route:', err)
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
  }
}
