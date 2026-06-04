import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { readFileSync } from "node:fs";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

/**
 * Optional TLS CA for the database connection.
 *
 * Managed providers that use a private CA (e.g. Timeweb Postgres) need their
 * root certificate to pass full verification. Set DATABASE_CA_CERT_PATH to the
 * PEM file (committed at certs/timeweb-ca.crt) — or DATABASE_CA_CERT with the
 * inline PEM — and the pool verifies the server certificate against it.
 *
 * When neither is set, the driver default applies, so providers with publicly
 * trusted certs (e.g. Neon via ?sslmode=require) keep working unchanged.
 */
function databaseSsl() {
  const inline = process.env.DATABASE_CA_CERT;
  if (inline) return { ca: inline, rejectUnauthorized: true as const };
  const caPath = process.env.DATABASE_CA_CERT_PATH;
  if (caPath) return { ca: readFileSync(caPath).toString(), rejectUnauthorized: true as const };
  return undefined;
}

function createPrismaClient() {
  const ssl = databaseSsl();
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
    ...(ssl ? { ssl } : {}),
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
