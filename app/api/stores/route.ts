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
    
    // In a real implementation, you would fetch stores from your database
    // For now, we'll return mock data that matches the structure expected by the frontend
    
    const mockStores = [
      {
        id: "1",
        name: "My First Store",
        domain: `${user.email?.split('@')[0] || 'user'}-store.autilance.com`,
        components: [],
        theme: { 
          primaryColor: "#6366f1", 
          secondaryColor: "#8b5cf6", 
          fontFamily: "Inter", 
          layout: "modern" 
        },
        seo: {
          title: "My Store",
          description: "My amazing store",
          keywords: ["store", "products"]
        },
        created_at: new Date().toISOString()
      }
    ]
    
    return NextResponse.json(mockStores)
  } catch (error) {
    console.error('Error fetching stores:', error)
    return NextResponse.json({ error: 'Failed to fetch stores' }, { status: 500 })
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
    
    const storeData = await request.json()
    
    // In a real implementation, you would save the store to your database
    // For now, we'll just return the data with an ID
    
    const newStore = {
      id: Date.now().toString(),
      userId: user.id,
      name: storeData.name,
      domain: storeData.domain,
      components: storeData.components || [],
      theme: storeData.theme || { 
        primaryColor: "#6366f1", 
        secondaryColor: "#8b5cf6", 
        fontFamily: "Inter", 
        layout: "modern" 
      },
      seo: storeData.seo || {
        title: "",
        description: "",
        keywords: []
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    return NextResponse.json(newStore)
  } catch (error) {
    console.error('Error creating store:', error)
    return NextResponse.json({ error: 'Failed to create store' }, { status: 500 })
  }
}