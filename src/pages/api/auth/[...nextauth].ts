import NextAuth, { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).github = token.github
      }
      return session
    },
    async jwt({ token, profile }) {
      if (profile) {
        token.github = (profile as any).login
      }
      return token
    },
  },
}

export default NextAuth(authOptions)
