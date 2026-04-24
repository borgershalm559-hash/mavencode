import { NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const [userId, error] = await getAuthUserId();
  if (error) return error;

  const { id: courseId } = await params;
  const { lessonId } = await req.json();

  if (!lessonId) {
    return NextResponse.json({ error: "lessonId required" }, { status: 400 });
  }

  // Verify the lesson belongs to the course
  const lesson = await prisma.lesson.findFirst({
    where: { id: lessonId, courseId },
  });

  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found in this course" }, { status: 404 });
  }

  await prisma.progress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: { completed: true },
    create: { userId, lessonId, completed: true },
  });

  return NextResponse.json({ ok: true });
}
