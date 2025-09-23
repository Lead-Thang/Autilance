import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createClient()
    
    // Get user session
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Fetch posts with user information
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select(`
        id,
        user_id,
        content,
        created_at,
        likes,
        comments,
        users (id, name, avatar)
      `)
      .order('created_at', { ascending: false })
      .limit(20)
    
    if (postsError) {
      console.error('Error fetching posts:', postsError)
      return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
    }
    
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching feed posts:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createClient()
    
    // Get user session
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { content } = await request.json()
    
    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }
    
    // Insert new post
    const { data: post, error: postError } = await supabase
      .from('posts')
      .insert({
        user_id: user.id,
        content: content.trim(),
        created_at: new Date().toISOString(),
        likes: 0,
        comments: 0
      })
      .select(`
        id,
        user_id,
        content,
        created_at,
        likes,
        comments,
        users (id, name, avatar)
      `)
      .single()
    
    if (postError) {
      console.error('Error creating post:', postError)
      return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
    }
    
    return NextResponse.json(post)
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}