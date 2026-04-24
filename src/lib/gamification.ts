import { prisma } from "./prisma";

/**
 * Upsert an ActivityLog entry for today (increment count).
 */
export async function upsertActivityLog(userId: string, type: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.activityLog.upsert({
    where: { userId_date_type: { userId, date: today, type } },
    update: { count: { increment: 1 } },
    create: { userId, date: today, type, count: 1 },
  });
}

/**
 * Calculate consecutive days streak from ActivityLog and update User.streak.
 */
export async function calculateAndUpdateStreak(userId: string) {
  const logs = await prisma.activityLog.findMany({
    where: { userId },
    select: { date: true },
    orderBy: { date: "desc" },
    distinct: ["date"],
  });

  if (logs.length === 0) {
    await prisma.user.update({ where: { id: userId }, data: { streak: 0 } });
    return 0;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  const checkDate = new Date(today);

  for (const log of logs) {
    const logDate = new Date(log.date);
    logDate.setHours(0, 0, 0, 0);

    if (logDate.getTime() === checkDate.getTime()) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (logDate.getTime() < checkDate.getTime()) {
      break;
    }
  }

  await prisma.user.update({ where: { id: userId }, data: { streak } });
  return streak;
}

interface UnlockedAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

/**
 * Check achievement conditions and unlock any new ones.
 * Returns list of newly unlocked achievements.
 */
export async function checkAndUnlockAchievements(
  userId: string
): Promise<UnlockedAchievement[]> {
  // Get all achievements and which ones user already has
  const [allAchievements, user] = await Promise.all([
    prisma.achievement.findMany(),
    prisma.user.findUnique({
      where: { id: userId },
      include: {
        achievements: { select: { id: true } },
        progress: { where: { completed: true }, select: { lessonId: true } },
        activityLogs: true,
      },
    }),
  ]);

  if (!user) return [];

  const unlockedIds = new Set(user.achievements.map((a) => a.id));
  const completedLessonIds = new Set(user.progress.map((p) => p.lessonId));
  const newlyUnlocked: UnlockedAchievement[] = [];

  // Today's activity count
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayLog = user.activityLogs.find(
    (l) => new Date(l.date).toDateString() === today.toDateString()
  );
  const todayCount = todayLog?.count ?? 0;

  for (const achievement of allAchievements) {
    if (unlockedIds.has(achievement.id)) continue;

    let shouldUnlock = false;

    switch (achievement.title) {
      case "Starter":
        shouldUnlock = completedLessonIds.size >= 1;
        break;

      case "Sprinter":
        shouldUnlock = todayCount >= 5;
        break;

      case "Marathon":
        shouldUnlock = user.streak >= 30;
        break;

      case "TypeSafe": {
        const tsCourse = await prisma.course.findFirst({
          where: { title: { contains: "TypeScript" } },
          include: { lessons: { select: { id: true } } },
        });
        if (tsCourse && tsCourse.lessons.length > 0) {
          shouldUnlock = tsCourse.lessons.every((l) =>
            completedLessonIds.has(l.id)
          );
        }
        break;
      }

      case "UI Master": {
        const cssCourse = await prisma.course.findFirst({
          where: { title: { contains: "CSS" } },
          include: { lessons: { select: { id: true } } },
        });
        if (cssCourse && cssCourse.lessons.length > 0) {
          shouldUnlock = cssCourse.lessons.every((l) =>
            completedLessonIds.has(l.id)
          );
        }
        break;
      }

      case "Team": {
        const pvpWins = await prisma.pvpRating.findUnique({
          where: { userId },
          select: { wins: true },
        });
        shouldUnlock = (pvpWins?.wins ?? 0) >= 1;
        break;
      }
    }

    if (shouldUnlock) {
      await prisma.user.update({
        where: { id: userId },
        data: { achievements: { connect: { id: achievement.id } } },
      });
      newlyUnlocked.push({
        id: achievement.id,
        title: achievement.title,
        description: achievement.description,
        icon: achievement.icon,
      });
    }
  }

  return newlyUnlocked;
}
