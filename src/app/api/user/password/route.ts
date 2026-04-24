import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getAuthUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const [userId, error] = await getAuthUserId();
  if (error) return error;

  const { currentPassword, newPassword } = (await req.json()) as {
    currentPassword: string;
    newPassword: string;
  };

  if (!currentPassword || !newPassword || newPassword.length < 8) {
    return NextResponse.json(
      { error: "Новый пароль должен содержать минимум 8 символов" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.password) {
    return NextResponse.json(
      { error: "Смена пароля недоступна для OAuth аккаунтов" },
      { status: 400 }
    );
  }

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) {
    return NextResponse.json(
      { error: "Неверный текущий пароль" },
      { status: 403 }
    );
  }

  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: userId }, data: { password: hashed } });

  return NextResponse.json({ ok: true });
}
