import { createClient } from "@/lib/supabase/server"

export async function getCurrentUser() {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.warn('Error getting user:', error)
      return null
    }
    
    return user
  } catch (error) {
    console.warn('Error in getCurrentUser:', error)
    return null
  }
}