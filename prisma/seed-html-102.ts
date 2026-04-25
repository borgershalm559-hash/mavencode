import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { HTML_102_LESSONS, HTML_102_COURSE } from "./content/html-102";

const pool = new Pool({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  console.log("🌱 Seeding HTML 102...");

  const oldCourses = await prisma.course.findMany({
    where: { title: { startsWith: "HTML 102" } },
  });
  for (const c of oldCourses) {
    await prisma.lesson.deleteMany({ where: { courseId: c.id } });
    await prisma.course.delete({ where: { id: c.id } });
    console.log(`🗑️  Removed old course: ${c.title}`);
  }

  const course = await prisma.course.create({
    data: {
      title: HTML_102_COURSE.title,
      description: HTML_102_COURSE.description,
      tags: HTML_102_COURSE.tags,
      difficulty: HTML_102_COURSE.difficulty,
      image: HTML_102_COURSE.image,
    },
  });
  console.log(`✓ Created course: ${course.title}`);

  for (const l of HTML_102_LESSONS) {
    await prisma.lesson.create({
      data: {
        courseId: course.id,
        title: l.title,
        content: l.content,
        order: l.order,
        type: l.type,
        language: l.language,
        xpReward: l.xpReward,
        starterCode: l.starterCode,
        solution: l.solution,
        tests: JSON.stringify(l.tests),
        hints: JSON.stringify(l.hints),
      },
    });
    console.log(`  ✓ Lesson ${l.order}: ${l.title}`);
  }

  console.log(`\n✅ Done — ${HTML_102_LESSONS.length} lessons created.`);
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
