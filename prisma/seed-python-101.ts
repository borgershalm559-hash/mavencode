import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PYTHON_101_LESSONS, PYTHON_101_COURSE } from "./content/python-101";

const pool = new Pool({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  console.log("🌱 Seeding Python 101...");

  // Remove the old «Python Основы» and any prior Python 101 (idempotent re-run)
  const oldCourses = await prisma.course.findMany({
    where: {
      OR: [
        { title: "Python Основы" },
        { title: { startsWith: "Python 101" } },
      ],
    },
  });
  for (const c of oldCourses) {
    await prisma.lesson.deleteMany({ where: { courseId: c.id } });
    await prisma.course.delete({ where: { id: c.id } });
    console.log(`🗑️  Removed old course: ${c.title}`);
  }

  // Create the new Python 101 course
  const course = await prisma.course.create({
    data: {
      title: PYTHON_101_COURSE.title,
      description: PYTHON_101_COURSE.description,
      tags: PYTHON_101_COURSE.tags,
      difficulty: PYTHON_101_COURSE.difficulty,
      image: PYTHON_101_COURSE.image,
    },
  });
  console.log(`✓ Created course: ${course.title}`);

  // Create all 20 lessons in order
  for (const l of PYTHON_101_LESSONS) {
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
        isAvailable: l.isAvailable,
      },
    });
    console.log(`  ✓ Lesson ${l.order}: ${l.title}`);
  }

  console.log(`\n✅ Done — ${PYTHON_101_LESSONS.length} lessons created.`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
