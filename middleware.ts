import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Create a minimal response without importing any external modules
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
  
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};