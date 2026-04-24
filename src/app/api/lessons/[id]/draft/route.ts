import { NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const [userId, error] = await getAuthUserId();
  if (error) return error;

  const { id } = await params;
  const { code } = await req.json();

  if (typeof code !== "string") {
    return NextResponse.json({ error: "code is required" }, { status: 400 });
  }

  await prisma.progress.upsert({
    where: { userId_lessonId: { userId, lessonId: id } },
    update: { draft: code },
    create: { userId, lessonId: id, draft: code },
  });

  return NextResponse.json({ ok: true });
}
