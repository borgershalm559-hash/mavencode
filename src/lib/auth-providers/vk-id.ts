import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers";
import crypto from "node:crypto";

/**
 * Custom NextAuth provider for VK ID (id.vk.com).
 * Uses OAuth 2.1 with PKCE (required by VK).
 * Docs: https://id.vk.com/about/business/go/docs/ru/vkid/latest/oauth-vk
 */

export interface VKIDProfile {
  user: {
    user_id: string;
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    avatar?: string;
    sex?: number;
    verified?: boolean;
    birthday?: string;
  };
}

// Module-level PKCE verifier map (single-instance serverless workaround).
// On Vercel each cold start may have its own map, but for a short-lived
// OAuth roundtrip (seconds) it should persist within the same lambda.
const pkceStore = new Map<string, { verifier: string; expires: number }>();

function base64url(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function genVerifier(): string {
  return base64url(crypto.randomBytes(32));
}

function genChallenge(verifier: string): string {
  return base64url(crypto.createHash("sha256").update(verifier).digest());
}

function cleanupExpired() {
  const now = Date.now();
  for (const [k, v] of pkceStore) {
    if (v.expires < now) pkceStore.delete(k);
  }
}

export default function VKID<P extends VKIDProfile>(
  options: OAuthUserConfig<P>,
): OAuthConfig<P> {
  return {
    id: "vk",
    name: "VK",
    type: "oauth",
    // Disable auto-PKCE; we handle it manually because VK ID requires
    // device_id to be passed to the token endpoint and NextAuth's built-in
    // PKCE handler doesn't know about that custom param.
    checks: ["state"],

    authorization: {
      url: "https://id.vk.com/authorize",
      params: (() => {
        // Generate a fresh verifier for every server start. Token exchange will
        // look it up via the state cookie.
        const verifier = genVerifier();
        const challenge = genChallenge(verifier);
        cleanupExpired();
        // Store under a well-known key; we'll re-derive it in token handler
        // using client_id as key since request() doesn't have state.
        pkceStore.set("__last", { verifier, expires: Date.now() + 600_000 });
        console.log("[VKID] Generated PKCE challenge for authorization URL");
        return {
          scope: "email vkid.personal_info",
          response_type: "code",
          code_challenge: challenge,
          code_challenge_method: "S256",
        };
      })(),
    },

    token: {
      url: "https://id.vk.com/oauth2/auth",
      async request(context: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { params, provider } = context as any;

        // Retrieve the PKCE verifier we generated in authorization step
        const stored = pkceStore.get("__last");
        const codeVerifier = stored?.verifier ?? "";

        console.log("[VKID] token.request invoked with params:", {
          code: params.code ? "[present]" : "[MISSING]",
          device_id: params.device_id ? "[present]" : "[MISSING]",
          state: params.state ? "[present]" : "[MISSING]",
          code_verifier: codeVerifier ? "[present]" : "[MISSING]",
        });

        const body = new URLSearchParams({
          grant_type: "authorization_code",
          code: String(params.code ?? ""),
          code_verifier: codeVerifier,
          client_id: String(provider.clientId ?? ""),
          device_id: String(params.device_id ?? ""),
          redirect_uri: String(provider.callbackUrl ?? ""),
          state: String(params.state ?? ""),
        });

        const res = await fetch("https://id.vk.com/oauth2/auth", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body,
        });

        const tokens = await res.json();
        console.log("[VKID] token response:", res.status, JSON.stringify(tokens));

        if (!res.ok) {
          throw new Error(
            `VK ID token exchange failed (${res.status}): ${JSON.stringify(tokens)}`,
          );
        }
        return { tokens };
      },
    },

    userinfo: {
      url: "https://id.vk.com/oauth2/user_info",
      async request(context: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { tokens, provider } = context as any;

        const res = await fetch("https://id.vk.com/oauth2/user_info", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: String(provider.clientId ?? ""),
            access_token: String(tokens.access_token ?? ""),
          }),
        });

        const data = await res.json();
        console.log("[VKID] user_info response:", res.status, JSON.stringify(data));

        if (!res.ok) {
          throw new Error(
            `VK ID user_info failed (${res.status}): ${JSON.stringify(data)}`,
          );
        }
        return data;
      },
    },

    profile(profile) {
      console.log("[VKID] profile() called with:", JSON.stringify(profile));
      const u = profile.user;
      const fullName = [u.first_name, u.last_name].filter(Boolean).join(" ").trim();
      return {
        id: String(u.user_id),
        name: fullName || "VK User",
        email: u.email ?? null,
        image: u.avatar ?? null,
      };
    },

    style: { bg: "#0077FF", text: "#ffffff" },
    options,
  };
}
