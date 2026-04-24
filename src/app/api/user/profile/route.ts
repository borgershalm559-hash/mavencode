import { NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export async function PATCH(req: Request) {
  try {
    const [userId, error] = await getAuthUserId();
    if (error) return error;

    const body = await req.json();
    const { name, image } = body as {
      name?: string;
      image?: string;
    };

    const data: Record<string, unknown> = {};
    if (typeof name === "string") data.name = name.trim().slice(0, 100);

    // Image: allow clearing (empty string → null) or valid URL only
    if (typeof image === "string") {
      if (image.trim() === "") {
        data.image = null;
      } else if (isValidUrl(image)) {
        data.image = image.slice(0, 500);
      } else {
        return NextResponse.json({ error: "Некорректный URL изображения" }, { status: 400 });
      }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Нечего обновлять" }, { status: 400 });
    }

    const user = await prisma.user.update({ where: { id: userId }, data });

    return NextResponse.json({
      name: user.name,
      image: user.image,
    });
  } catch (e) {
    console.error("[PROFILE PATCH]", e);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function GET() {
  try {
  const [userId, error] = await getAuthUserId();
  if (error) return error;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      achievements: true,
      progress: { include: { lesson: { include: { course: true } } } },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // All achievements (for locked/unlocked display)
  const allAchievements = await prisma.achievement.findMany();
  const unlockedIds = new Set(user.achievements.map((a) => a.id));

  // Calculate course progress
  const courseMap = new Map<string, { title: string; total: number; completed: number }>();
  for (const p of user.progress) {
    const cId = p.lesson.courseId;
    if (!courseMap.has(cId)) {
      courseMap.set(cId, { title: p.lesson.course.title, total: 0, completed: 0 });
    }
    const entry = courseMap.get(cId)!;
    entry.total++;
    if (p.completed) entry.completed++;
  }

  const enrolledCourseIds = [...courseMap.keys()];
  const enrolledCourses = enrolledCourseIds.length > 0
    ? await prisma.course.findMany({
        where: { id: { in: enrolledCourseIds } },
        select: { id: true, tags: true, _count: { select: { lessons: true } } },
      })
    : [];

  for (const c of enrolledCourses) {
    const entry = courseMap.get(c.id);
    if (entry) entry.total = c._count.lessons;
  }

  const currentCourses = [...courseMap.entries()].map(([, v]) => ({
    title: v.title,
    progress: v.total > 0 ? Math.round((v.completed / v.total) * 100) : 0,
    completed: v.completed,
    total: v.total,
  }));

  const totalCompleted = user.progress.filter((p) => p.completed).length;
  const totalLessons = user.progress.length;

  // Activity heatmap — last 365 days
  const since = new Date();
  since.setDate(since.getDate() - 365);
  const logs = await prisma.activityLog.findMany({
    where: { userId, date: { gte: since } },
    orderBy: { date: "asc" },
  });
  const activity: Record<string, number> = {};
  for (const log of logs) {
    const key = log.date.toISOString().split("T")[0];
    activity[key] = (activity[key] || 0) + log.count;
  }

  // Skill radar + auto skills — derived from enrolled course tags
  const skillMap = new Map<string, { total: number; sum: number }>();
  for (const course of enrolledCourses) {
    const entry = courseMap.get(course.id);
    const progress = entry ? (entry.total > 0 ? Math.round((entry.completed / entry.total) * 100) : 0) : 0;
    for (const tag of course.tags) {
      if (!skillMap.has(tag)) skillMap.set(tag, { total: 0, sum: 0 });
      const s = skillMap.get(tag)!;
      s.total++;
      s.sum += progress;
    }
  }
  const skillRadar = [...skillMap.entries()]
    .map(([skill, { total, sum }]) => ({ skill, value: Math.round(sum / total) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  // Auto skills: unique tags from all enrolled courses, sorted by frequency
  const tagFreq = new Map<string, number>();
  for (const course of enrolledCourses) {
    for (const tag of course.tags) {
      tagFreq.set(tag, (tagFreq.get(tag) ?? 0) + 1);
    }
  }
  const autoSkills = [...tagFreq.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag)
    .slice(0, 12);

  // XP for next level: consistent with submit route (level = floor(xp/500) + 1)
  const xpForNextLevel = user.level * 500;

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    level: user.level,
    xp: user.xp,
    xpForNextLevel,
    streak: user.streak,
    createdAt: user.createdAt,
    skills: autoSkills,
    coursesCount: courseMap.size,
    achievementsCount: user.achievements.length,
    overallProgress: totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0,
    currentCourses,
    achievements: allAchievements.map((a) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      icon: a.icon,
      unlocked: unlockedIds.has(a.id),
    })),
    activity,
    skillRadar,
  });
  } catch (e) {
    console.error("[PROFILE GET]", e);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
