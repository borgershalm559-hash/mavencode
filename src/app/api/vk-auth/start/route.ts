import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { cookies } from "next/headers";

/**
 * VK OAuth start — generates PKCE verifier + challenge, stores them in a
 * short-lived HTTP-only cookie, and redirects the user to VK ID authorize.
 *
 * Callback path: /api/vk-auth/callback
 */

const CALLBACK_URL = (process.env.NEXTAUTH_URL || "http://localhost:3000") + "/api/vk-auth/callback";

function base64url(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function GET() {
  const clientId = process.env.VK_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: "VK not configured" }, { status: 500 });
  }

  const verifier = base64url(crypto.randomBytes(32));
  const challenge = base64url(crypto.createHash("sha256").update(verifier).digest());
  const state = base64url(crypto.randomBytes(16));

  // Store verifier + expected state in a signed cookie for callback verification
  const cookieStore = await cookies();
  cookieStore.set({
    name: "vk-oauth-pkce",
    value: JSON.stringify({ verifier, state }),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600, // 10 minutes
  });

  const authUrl = new URL("https://id.vk.com/authorize");
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", CALLBACK_URL);
  authUrl.searchParams.set("scope", "email vkid.personal_info");
  authUrl.searchParams.set("code_challenge", challenge);
  authUrl.searchParams.set("code_challenge_method", "S256");
  authUrl.searchParams.set("state", state);

  return NextResponse.redirect(authUrl.toString());
}
