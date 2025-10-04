import { NextResponse } from 'next/server';

export async function middleware() {
  try {
    // Create a minimal response
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // Return a basic response even if there's an error
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};