import { NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

function safeJsonParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try { return JSON.parse(value); } catch { return fallback; }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const [userId, error] = await getAuthUserId();
  if (error) return error;

  const { id } = await params;

  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: {
      course: {
        include: {
          lessons: {
            orderBy: { order: "asc" },
            select: { id: true, order: true, title: true, progress: { where: { userId }, select: { completed: true } } },
          },
        },
      },
      progress: {
        where: { userId },
        take: 1,
      },
    },
  });

  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  // Check if lesson is available (first lesson always available, others need previous completed)
  const courseLessons = lesson.course.lessons;
  const lessonIndex = courseLessons.findIndex((l) => l.id === id);
  const isAvailable =
    lessonIndex === 0 ||
    (courseLessons[lessonIndex - 1].progress.length > 0 &&
      courseLessons[lessonIndex - 1].progress[0].completed);

  // Build per-lesson availability and status for the progress strip
  const lessonsWithStatus = courseLessons.map((l, i) => ({
    id: l.id,
    order: l.order,
    title: l.title,
    completed: l.progress.length > 0 && l.progress[0].completed,
    isAvailable:
      i === 0 ||
      (courseLessons[i - 1].progress.length > 0 &&
        courseLessons[i - 1].progress[0].completed),
  }));

  const nextLesson =
    lessonIndex < courseLessons.length - 1
      ? { id: courseLessons[lessonIndex + 1].id, title: courseLessons[lessonIndex + 1].title }
      : null;

  const estimatedMinutes = Math.max(10, Math.round(lesson.xpReward * 0.25));

  const userProgress = lesson.progress[0] || null;

  return NextResponse.json({
    lesson: {
      id: lesson.id,
      title: lesson.title,
      content: lesson.content,
      type: lesson.type,
      language: lesson.language,
      starterCode: lesson.starterCode,
      tests: safeJsonParse(lesson.tests, []),
      xpReward: lesson.xpReward,
      order: lesson.order,
      hints: safeJsonParse(lesson.hints, []),
      estimatedMinutes,
    },
    course: {
      id: lesson.course.id,
      title: lesson.course.title,
      totalLessons: courseLessons.length,
      lessons: lessonsWithStatus,
    },
    nextLesson,
    progress: userProgress
      ? {
          completed: userProgress.completed,
          score: userProgress.score,
          attempts: userProgress.attempts,
          draft: userProgress.draft,
          hintsUsed: userProgress.hintsUsed,
        }
      : null,
    isAvailable,
  });
}
