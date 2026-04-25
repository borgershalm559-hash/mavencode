/**
 * Centralized environment-variable access with fail-fast validation.
 *
 * Importing this module on the server validates required vars at startup.
 * If a required variable is missing, the app crashes immediately rather
 * than failing later at request time with an opaque error.
 */

type EnvShape = {
  DATABASE_URL: string;
  AUTH_SECRET: string;
  RESEND_API_KEY: string | null;
  GITHUB_ID: string | null;
  GITHUB_SECRET: string | null;
  YANDEX_CLIENT_ID: string | null;
  YANDEX_CLIENT_SECRET: string | null;
  VK_CLIENT_ID: string | null;
  VK_CLIENT_SECRET: string | null;
  NEXTAUTH_URL: string | null;
  NEXT_PUBLIC_APP_URL: string | null;
  NODE_ENV: "development" | "production" | "test";
};

function required(name: string): string {
  const v = process.env[name];
  if (!v || v.length === 0) {
    throw new Error(`[env] Missing required environment variable: ${name}`);
  }
  return v;
}

function optional(name: string): string | null {
  const v = process.env[name];
  return v && v.length > 0 ? v : null;
}

function loadEnv(): EnvShape {
  // Skip strict validation on the client. Next inlines NEXT_PUBLIC_* only.
  if (typeof window !== "undefined") {
    return {
      DATABASE_URL: "",
      AUTH_SECRET: "",
      RESEND_API_KEY: null,
      GITHUB_ID: null,
      GITHUB_SECRET: null,
      YANDEX_CLIENT_ID: null,
      YANDEX_CLIENT_SECRET: null,
      VK_CLIENT_ID: null,
      VK_CLIENT_SECRET: null,
      NEXTAUTH_URL: null,
      NEXT_PUBLIC_APP_URL: optional("NEXT_PUBLIC_APP_URL"),
      NODE_ENV: (process.env.NODE_ENV as EnvShape["NODE_ENV"]) ?? "development",
    };
  }

  // During `next build`, env may not be fully present — skip hard checks.
  // Next sets NEXT_PHASE=phase-production-build during the build step.
  const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";

  return {
    DATABASE_URL: isBuildPhase ? optional("DATABASE_URL") ?? "" : required("DATABASE_URL"),
    AUTH_SECRET: isBuildPhase
      ? optional("AUTH_SECRET") ?? optional("NEXTAUTH_SECRET") ?? ""
      : optional("AUTH_SECRET") ?? required("NEXTAUTH_SECRET"),
    RESEND_API_KEY: optional("RESEND_API_KEY"),
    GITHUB_ID: optional("GITHUB_ID"),
    GITHUB_SECRET: optional("GITHUB_SECRET"),
    YANDEX_CLIENT_ID: optional("YANDEX_CLIENT_ID"),
    YANDEX_CLIENT_SECRET: optional("YANDEX_CLIENT_SECRET"),
    VK_CLIENT_ID: optional("VK_CLIENT_ID"),
    VK_CLIENT_SECRET: optional("VK_CLIENT_SECRET"),
    NEXTAUTH_URL: optional("NEXTAUTH_URL"),
    NEXT_PUBLIC_APP_URL: optional("NEXT_PUBLIC_APP_URL"),
    NODE_ENV: (process.env.NODE_ENV as EnvShape["NODE_ENV"]) ?? "development",
  };
}

export const env: EnvShape = loadEnv();
