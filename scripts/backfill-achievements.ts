import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * One-off: walk every user, run the same achievement-unlock rules used by
 * src/lib/gamification.ts, and connect any newly earned achievements.
 *
 * This script is intentionally self-contained — duplicating the logic from
 * gamification.ts so it can run without bundling the Next runtime.
 *
 * Run once after seeding the Achievement table for the first time.
 */

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL!,
  }),
});

async function main() {
  const allAchievements = await prisma.achievement.findMany();
  if (allAchievements.length === 0) {
    console.log("Achievement table is empty — run seed-achievements first.");
    return;
  }

  const users = await prisma.user.findMany({
    include: {
      achievements: { select: { id: true } },
      progress: { where: { completed: true }, select: { lessonId: true } },
      activityLogs: true,
    },
  });

  let totalAwarded = 0;

  for (const user of users) {
    const unlockedIds = new Set(user.achievements.map((a) => a.id));
    const completedLessonIds = new Set(user.progress.map((p) => p.lessonId));

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayLog = user.activityLogs.find(
      (l) => new Date(l.date).toDateString() === today.toDateString()
    );
    const todayCount = todayLog?.count ?? 0;

    const toConnect: string[] = [];

    for (const a of allAchievements) {
      if (unlockedIds.has(a.id)) continue;

      let earned = false;

      switch (a.title) {
        case "Starter":
          earned = completedLessonIds.size >= 1;
          break;
        case "Sprinter":
          earned = todayCount >= 5;
          break;
        case "Marathon":
          earned = user.streak >= 30;
          break;
        case "TypeSafe": {
          const ts = await prisma.course.findFirst({
            where: { title: { contains: "TypeScript" } },
            include: { lessons: { select: { id: true } } },
          });
          if (ts && ts.lessons.length > 0) {
            earned = ts.lessons.every((l) => completedLessonIds.has(l.id));
          }
          break;
        }
        case "UI Master": {
          const css = await prisma.course.findFirst({
            where: { title: { contains: "CSS" } },
            include: { lessons: { select: { id: true } } },
          });
          if (css && css.lessons.length > 0) {
            earned = css.lessons.every((l) => completedLessonIds.has(l.id));
          }
          break;
        }
      }

      if (earned) toConnect.push(a.id);
    }

    if (toConnect.length > 0) {
      await prisma.user.update({
        where: { id: user.id },
        data: { achievements: { connect: toConnect.map((id) => ({ id })) } },
      });
      console.log(
        `${user.email}: +${toConnect.length} (${toConnect
          .map((id) => allAchievements.find((a) => a.id === id)?.title)
          .join(", ")})`
      );
      totalAwarded += toConnect.length;
    }
  }

  console.log(`\nDone. Awarded ${totalAwarded} achievements across ${users.length} users.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
