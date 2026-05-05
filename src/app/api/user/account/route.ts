import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

/**
 * DELETE /api/user/account
 *
 * Permanently removes the authenticated user's account and all
 * cascadable related rows (Account, Session, Progress, ActivityLog).
 *
 * Body: { confirmEmail: string } — must match the session user's email
 * exactly. This is the second authentication factor required by the
 * destructive nature of the action.
 *
 * Right of erasure (GDPR Art. 17 / 152-FZ Art. 14).
 */
export async function DELETE(req: NextRequest) {
  const [userId, error] = await getAuthUserId();
  if (error) return error;

  const body = await req.json().catch(() => ({}));
  const confirmEmail =
    typeof body?.confirmEmail === "string" ? body.confirmEmail.trim().toLowerCase() : "";

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.email.toLowerCase() !== confirmEmail) {
    return NextResponse.json(
      { error: "Введённый email не совпадает с email вашего аккаунта" },
      { status: 400 }
    );
  }

  await prisma.user.delete({ where: { id: userId } });

  return NextResponse.json({ ok: true }, { status: 200 });
}
