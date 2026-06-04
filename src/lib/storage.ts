/**
 * Image storage abstraction.
 *
 * Persistent disk (local dev / VPS): images are written under `public/`.
 * Ephemeral PaaS filesystem (Timeweb App Platform, Vercel): set the S3_* env
 * vars and uploads go to S3-compatible object storage (Timeweb S3) instead,
 * where they survive redeploys.
 *
 * With no S3 config the code falls back to local-disk writes, so local
 * development keeps working unchanged.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const S3_BUCKET = process.env.S3_BUCKET;
const S3_ENDPOINT = process.env.S3_ENDPOINT; // e.g. https://s3.twcstorage.ru
const S3_REGION = process.env.S3_REGION || "ru-1";
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY;
const S3_SECRET_KEY = process.env.S3_SECRET_KEY;
const S3_PUBLIC_URL = process.env.S3_PUBLIC_URL; // e.g. https://<bucket>.s3.twcstorage.ru

export const s3Enabled = Boolean(
  S3_BUCKET && S3_ENDPOINT && S3_ACCESS_KEY && S3_SECRET_KEY && S3_PUBLIC_URL,
);

/**
 * Persist `bytes` at logical `key` (e.g. "uploads/2026/06/<hash>.png" or
 * "avatars/<userId>.jpg") and return a public URL to read it back.
 *
 * S3 PutObject overwrites by key, and the local branch overwrites too, so
 * callers using content-addressed keys (sha256) stay idempotent and callers
 * using stable keys (avatars) always get the latest bytes.
 */
export async function saveImage(
  key: string,
  bytes: Uint8Array,
  contentType: string,
): Promise<{ url: string }> {
  if (s3Enabled) {
    const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
    const client = new S3Client({
      region: S3_REGION,
      endpoint: S3_ENDPOINT,
      forcePathStyle: true,
      credentials: {
        accessKeyId: S3_ACCESS_KEY as string,
        secretAccessKey: S3_SECRET_KEY as string,
      },
    });
    await client.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        Body: bytes,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );
    return { url: `${(S3_PUBLIC_URL as string).replace(/\/$/, "")}/${key}` };
  }

  // Local-disk fallback (persistent disk / dev).
  const fullPath = path.join(process.cwd(), "public", key);
  await mkdir(path.dirname(fullPath), { recursive: true });
  await writeFile(fullPath, bytes);
  return { url: `/${key}` };
}
