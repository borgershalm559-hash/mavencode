import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { rateLimit, getIp } from "@/lib/rate-limit";

const MIN_PASSWORD_LENGTH = 12;

export async function POST(req: Request) {
  const rl = await rateLimit("forgotPassword", getIp(req));
  if (rl instanceof NextResponse) return rl;

  try {
    const { token, password } = await req.json();

    if (!token || typeof token !== "string" || !password || password.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
    }

    // Look up token directly — the token is a 32-byte random hex,
    // so it's the only credential needed. Do NOT trust client-supplied email.
    const record = await prisma.verificationToken.findFirst({
      where: { token },
    });

    if (!record) {
      return NextResponse.json({ error: "Ссылка недействительна или уже использована" }, { status: 400 });
    }

    const normalizedEmail = record.identifier;

    if (record.expires < new Date()) {
      await prisma.verificationToken.delete({
        where: { identifier_token: { identifier: normalizedEmail, token } },
      });
      return NextResponse.json({ error: "Ссылка истекла. Запросите новую" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 12);

    // Update password, mark email verified, and delete token atomically
    await prisma.$transaction([
      prisma.user.update({
        where: { email: normalizedEmail },
        data: { password: hashed, emailVerified: new Date() },
      }),
      prisma.verificationToken.delete({
        where: { identifier_token: { identifier: normalizedEmail, token } },
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[RESET PASSWORD]", e);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
