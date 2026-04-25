import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  {
    // CSP — kept relatively permissive to support Next inline scripts,
    // Pyodide WASM, GitHub/Yandex/VK avatars, and Resend/Vercel analytics.
    // Tighten further once a nonce-based CSP is wired up across the app.
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
      // Monaco editor loads its main CSS from jsdelivr at runtime
      "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
      // *.userapi.com already covers sun9-*.userapi.com; CSP wildcards
      // must be full-subdomain (`*.host`), partial (`sun9-*`) is invalid.
      "img-src 'self' data: blob: https://avatars.githubusercontent.com https://avatars.yandex.net https://*.userapi.com https://*.vk.com",
      "font-src 'self' data:",
      "connect-src 'self' https://cdn.jsdelivr.net https://id.vk.com https://*.userapi.com",
      "worker-src 'self' blob:",
      "frame-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "avatars.yandex.net" },
      { protocol: "https", hostname: "*.userapi.com" },
      { protocol: "https", hostname: "*.vk.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
