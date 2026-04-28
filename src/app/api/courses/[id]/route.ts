import { NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const [userId, error] = await getAuthUserId();
  if (error) return error;

  const { id } = await params;

  const course = await prisma.course.findFirst({
    where: { id, isPublished: true },
    include: {
      lessons: {
        where: { isPublished: true },
        orderBy: { order: "asc" },
        include: {
          progress: {
            where: { userId },
            select: { completed: true },
          },
        },
      },
    },
  });

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const totalLessons = course.lessons.length;
  const completedLessons = course.lessons.filter(
    (l) => l.progress.length > 0 && l.progress[0].completed
  ).length;

  return NextResponse.json({
    id: course.id,
    title: course.title,
    description: course.description,
    tags: course.tags,
    difficulty: course.difficulty,
    progress: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
    lessons: course.lessons.map((l, i) => {
      const completed = l.progress.length > 0 && l.progress[0].completed;
      const prevCompleted = i === 0 || (course.lessons[i - 1].progress.length > 0 && course.lessons[i - 1].progress[0].completed);
      return {
        id: l.id,
        title: l.title,
        order: l.order,
        completed,
        type: l.type,
        language: l.language,
        isAvailable: prevCompleted,
      };
    }),
  });
}
