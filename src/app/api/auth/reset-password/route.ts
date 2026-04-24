import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { token, email, password } = await req.json();

    if (!token || !email || !password || password.length < 8) {
      return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find and validate token
    const record = await prisma.verificationToken.findFirst({
      where: { identifier: normalizedEmail, token },
    });

    if (!record) {
      return NextResponse.json({ error: "Ссылка недействительна или уже использована" }, { status: 400 });
    }

    if (record.expires < new Date()) {
      await prisma.verificationToken.delete({ where: { identifier_token: { identifier: normalizedEmail, token } } });
      return NextResponse.json({ error: "Ссылка истекла. Запросите новую" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 12);

    // Update password and delete token atomically
    await prisma.$transaction([
      prisma.user.update({ where: { email: normalizedEmail }, data: { password: hashed } }),
      prisma.verificationToken.delete({ where: { identifier_token: { identifier: normalizedEmail, token } } }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[RESET PASSWORD]", e);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
