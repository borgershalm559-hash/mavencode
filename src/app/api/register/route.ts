import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { rateLimit, getIp } from "@/lib/rate-limit";
import { LEGAL_VERSION } from "@/lib/legal-version";

export async function POST(req: Request) {
  const ip = getIp(req);
  const rl = await rateLimit("register", ip);
  if (rl instanceof NextResponse) return rl;

  try {
    const body = await req.json();
    const name = body.name?.trim() || "";
    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    const agree = body.agree === true;

    if (
      !email ||
      typeof email !== "string" ||
      !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ||
      !password ||
      typeof password !== "string" ||
      password.length < 12 ||
      password.length > 200
    ) {
      return NextResponse.json(
        { error: "Некорректные данные" },
        { status: 400 }
      );
    }

    if (!agree) {
      return NextResponse.json(
        {
          error:
            "Для регистрации необходимо согласиться с Условиями использования и Политикой обработки персональных данных.",
        },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Пользователь с таким email уже существует" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name: name || null,
        email,
        password: hashedPassword,
        agreedToTermsAt: new Date(),
        agreedTermsVersion: LEGAL_VERSION,
        agreedFromIp: ip ?? null,
      },
    });

    // Auto-create PvpRating for every new user
    await prisma.pvpRating.create({
      data: { userId: user.id },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[REGISTER ERROR]", msg);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
