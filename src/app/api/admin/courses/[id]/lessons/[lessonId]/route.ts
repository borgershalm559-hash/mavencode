import { NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string; lessonId: string }> }
) {
  const [, error] = await getAdminUserId();
  if (error) return error;

  const { lessonId } = await params;
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(lesson);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; lessonId: string }> }
) {
  const [, error] = await getAdminUserId();
  if (error) return error;

  const { lessonId } = await params;
  const body = await req.json();
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
      ...(body.xpReward !== undefined && { xpReward: body.xpReward }),
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

  const { lessonId } = await params;
  await prisma.lesson.delete({ where: { id: lessonId } });
  return NextResponse.json({ ok: true });
}
