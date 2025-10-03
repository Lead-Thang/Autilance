import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/updateSession';

export async function middleware(request: NextRequest) {
  // Use the existing updateSession function which properly handles session management
  const { response } = await updateSession(request);
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};