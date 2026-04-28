import { NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

const MAX_XP = 10000;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string; lessonId: string }> }
) {
  const [, error] = await getAdminUserId();
  if (error) return error;

  const { id: courseId, lessonId } = await params;
  const lesson = await prisma.lesson.findFirst({
    where: { id: lessonId, courseId },
  });
  if (!lesson) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(lesson);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; lessonId: string }> }
) {
  const [, error] = await getAdminUserId();
  if (error) return error;

  const { id: courseId, lessonId } = await params;
  const body = await req.json();

  // Verify lesson belongs to course before updating (prevents cross-course IDOR)
  const existing = await prisma.lesson.findFirst({
    where: { id: lessonId, courseId },
    select: { id: true },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const xpReward =
    body.xpReward !== undefined && Number.isFinite(Number(body.xpReward))
      ? Math.max(1, Math.min(MAX_XP, Math.floor(Number(body.xpReward))))
      : undefined;

  const lesson = await prisma.lesson.update({
    where: { id: lessonId },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.content !== undefined && { content: body.content }),
      ...(body.order !== undefined && { order: body.order }),
      ...(body.type !== undefined && { type: body.type }),
      ...(body.language !== undefined && { language: body.language }),
      ...(body.starterCode !== undefined && { starterCode: body.starterCode }),
      ...(body.solution !== undefined && { solution: body.solution }),
      ...(body.tests !== undefined && { tests: body.tests }),
      ...(body.hints !== undefined && { hints: body.hints }),
      ...(body.isPublished !== undefined && { isPublished: !!body.isPublished }),
      ...(xpReward !== undefined && { xpReward }),
    },
  });

  return NextResponse.json(lesson);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; lessonId: string }> }
) {
  const [, error] = await getAdminUserId();
  if (error) return error;

  const { id: courseId, lessonId } = await params;
  const existing = await prisma.lesson.findFirst({
    where: { id: lessonId, courseId },
    select: { id: true },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.lesson.delete({ where: { id: lessonId } });
  return NextResponse.json({ ok: true });
}
