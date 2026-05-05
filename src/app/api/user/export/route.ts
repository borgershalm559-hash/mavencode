import { NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/user/export
 *
 * Returns all data we hold on the authenticated user as a JSON file
 * download (application/json + Content-Disposition: attachment).
 *
 * Right of access / portability — 152-FZ Art. 14, GDPR Art. 15 + Art. 20.
 *
 * Excluded from the export by design:
 *   - User.password (bcrypt hash — secret, no value to the user)
 *   - Account.access_token / refresh_token / id_token (OAuth secrets)
 *   - Session.sessionToken (active credential, secret)
 *
 * Everything else the user generated or that the operator stores about
 * them is included verbatim.
 */
export async function GET() {
  const [userId, error] = await getAuthUserId();
  if (error) return error;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      role: true,
      level: true,
      xp: true,
      streak: true,
      location: true,
      skills: true,
      agreedToTermsAt: true,
      agreedTermsVersion: true,
      agreedFromIp: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Linked OAuth accounts — without secrets
  const accounts = await prisma.account.findMany({
    where: { userId },
    select: {
      provider: true,
      providerAccountId: true,
      type: true,
      scope: true,
    },
  });

  // Lesson progress
  const progress = await prisma.progress.findMany({
    where: { userId },
    select: {
      lessonId: true,
      completed: true,
      score: true,
      attempts: true,
      hintsUsed: true,
      createdAt: true,
      lesson: {
        select: {
          title: true,
          order: true,
          course: { select: { title: true } },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  // Achievements unlocked
  const achievements = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      achievements: {
        select: { title: true, description: true, icon: true },
      },
    },
  });

  // Activity log
  const activityLogs = await prisma.activityLog.findMany({
    where: { userId },
    select: { type: true, date: true, count: true },
    orderBy: { date: "asc" },
  });

  const payload = {
    exportedAt: new Date().toISOString(),
    schemaVersion: 1,
    user,
    linkedAccounts: accounts,
    progress: progress.map((p) => ({
      lesson: p.lesson?.title ?? null,
      course: p.lesson?.course?.title ?? null,
      lessonOrder: p.lesson?.order ?? null,
      completed: p.completed,
      score: p.score,
      attempts: p.attempts,
      hintsUsed: p.hintsUsed,
      createdAt: p.createdAt,
    })),
    achievements: achievements?.achievements ?? [],
    activity: activityLogs,
  };

  const json = JSON.stringify(payload, null, 2);
  const filename = `mavencode-export-${user.id}-${new Date().toISOString().slice(0, 10)}.json`;

  return new NextResponse(json, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
