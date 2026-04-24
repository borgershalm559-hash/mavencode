import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Yandex from "next-auth/providers/yandex";
import VK from "next-auth/providers/vk";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

/* ── Server-side in-memory rate limiter ── */
const serverRL = new Map<string, { count: number; resetAt: number }>();
function checkServerRL(email: string): boolean {
  const now = Date.now();
  const entry = serverRL.get(email);
  if (!entry || entry.resetAt < now) return false;
  return entry.count >= 5;
}
function recordServerFail(email: string) {
  const now = Date.now();
  const entry = serverRL.get(email);
  if (!entry || entry.resetAt < now) {
    serverRL.set(email, { count: 1, resetAt: now + 15 * 60 * 1000 });
  } else { entry.count++; }
}
function clearServerRL(email: string) { serverRL.delete(email); }

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  debug: true, // Temporarily enabled to diagnose production OAuth issues
  trustHost: true,
  pages: {
    signIn: "/",
  },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID
      ? [Google({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET! })]
      : []),
    ...(process.env.GITHUB_ID
      ? [GitHub({ clientId: process.env.GITHUB_ID, clientSecret: process.env.GITHUB_SECRET!, allowDangerousEmailAccountLinking: true })]
      : []),
    ...(process.env.YANDEX_CLIENT_ID
      ? [Yandex({
          clientId: process.env.YANDEX_CLIENT_ID,
          clientSecret: process.env.YANDEX_CLIENT_SECRET!,
          allowDangerousEmailAccountLinking: true,
          authorization: {
            url: "https://oauth.yandex.ru/authorize",
            params: { scope: "login:email login:info" },
          },
        })]
      : []),
    ...(process.env.VK_CLIENT_ID
      ? [VK({
          clientId: process.env.VK_CLIENT_ID,
          clientSecret: process.env.VK_CLIENT_SECRET!,
          allowDangerousEmailAccountLinking: true,
        })]
      : []),
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const email = (credentials.email as string)?.trim().toLowerCase();
        const password = credentials.password as string;

        if (!email || !password) return null;

        // Server-side rate limit check
        if (checkServerRL(email)) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) {
          recordServerFail(email);
          return null;
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          recordServerFail(email);
          return null;
        }

        clearServerRL(email);
        return { id: user.id, name: user.name, email: user.email, image: user.image };
      },
    }),
  ],
  events: {
    // Fires when a NEW user is created via OAuth (GitHub, Google)
    async createUser({ user }) {
      await prisma.pvpRating.create({
        data: { userId: user.id! },
      }).catch(() => {}); // silently ignore if already exists

      // Mark email as verified for OAuth users (provider already verified it)
      if (user.id) {
        await prisma.user.update({
          where: { id: user.id },
          data: { emailVerified: new Date() },
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
