import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const existing = await prisma.news.findFirst({ where: { title: { contains: "HTML 102" } } });
  if (existing) {
    console.log(`ℹ️  News item already exists — skipping (id: ${existing.id})`);
    return;
  }

  await prisma.news.create({
    data: {
      title: "HTML 102 — Формы и семантика: продолжение веб-трека",
      category: "Обновление",
      summary: "26 уроков о семантических разделах, всех видах форм, валидации и мультимедиа. Финал — контактная страница с формой обратной связи.",
      pinned: true,
      publishedAt: new Date(),
      imageUrl: null,
      body: `# HTML 102 — Формы и семантика

Готов **второй курс** веб-трека. Продолжение HTML 101.

## Что внутри

**26 уроков**, разбитых на 7 блоков:

1. **Семантические разделы** (7 уроков) — header, nav, main, article, section, aside, footer, figure
2. **Формы — основы** (6 уроков) — form, input, label, button, типы инпутов
3. **Формы — поля выбора** (5 уроков) — textarea, select, checkbox, radio, fieldset
4. **Валидация** (3 урока) — required, pattern, type-валидация и find-bug
5. **Мультимедиа** (3 урока) — video, audio, iframe
6. **Доступность** (1 урок) — aria-label, иерархия заголовков, alt best practices
7. **Финал** — контактная страница с формой

## Что дальше

После HTML 102 ты готов к **CSS 101** — следующему курсу трека, где научишься стилизовать всё что свёрстал.

Заходи в «Курсы» и продолжай.`,
    },
  });
  console.log("✅ News item created: HTML 102 announcement");
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
