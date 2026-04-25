import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getAuthUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { rateLimit, getIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const rl = await rateLimit("changePassword", getIp(req));
  if (rl instanceof NextResponse) return rl;

  const [userId, error] = await getAuthUserId();
  if (error) return error;

  const { currentPassword, newPassword } = (await req.json()) as {
    currentPassword: string;
    newPassword: string;
  };

  if (
    !currentPassword ||
    !newPassword ||
    typeof newPassword !== "string" ||
    newPassword.length < 12 ||
    newPassword.length > 200
  ) {
    return NextResponse.json(
      { error: "Новый пароль должен содержать минимум 12 символов" },
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
