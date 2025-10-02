import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/updateSession'; // Adjust path based on your project structure

export async function middleware(request: NextRequest) {
  // Use the existing updateSession function which properly handles session management
  const { response } = await updateSession(request);
  return response;
}

export const config = {
  runtime: 'nodejs', // Explicitly set to Node.js Runtime to resolve Edge incompatibilities
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
