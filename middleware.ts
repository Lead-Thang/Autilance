import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/updateSession'; // Adjust path based on your project structure

export async function middleware(request: NextRequest) {
  const { response } = await updateSession(request);
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};