import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies()
    const supabase = createClient()
    
    // Get user session
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { liked } = await request.json()
    
    // In a real implementation, you would track likes in a separate table
    // For now, we'll just update the likes count on the post
    
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('likes')
      .eq('id', params.id)
      .single()
    
    if (postError) {
      console.error('Error fetching post:', postError)
      return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
    }
    
    // Update the likes count
    const newLikes = liked ? post.likes + 1 : Math.max(0, post.likes - 1)
    
    const { error: updateError } = await supabase
      .from('posts')
      .update({ likes: newLikes })
      .eq('id', params.id)
    
    if (updateError) {
      console.error('Error updating post:', updateError)
      return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
    }
    
    return NextResponse.json({ likes: newLikes })
  } catch (error) {
    console.error('Error liking post:', error)
    return NextResponse.json({ error: 'Failed to like post' }, { status: 500 })
  }
}