import { NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import {
  upsertActivityLog,
  calculateAndUpdateStreak,
  checkAndUnlockAchievements,
} from "@/lib/gamification";

const XP_MULTIPLIERS = [1.0, 0.75, 0.5, 0.25];

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const [userId, error] = await getAuthUserId();
  if (error) return error;

  const { id } = await params;
  const { code, hintsUsed = 0 } = await req.json();

  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: {
      course: {
        include: {
          lessons: {
            orderBy: { order: "asc" },
            select: { id: true, order: true },
          },
        },
      },
    },
  });

  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  // Calculate XP
  const multiplier = XP_MULTIPLIERS[Math.min(hintsUsed, 3)];
  const xpEarned = Math.round(lesson.xpReward * multiplier);

  // Check if already completed (don't award XP twice)
  const existingProgress = await prisma.progress.findUnique({
    where: { userId_lessonId: { userId, lessonId: id } },
  });

  const alreadyCompleted = existingProgress?.completed ?? false;

  // Upsert progress
  await prisma.progress.upsert({
    where: { userId_lessonId: { userId, lessonId: id } },
    update: {
      completed: true,
      score: alreadyCompleted ? existingProgress!.score : xpEarned,
      attempts: { increment: 1 },
      draft: code,
      hintsUsed: Math.max(existingProgress?.hintsUsed ?? 0, hintsUsed),
    },
    create: {
      userId,
      lessonId: id,
      completed: true,
      score: xpEarned,
      attempts: 1,
      draft: code,
      hintsUsed,
    },
  });

  // Award XP to user (only if first time completing)
  let unlockedAchievements: { id: string; title: string; description: string; icon: string }[] = [];

  if (!alreadyCompleted) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { xp: { increment: xpEarned } },
    });

    // Recalculate level: level = floor(xp / 500) + 1
    const newLevel = Math.floor(user.xp / 500) + 1;
    if (newLevel !== user.level) {
      await prisma.user.update({
        where: { id: userId },
        data: { level: newLevel },
      });
    }

    // Gamification: activity log, streak, achievements
    await upsertActivityLog(userId, "lesson");
    await calculateAndUpdateStreak(userId);
    unlockedAchievements = await checkAndUnlockAchievements(userId);
  }

  // Find next lesson
  const courseLessons = lesson.course.lessons;
  const currentIndex = courseLessons.findIndex((l) => l.id === id);
  const nextLesson = courseLessons[currentIndex + 1] || null;

  return NextResponse.json({
    passed: true,
    xpEarned: alreadyCompleted ? 0 : xpEarned,
    nextLessonId: nextLesson?.id || null,
    unlockedAchievements,
  });
}
