import "next-auth"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }
  interface User {
    id: string
    role?: "user" | "admin"
    password?: string
  }
  interface NextAuthOptions {
    providers: any[]
    session: any
    secret: string | undefined
    pages: any
    callbacks: any
  }
}