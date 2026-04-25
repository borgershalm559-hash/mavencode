import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const existing = await prisma.news.findFirst({ where: { title: { contains: "CSS 101" } } });
  if (existing) {
    console.log(`ℹ️  News item already exists — skipping (id: ${existing.id})`);
    return;
  }

  await prisma.news.create({
    data: {
      title: "CSS 101 — Внешний вид: третий курс веб-трека",
      category: "Обновление",
      summary: "30 уроков о CSS — селекторы, цвета, типографика, юниты, box-model. Финал — стилизация кулинарного блога из HTML 101.",
      pinned: true,
      publishedAt: new Date(),
      imageUrl: null,
      body: `# CSS 101 — Внешний вид

Готов **третий курс веб-трека**. Учим CSS — то что делает сайты красивыми.

## Что внутри

**30 уроков** в восьми блоках:

1. **Подключение** (2) — что такое CSS, как подключить
2. **Селекторы** (8) — тег / класс / id / потомки / дочерние / соседние / атрибутные / псевдоклассы
3. **Каскад и специфичность** (2) — что побеждает когда правил много
4. **Цвета** (3) — named, hex, rgb, hsl, прозрачность
5. **Типографика** (5) — font-family, size, weight, line-height, decoration
6. **Юниты** (2) — px, em, rem, %, vw, vh, ch
7. **Box-model** (5) — margin, padding, border, box-sizing, background
8. **Display** (2) — block, inline, inline-block, none, visibility
9. **Финал** — стилизация рецепта из HTML 101

## Что нового

- В тестах появились проверки **computed-стилей** через \`getComputedStyle\` — задания осмысленные («у заголовка цвет красный», «у абзаца отступ снизу 16px»)
- Цвета нормализуются автоматически: можно писать \`red\`, \`#ff0000\`, \`rgb(255,0,0)\` — все распознаются как одно

## Что дальше

После CSS 101 будет **CSS 102** — Layout и эффекты: Flexbox, Grid, position, transitions, анимации, responsive design. Это последний курс веб-трека.

Заходи в «Курсы» и продолжай.`,
    },
  });
  console.log("✅ News item created: CSS 101 announcement");
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
