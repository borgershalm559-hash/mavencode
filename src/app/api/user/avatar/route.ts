import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getAuthUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(req: Request) {
  try {
    const [userId, error] = await getAuthUserId();
    if (error) return error;

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Файл не передан" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Допустимые форматы: JPG, PNG, WebP, GIF" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Файл слишком большой. Максимум 5 МБ" },
        { status: 400 }
      );
    }

    const ext = file.type.split("/")[1].replace("jpeg", "jpg");
    const filename = `${userId}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "avatars");

    await mkdir(uploadDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(path.join(uploadDir, filename), buffer);

    const imageUrl = `/avatars/${filename}?t=${Date.now()}`;

    await prisma.user.update({
      where: { id: userId },
      data: { image: imageUrl },
    });

    return NextResponse.json({ image: imageUrl });
  } catch (e) {
    console.error("[AVATAR UPLOAD]", e);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
