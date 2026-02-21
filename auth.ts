import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      // 본인 GitHub 계정만 로그인 허용
      return profile?.login === process.env.ADMIN_GITHUB_ID
    },
    async session({ session, token }) {
      return session
    },
  },
})
