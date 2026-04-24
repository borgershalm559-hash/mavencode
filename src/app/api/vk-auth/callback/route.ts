import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { encode } from "@auth/core/jwt";
import { prisma } from "@/lib/prisma";

/**
 * VK OAuth callback — receives code + device_id + state from VK,
 * exchanges code for access_token, fetches user profile, creates/finds
 * a User row, and writes a NextAuth-compatible session cookie.
 *
 * Bypasses NextAuth's OAuth flow because VK strips dots from the state
 * parameter, breaking NextAuth's JWE-formatted state validation.
 */

const SITE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";
const CALLBACK_URL = SITE_URL + "/api/vk-auth/callback";
const COOKIE_NAME = process.env.NODE_ENV === "production"
  ? "__Secure-authjs.session-token"
  : "authjs.session-token";

interface VKTokenResponse {
  access_token?: string;
  expires_in?: number;
  refresh_token?: string;
  user_id?: number;
  email?: string;
  state?: string;
  error?: string;
  error_description?: string;
}

interface VKUserInfoResponse {
  user?: {
    user_id: string;
    first_name: string;
    last_name: string;
    email?: string;
    avatar?: string;
  };
  error?: string;
}

function fail(msg: string, detail?: unknown): NextResponse {
  console.error("[VK-AUTH]", msg, detail);
  const url = new URL("/?error=VKAuthFailed", SITE_URL);
  url.searchParams.set("vk_error", msg);
  return NextResponse.redirect(url.toString());
}

export async function GET(req: NextRequest) {
  const clientId = process.env.VK_CLIENT_ID;
  if (!clientId) return fail("VK_NOT_CONFIGURED");

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const deviceId = url.searchParams.get("device_id");
  const returnedState = url.searchParams.get("state");
  const oauthError = url.searchParams.get("error");

  if (oauthError) return fail("VK_REJECTED:" + oauthError);
  if (!code || !deviceId) return fail("MISSING_CODE_OR_DEVICE_ID");

  // Recover PKCE verifier from cookie
  const cookieStore = await cookies();
  const pkceCookie = cookieStore.get("vk-oauth-pkce")?.value;
  if (!pkceCookie) return fail("MISSING_PKCE_COOKIE");

  let verifier: string;
  let expectedState: string;
  try {
    const parsed = JSON.parse(pkceCookie) as { verifier: string; state: string };
    verifier = parsed.verifier;
    expectedState = parsed.state;
  } catch {
    return fail("INVALID_PKCE_COOKIE");
  }

  // VK mangles dots in state - compare after stripping dots from expected
  if (returnedState !== expectedState && returnedState !== expectedState.replace(/\./g, "")) {
    return fail("STATE_MISMATCH", { expected: expectedState, got: returnedState });
  }

  // Exchange code → token
  const tokenRes = await fetch("https://id.vk.com/oauth2/auth", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      code_verifier: verifier,
      client_id: clientId,
      device_id: deviceId,
      redirect_uri: CALLBACK_URL,
      state: returnedState ?? "",
    }),
  });

  const tokens = (await tokenRes.json()) as VKTokenResponse;
  if (!tokenRes.ok || !tokens.access_token) {
    return fail("TOKEN_EXCHANGE_FAILED", tokens);
  }

  // Fetch user profile
  const userRes = await fetch("https://id.vk.com/oauth2/user_info", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      access_token: tokens.access_token,
    }),
  });

  const userInfo = (await userRes.json()) as VKUserInfoResponse;
  if (!userRes.ok || !userInfo.user) {
    return fail("USER_INFO_FAILED", userInfo);
  }

  const vk = userInfo.user;
  const vkId = String(vk.user_id);
  const email = vk.email?.toLowerCase() ?? null;
  const name = [vk.first_name, vk.last_name].filter(Boolean).join(" ").trim() || "VK User";

  // Find or create User + Account records
  let dbUser = await prisma.user.findFirst({
    where: {
      accounts: { some: { provider: "vk", providerAccountId: vkId } },
    },
  });

  if (!dbUser && email) {
    // Link to existing account with same email (allowDangerousEmailAccountLinking behavior)
    dbUser = await prisma.user.findUnique({ where: { email } });
  }

  if (!dbUser) {
    // Fabricate an email if VK didn't provide one (unique per VK user_id)
    const effectiveEmail = email ?? `vk-${vkId}@users.mavencode.local`;
    dbUser = await prisma.user.create({
      data: {
        email: effectiveEmail,
        name,
        image: vk.avatar ?? null,
        emailVerified: email ? new Date() : null,
      },
    });
    // Create PvpRating for new user (events.createUser equivalent)
    await prisma.pvpRating.create({ data: { userId: dbUser.id } }).catch(() => {});
  }

  // Ensure Account row exists and is linked
  await prisma.account.upsert({
    where: {
      provider_providerAccountId: {
        provider: "vk",
        providerAccountId: vkId,
      },
    },
    create: {
      userId: dbUser.id,
      type: "oauth",
      provider: "vk",
      providerAccountId: vkId,
      access_token: tokens.access_token,
      token_type: "Bearer",
      expires_at: tokens.expires_in ? Math.floor(Date.now() / 1000) + tokens.expires_in : null,
      refresh_token: tokens.refresh_token ?? null,
      scope: "email vkid.personal_info",
    },
    update: {
      access_token: tokens.access_token,
      expires_at: tokens.expires_in ? Math.floor(Date.now() / 1000) + tokens.expires_in : null,
      refresh_token: tokens.refresh_token ?? null,
    },
  });

  // Create NextAuth-compatible JWT session token
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) return fail("AUTH_SECRET_MISSING");

  const sessionJwt = await encode({
    token: {
      sub: dbUser.id,
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      picture: dbUser.image,
      role: dbUser.role,
    },
    secret,
    salt: COOKIE_NAME,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });

  // Clear PKCE cookie, set session cookie, redirect to dashboard
  const redirect = NextResponse.redirect(new URL("/dashboard", SITE_URL));
  redirect.cookies.set({
    name: "vk-oauth-pkce",
    value: "",
    maxAge: 0,
    path: "/",
  });
  redirect.cookies.set({
    name: COOKIE_NAME,
    value: sessionJwt,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  });
  return redirect;
}
