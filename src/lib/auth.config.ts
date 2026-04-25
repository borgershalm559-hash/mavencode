import type { NextAuthConfig } from "next-auth";

// Edge-compatible auth config — NO Prisma, NO bcrypt, NO Node.js-only modules.
// Used only by middleware for JWT session verification.
// Full auth config (with PrismaAdapter + providers) lives in auth.ts.
export const authConfig = {
  session: { strategy: "jwt" as const },
  trustHost: true,
  pages: { signIn: "/" },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) ?? "user";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
