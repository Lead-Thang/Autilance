import type { NextAuthOptions, User } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

interface ExtendedUser extends User {
  id: string
  role?: "user" | "admin"
  password?: string
}

/**
 * Demo DB fetcher — replace with your real database call.
 */
async function getUserByEmail(email: string): Promise<ExtendedUser | null> {
  // Fake DB for now — upgrade to Prisma/Supabase/etc
  const users: ExtendedUser[] = [
    {
      id: "1",
      email: "demo@autilance.app",
      name: "Demo User",
      password: "letmein",
      role: "user",
      image: null
    },
    {
      id: "2",
      email: "admin@autilance.app",
      name: "Admin Boss",
      password: "godmode",
      role: "admin",
      image: null
    },
  ]

  const user = users.find((u) => u.email === email)
  return user || null
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await getUserByEmail(credentials.email)

        // TODO: Use hashed passwords in production
        if (user && credentials.password === user.password) {
          const { password, ...safeUser } = user
          return safeUser
        }

        return null
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as ExtendedUser).id
        token.role = (user as ExtendedUser).role || "user"
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as ExtendedUser).id = token.id as string
        ;(session.user as ExtendedUser).role = (token.role === "admin" || token.role === "user") ? token.role : undefined
      }
      return session
    },
  },
}
