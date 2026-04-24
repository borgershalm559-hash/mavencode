import { NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const [, error] = await getAdminUserId();
  if (error) return error;

  const { id } = await params;
  const lessons = await prisma.lesson.findMany({
    where: { courseId: id },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(lessons);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const [, error] = await getAdminUserId();
  if (error) return error;

  const { id } = await params;
  const body = await req.json();

  // Auto-set order to last + 1
  const lastLesson = await prisma.lesson.findFirst({
    where: { courseId: id },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const lesson = await prisma.lesson.create({
    data: {
      courseId: id,
      title: body.title,
      content: body.content || "",
      order: body.order ?? (lastLesson ? lastLesson.order + 1 : 1),
      type: body.type || "code",
      language: body.language || "javascript",
      starterCode: body.starterCode || null,
      solution: body.solution || null,
      tests: body.tests || null,
      hints: body.hints || null,
      xpReward: body.xpReward || 100,
    },
  });

  return NextResponse.json(lesson, { status: 201 });
}
