import { NextResponse } from 'next/server';

export async function middleware() {
  // Only run the most basic middleware functionality
  // Avoid any imports that might reference Node.js globals
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};