import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Idempotent seed for the Achievement table.
 *
 * Safe to re-run: uses upsert by unique `title` field. Existing rows have
 * their description/icon refreshed, missing rows are created.
 *
 * Titles must match the cases handled in src/lib/gamification.ts
 * (`checkAndUnlockAchievements`) — changing one without the other will
 * silently stop awarding the achievement.
 */

const ACHIEVEMENTS = [
  { title: "Starter",   description: "Завершил первый урок",    icon: "rocket" },
  { title: "TypeSafe",  description: "Прошёл курс TypeScript",  icon: "shield" },
  { title: "UI Master", description: "Прошёл курс по CSS",      icon: "palette" },
  { title: "Sprinter",  description: "5 уроков за день",        icon: "zap" },
  { title: "Marathon",  description: "30 дней подряд",          icon: "flame" },
];

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL!,
  }),
});

async function main() {
  for (const a of ACHIEVEMENTS) {
    await prisma.achievement.upsert({
      where: { title: a.title },
      update: { description: a.description, icon: a.icon },
      create: a,
    });
  }
  const count = await prisma.achievement.count();
  console.log(`✓ Achievements upserted. Total in DB: ${count}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
