import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers";

/**
 * Custom NextAuth provider for VK ID (id.vk.com).
 *
 * VK ID is VK's modern OAuth 2.1 platform that replaces the legacy
 * oauth.vk.com flow. Key differences:
 *   - Endpoints live on id.vk.com
 *   - PKCE (S256) is REQUIRED
 *   - Token exchange requires a `device_id` param returned by VK
 *     in the authorization callback (NOT a standard OAuth 2.0 param)
 *   - User info endpoint is a POST with client_id+access_token in body
 *   - Response shape is `{ user: { user_id, first_name, ... } }`
 *     instead of a flat profile object
 *
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

export default function VKID<P extends VKIDProfile>(
  options: OAuthUserConfig<P>,
): OAuthConfig<P> {
  return {
    id: "vk",
    name: "VK",
    type: "oauth",
    checks: ["pkce", "state"],

    authorization: {
      url: "https://id.vk.com/authorize",
      params: {
        scope: "email vkid.personal_info",
        response_type: "code",
      },
    },

    token: {
      url: "https://id.vk.com/oauth2/auth",
      async request(context: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { params, provider, checks } = context as any;

        const bodyParams = {
          grant_type: "authorization_code",
          code: String(params.code ?? ""),
          code_verifier: String(checks?.code_verifier ?? ""),
          client_id: String(provider.clientId ?? ""),
          device_id: String(params.device_id ?? ""),
          redirect_uri: String(provider.callbackUrl ?? ""),
          state: String(params.state ?? ""),
        };

        console.log("[VKID] Token request body:", {
          ...bodyParams,
          code: bodyParams.code ? "[present]" : "[MISSING]",
          code_verifier: bodyParams.code_verifier ? "[present]" : "[MISSING]",
          device_id: bodyParams.device_id ? "[present]" : "[MISSING]",
        });

        const res = await fetch("https://id.vk.com/oauth2/auth", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(bodyParams),
        });

        const tokens = await res.json();
        console.log("[VKID] Token response status:", res.status);
        console.log("[VKID] Token response body:", JSON.stringify(tokens));

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
        console.log("[VKID] user_info status:", res.status);
        console.log("[VKID] user_info body:", JSON.stringify(data));

        if (!res.ok) {
          throw new Error(
            `VK ID user_info failed (${res.status}): ${JSON.stringify(data)}`,
          );
        }
        return data;
      },
    },

    profile(profile) {
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
