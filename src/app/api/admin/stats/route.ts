import { NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

const DAYS = 30;

function startOfDayUtc(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function dayKey(d: Date): string {
  return startOfDayUtc(d).toISOString().slice(0, 10);
}

export async function GET() {
  const [, error] = await getAdminUserId();
  if (error) return error;

  const today = startOfDayUtc(new Date());
  const since = new Date(today);
  since.setUTCDate(since.getUTCDate() - (DAYS - 1));

  const prevPeriodStart = new Date(since);
  prevPeriodStart.setUTCDate(prevPeriodStart.getUTCDate() - DAYS);

  const [
    users,
    publishedCourses,
    draftCourses,
    publishedLessons,
    draftLessons,
    news,
    library,
    completedLessons,
    admins,
    usersLast30,
    usersPrev30,
    recentSignups,
    activityLogs,
    topCoursesRaw,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.course.count({ where: { isPublished: true } }),
    prisma.course.count({ where: { isPublished: false } }),
    prisma.lesson.count({ where: { isPublished: true } }),
    prisma.lesson.count({ where: { isPublished: false } }),
    prisma.news.count(),
    prisma.libraryResource.count(),
    prisma.progress.count({ where: { completed: true } }),
    prisma.user.count({ where: { role: "admin" } }),
    prisma.user.count({ where: { createdAt: { gte: since } } }),
    prisma.user.count({ where: { createdAt: { gte: prevPeriodStart, lt: since } } }),
    prisma.user.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
    }),
    prisma.activityLog.findMany({
      where: { date: { gte: since } },
      select: { date: true, count: true },
    }),
    prisma.progress.groupBy({
      by: ["lessonId"],
      where: { completed: true },
      _count: { lessonId: true },
      orderBy: { _count: { lessonId: "desc" } },
      take: 50,
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true, name: true, email: true, image: true, role: true,
        level: true, xp: true, createdAt: true,
      },
    }),
  ]);

  // Build day buckets
  const days: string[] = [];
  for (let i = 0; i < DAYS; i++) {
    const d = new Date(since);
    d.setUTCDate(d.getUTCDate() + i);
    days.push(dayKey(d));
  }

  const signupsByDay = new Map<string, number>(days.map((d) => [d, 0]));
  for (const u of recentSignups) {
    const key = dayKey(u.createdAt);
    signupsByDay.set(key, (signupsByDay.get(key) || 0) + 1);
  }

  const activityByDay = new Map<string, number>(days.map((d) => [d, 0]));
  for (const a of activityLogs) {
    const key = dayKey(a.date);
    activityByDay.set(key, (activityByDay.get(key) || 0) + a.count);
  }

  // Resolve top courses from top lesson completions
  const topLessonIds = topCoursesRaw.map((r) => r.lessonId);
  const lessons = topLessonIds.length
    ? await prisma.lesson.findMany({
        where: { id: { in: topLessonIds } },
        select: { id: true, courseId: true, course: { select: { id: true, title: true } } },
      })
    : [];
  const courseCounts = new Map<string, { id: string; title: string; count: number }>();
  for (const r of topCoursesRaw) {
    const lesson = lessons.find((l) => l.id === r.lessonId);
    if (!lesson) continue;
    const existing = courseCounts.get(lesson.courseId);
    const inc = r._count.lessonId;
    if (existing) existing.count += inc;
    else courseCounts.set(lesson.courseId, { id: lesson.course.id, title: lesson.course.title, count: inc });
  }
  const topCourses = Array.from(courseCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return NextResponse.json({
    counts: {
      users,
      admins,
      publishedCourses,
      draftCourses,
      publishedLessons,
      draftLessons,
      news,
      library,
      completedLessons,
    },
    growth: {
      signupsLast30: usersLast30,
      signupsPrev30: usersPrev30,
      delta: usersPrev30 === 0 ? null : Math.round(((usersLast30 - usersPrev30) / usersPrev30) * 100),
    },
    timeline: {
      days,
      signups: days.map((d) => signupsByDay.get(d) || 0),
      activity: days.map((d) => activityByDay.get(d) || 0),
    },
    topCourses,
    recentUsers,
  });
}
