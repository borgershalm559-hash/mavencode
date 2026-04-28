import { NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const [, error] = await getAdminUserId();
  if (error) return error;

  const { id } = await params;

  await prisma.$transaction([
    prisma.progress.deleteMany({ where: { userId: id } }),
    prisma.user.update({
      where: { id },
      data: { xp: 0, level: 1, streak: 0 },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
