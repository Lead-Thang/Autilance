import { NextResponse } from 'next/server';

export async function middleware() {
  // Create a minimal response
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};