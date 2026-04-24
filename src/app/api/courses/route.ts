import { NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [userId, error] = await getAuthUserId();
  if (error) return error;

  const courses = await prisma.course.findMany({
    include: {
      _count: { select: { lessons: true } },
      lessons: {
        select: {
          id: true,
          progress: {
            where: { userId, completed: true },
            select: { id: true },
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const result = courses.map((c) => {
    const completedLessons = c.lessons.filter((l) => l.progress.length > 0).length;
    const totalLessons = c._count.lessons;
    return {
      id: c.id,
      title: c.title,
      description: c.description,
      tags: c.tags,
      difficulty: c.difficulty,
      estimatedHours: c.estimatedHours,
      lessonsCount: totalLessons,
      progress: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
    };
  });

  return NextResponse.json(result);
}
