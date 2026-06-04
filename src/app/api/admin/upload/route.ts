import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { getAdminUserId } from "@/lib/api-auth";
import { saveImage } from "@/lib/storage";

const MAX_BYTES = 5 * 1024 * 1024;

interface ImageFormat {
  ext: "jpg" | "png" | "webp" | "gif";
  mime: "image/jpeg" | "image/png" | "image/webp" | "image/gif";
}

function detectImageFormat(bytes: Uint8Array): ImageFormat | null {
  if (bytes.length < 12) return null;
  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { ext: "jpg", mime: "image/jpeg" };
  }
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e &&
    bytes[3] === 0x47 && bytes[4] === 0x0d && bytes[5] === 0x0a &&
    bytes[6] === 0x1a && bytes[7] === 0x0a
  ) {
    return { ext: "png", mime: "image/png" };
  }
  // GIF: 47 49 46 38 (GIF8)
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) {
    return { ext: "gif", mime: "image/gif" };
  }
  // WebP: RIFF....WEBP — bytes 0..3 = RIFF, 8..11 = WEBP
  if (
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) {
    return { ext: "webp", mime: "image/webp" };
  }
  return null;
}

export async function POST(req: Request): Promise<NextResponse> {
  const [, error] = await getAdminUserId();
  if (error) return error;

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file field" }, { status: 400 });
  }

  if (file.size === 0) {
    return NextResponse.json({ error: "Empty file" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File exceeds 5 MB" }, { status: 413 });
  }

  const buf = new Uint8Array(await file.arrayBuffer());
  const fmt = detectImageFormat(buf);
  if (!fmt) {
    return NextResponse.json({ error: "Unsupported image format" }, { status: 415 });
  }

  // Content-addressed key: identical bytes resolve to the same object.
  const hash = createHash("sha256").update(buf).digest("hex");
  const now = new Date();
  const yyyy = String(now.getUTCFullYear());
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const key = `uploads/${yyyy}/${mm}/${hash}.${fmt.ext}`;

  const { url } = await saveImage(key, buf, fmt.mime);

  return NextResponse.json({
    url,
    size: file.size,
    contentType: fmt.mime,
  });
}
