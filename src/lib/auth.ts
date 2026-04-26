import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Yandex from "next-auth/providers/yandex";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { LEGAL_VERSION } from "./legal-version";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  trustHost: true,
  pages: {
    signIn: "/",
  },
  providers: [
    ...(process.env.GITHUB_ID
      ? [GitHub({
          clientId: process.env.GITHUB_ID,
          clientSecret: process.env.GITHUB_SECRET!,
          // allowDangerousEmailAccountLinking removed: a credentials user
          // whose email matches a later GitHub login would otherwise be
          // silently merged. NextAuth will now require explicit linking.
        })]
      : []),
    ...(process.env.YANDEX_CLIENT_ID
      ? [Yandex({
          clientId: process.env.YANDEX_CLIENT_ID,
          clientSecret: process.env.YANDEX_CLIENT_SECRET!,
          authorization: {
            url: "https://oauth.yandex.ru/authorize",
            params: { scope: "login:email login:info" },
          },
        })]
      : []),
    // VK is handled outside NextAuth via /api/vk-auth/* routes
    // because NextAuth's state check can't handle VK's dot-stripping.
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const email = (credentials.email as string)?.trim().toLowerCase();
        const password = credentials.password as string;

        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        return { id: user.id, name: user.name, email: user.email, image: user.image };
      },
    }),
  ],
  events: {
    // Fires when a NEW user is created via OAuth (GitHub, Yandex)
    async createUser({ user }) {
      await prisma.pvpRating.create({
        data: { userId: user.id! },
      }).catch(() => {}); // silently ignore if already exists

      // Mark email as verified for OAuth users (provider already verified it).
      // Also record consent: by signing in via OAuth the user agrees to
      // Terms and Privacy (the consent UI is shown on the auth screen).
      if (user.id) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            emailVerified: new Date(),
            agreedToTermsAt: new Date(),
            agreedTermsVersion: LEGAL_VERSION,
          },
        }).catch(() => {});
      }
    },
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        // Fetch role from DB on sign-in
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true },
        });
        token.role = dbUser?.role ?? "user";
      }
      // Refresh role on session update
      if (trigger === "update" && token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true },
        });
        token.role = dbUser?.role ?? "user";
      }
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
});
