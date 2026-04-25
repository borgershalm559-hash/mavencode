import { handlers } from "@/lib/auth";
import { rateLimit, getIp } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";

export const GET = handlers.GET;

export async function POST(req: NextRequest) {
  // Rate-limit credentials sign-in by IP (5 attempts / 15 min).
  // Other NextAuth POST paths (signout, session) are not affected.
  if (req.nextUrl.pathname.endsWith("/callback/credentials")) {
    const rl = await rateLimit("auth", getIp(req));
    if (rl instanceof NextResponse) return rl;
  }
  return handlers.POST(req);
}
