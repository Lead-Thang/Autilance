// middleware.ts
import { getToken } from "next-auth/jwt"
import { NextResponse, NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // Skip authentication check for auth routes
  if (req.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.next()
  }

  const token = await getToken({ req })

  if (!token) {
    return NextResponse.redirect(new URL("/auth/signin", req.url))
  }

  // Example: Restrict admin dashboard
  if (req.nextUrl.pathname.startsWith("/admin") && token.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url))
  }

  return NextResponse.next()
}