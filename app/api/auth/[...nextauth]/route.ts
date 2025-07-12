import NextAuth, { NextAuthOptions } from "next-auth"
import { authOptions } from "d:\\Autilance\\lib\\auth"

export default NextAuth(authOptions)
import GoogleProvider from "next-auth/providers/google"