# HTML 101 — Скелет страницы (course design)

**Date:** 2026-04-25
**Surface:** new beginner-level course on the platform — `Курс «HTML 101 — Скелет страницы»`
**Status:** spec ready, awaiting plan

## 0. Goal

Ship a complete beginner-friendly HTML course as the second authored course on the platform (after Python 101). Audience is "user who has never coded before". Every lesson must be heavily explained with metaphors from real life and a guided code/quiz task. Auto-graded so XP is earned honestly.

## 1. Roadmap context

This spec covers **HTML 101 only**. The full beginner web track is decomposed into four sequential courses, each in its own future spec:

1. **HTML 101 — Скелет страницы** ← this spec, ~30 lessons
2. **HTML 102 — Формы и семантика** — ~25 lessons (next session)
3. **CSS 101 — Внешний вид** — ~30 lessons (uses HTML 101 final project as starter)
4. **CSS 102 — Layout и эффекты** — ~30 lessons

## 2. Architecture — content layout

Mirrors `prisma/content/python-101/`:

```
prisma/content/html-101/
├── types.ts                    # local re-exports for backwards compat
├── index.ts                    # array of 30 lessons + COURSE meta
└── lessons/
    ├── 01-what-is-web.ts       # quiz
    ├── 02-how-browser-reads.ts # quiz
    ├── 03-tag-and-attribute.ts # quiz
    ├── 04-h1.ts                # first code lesson
    ...
    └── 30-final-project.ts

prisma/seed-html-101.ts         # idempotent course seeder
prisma/seed-html-101-news.ts    # release announcement news entry
```

## 3. Type system unification

Currently `prisma/content/python-101/types.ts` hard-codes `language: "python"`. We need `language: "python" | "html"` shared between both courses.

**New shared file:** `prisma/content/types.ts`

```ts
export type LessonType = "code" | "fill-blanks" | "fix-bug" | "quiz";
export type LessonLanguage = "python" | "html";

// Python (and any text-IO language) keeps the existing assertion shape.
export interface IoTestCase {
  input: string;
  expected: string;
  description: string;
}

// HTML uses DOM-based assertions.
export type HtmlAssertion =
  | { kind: "exists";       selector: string;                     description: string }
  | { kind: "count";        selector: string; n: number;          description: string }
  | { kind: "text";         selector: string; equals: string;     description: string }
  | { kind: "textContains"; selector: string; contains: string;   description: string }
  | { kind: "attr";         selector: string; name: string; equals: string; description: string }
  | { kind: "attrExists";   selector: string; name: string;       description: string };

// Quizzes piggy-back on IoTestCase using existing convention:
//  input = question text
//  description = options joined by " | "
//  expected = correct option

export interface LessonContent {
  title: string;
  order: number;
  type: LessonType;
  language: LessonLanguage;
  xpReward: number;
  content: string;          // markdown body
  starterCode: string;
  solution: string;
  tests: IoTestCase[] | HtmlAssertion[];
  hints: string[];          // exactly 3 entries (soft → concrete → full)
  isAvailable: boolean;
}
```

`prisma/content/python-101/types.ts` becomes a thin re-export of these names — no changes needed in existing python-101 lesson files.

## 4. Test format

### 4.1 Quiz lessons (L01, L02, L03, L24)

Reuse the existing `tests: IoTestCase[]` format:
- `input` = question text
- `description` = options joined by `" | "`
- `expected` = the correct option (must match one of the options exactly)

3-5 questions per quiz lesson. Already wired through `quiz-task.tsx`.

### 4.2 Code lessons (L04-L23, L25-L30)

`tests: HtmlAssertion[]`. 1-3 assertions per lesson, each with a human-readable Russian `description`.

**Examples:**

| Lesson | Assertion |
|--------|-----------|
| L04 — `<h1>` | `{ kind: "exists", selector: "h1", description: "Тег `<h1>` присутствует на странице" }` + `{ kind: "text", selector: "h1", equals: "Привет", description: "Заголовок `<h1>` содержит слово «Привет»" }` |
| L17 — `<ul>` | `{ kind: "count", selector: "ul li", n: 3, description: "В списке ровно 3 элемента" }` |
| L11 — `<a>` | `{ kind: "attr", selector: "a", name: "href", equals: "https://example.com", description: "Ссылка ведёт на example.com" }` |

### 4.3 Fix-bug lessons (L10, L23)

`type: "fix-bug"` with broken `starterCode` and `tests: HtmlAssertion[]` that pass once the bug is fixed.

## 5. Runner — `HtmlRunner`

New file: `src/components/lesson/runners/html-runner.ts`. Implements the same `CodeRunner` interface as `PythonRunner` and `JsRunner`.

**Algorithm:**
1. Create a hidden `<iframe sandbox="allow-same-origin">` (no `allow-scripts`, no `allow-top-navigation`, no `allow-forms`).
2. Set `iframe.srcdoc = userCode`.
3. Wait for `load` event (or 3s timeout, then fail with "Не удалось отрендерить страницу").
4. Read `iframe.contentDocument`.
5. For each `HtmlAssertion`, run the matching predicate:
   - `exists`       → `!!doc.querySelector(s.selector)`
   - `count`        → `doc.querySelectorAll(s.selector).length === s.n`
   - `text`         → `doc.querySelector(s.selector)?.textContent?.trim() === s.equals`
   - `textContains` → `doc.querySelector(s.selector)?.textContent?.includes(s.contains)`
   - `attr`         → `doc.querySelector(s.selector)?.getAttribute(s.name) === s.equals`
   - `attrExists`   → `doc.querySelector(s.selector)?.hasAttribute(s.name)`
6. Build `RunResult.tests = [{description, passed, expected, actual}]` per assertion.
7. Remove iframe.

`output` is empty string for HTML (no stdout). `error` set if iframe load fails.

`destroy()` removes the iframe if still mounted.

The lesson page already routes by `language`:

```ts
if (language === "html") {
  const { HtmlRunner } = await import("@/components/lesson/runners/html-runner");
  runner = new HtmlRunner();
}
```

## 6. Live Preview panel

When `lesson.language === "html"`, the right column of the lesson page changes from:

```
[ Editor (1fr) | Console (auto, max 240px) ]
```

to:

```
[ Editor (1fr) | Preview (300px) | Console (auto, max 240px) ]
```

**Preview implementation:**
- Separate `<iframe sandbox="allow-same-origin">` (different element from the runner iframe).
- Updates on code change with 300ms debounce: `iframe.srcdoc = code`.
- Header label `§ ПРЕДПРОСМОТР` (monospace 11px, tracking 0.3em, white/45 — matches the V1 Dossier theory panel header).
- Border `2px solid rgba(255,255,255,0.07)` on top, light card background `#0F1011`.

**Why two iframes:** preview gives instant visual feedback for learning. Runner runs only on "Запустить" — that's the moment that earns XP. Decoupling avoids the runner re-firing on every keystroke.

**Mobile fallback:** under 1024px the preview collapses into a tab next to "Тесты" and "Вывод" in the existing console area.

## 7. Lesson body shape (for "разжёвано" tone)

Every code lesson uses 5 markdown sections:

1. **«Зачем это нужно»** — 2-3 paragraphs, real-life metaphor (book chapter = `<h1>`, shop receipt = `<ul>`, etc.)
2. **«Как это пишется»** — syntax with a labelled example highlighting opening tag / content / closing tag.
3. **«Попробуй сам»** — a short snippet to read before writing.
4. **«Частые ошибки»** — 2-3 typical pitfalls (forgot `</h1>`, used uppercase, mismatched closers).
5. **«Задание»** — plain-language statement of what to do.

`starterCode` includes Russian comments hinting at what to write.

`hints` always has exactly 3 entries:
- Soft (no answer): general direction
- Concrete (partial answer): name the tag/attribute
- Full (complete solution)

XP scheme:
- Quiz lesson: **50 XP** (lessons L01, L02, L03, L24 — 4 total)
- Code lesson: **70 XP** (23 lessons: everything else minus quizzes, fix-bugs, final)
- Fix-bug lesson: **80 XP** (lessons L10, L23 — 2 total)
- Final project: **200 XP** (L30)

Total course XP: 4×50 + 23×70 + 2×80 + 200 = 200 + 1610 + 160 + 200 = **2170 XP**.

## 8. Lesson plan (30 lessons)

| # | Type   | Title | Outcome |
|---|--------|-------|---------|
| 01 | quiz   | Что такое веб-страница | Различает HTML/CSS/JS-роли |
| 02 | quiz   | Как браузер читает HTML | Понимает пары тегов и вложенность |
| 03 | quiz   | Тег и атрибут | Понимает формат `name="value"` |
| 04 | code   | Первый заголовок `<h1>` | Пишет `<h1>Привет</h1>` |
| 05 | code   | Иерархия заголовков `<h1>`–`<h6>` | Расставляет уровни заголовков |
| 06 | code   | Параграф `<p>` | Несколько параграфов |
| 07 | code   | Перенос строки `<br>` и `<hr>` | Самозакрывающиеся теги |
| 08 | code   | Жирный/курсив `<strong>`, `<em>` | Подсветка слов в тексте |
| 09 | code   | Цитаты `<blockquote>` | Длинная цитата с источником |
| 10 | fix-bug| Найди ошибку в разметке | Чинит незакрытые/неверные теги |
| 11 | code   | Ссылки `<a href>` | Делает внешнюю ссылку |
| 12 | code   | `target="_blank"` и `rel` | Открывает в новой вкладке |
| 13 | code   | Якорные ссылки `#section` | Навигация внутри страницы |
| 14 | code   | Изображение `<img>` | `src`, `alt`, размер |
| 15 | code   | Форматы изображений | jpg/png/svg/webp — когда какой |
| 16 | code   | Адаптивные `<picture>` и `srcset` | Разные изображения для разных экранов |
| 17 | code   | Маркированный список `<ul>` | Список из 3 пунктов |
| 18 | code   | Нумерованный список `<ol>` | Шаги рецепта |
| 19 | code   | Вложенные списки | Многоуровневое меню |
| 20 | code   | Таблица: `<table>`, `<tr>`, `<td>` | Расписание из 3×3 |
| 21 | code   | `<thead>`, `<tbody>`, `<th>` | Заголовки колонок |
| 22 | code   | `colspan` и `rowspan` | Объединение ячеек |
| 23 | fix-bug| Сломанная таблица | Чинит структуру таблицы |
| 24 | quiz   | Структура HTML-документа | doctype/html/head/body |
| 25 | code   | `<head>`: `<title>`, `<meta charset>`, `<meta viewport>` | Полная шапка документа |
| 26 | code   | `lang` и `meta description` | SEO-базис |
| 27 | code   | `<code>`, `<pre>`, `<kbd>` | Технический текст |
| 28 | code   | `<details>`, `<summary>` | Раскрывающийся блок FAQ |
| 29 | code   | `<time>`, `<abbr>`, `<mark>` | Семантическое форматирование |
| 30 | code   | **Финал: Кулинарный блог** | Страница рецепта со всем |

### Final project (L30) requirements

The user creates one HTML page about a dish. Assertions check:
- `<h1>` present with non-empty text
- exactly one `<img>` with non-empty `alt`
- `<ul>` (ingredients) with at least 3 `<li>`
- `<ol>` (steps) with at least 3 `<li>`
- `<table>` (KBJU) with `<thead>` and at least one `<tbody> <tr>`
- `<blockquote>` present (chef's quote)
- `<a>` with `href` (source link)
- `<head>` includes `<title>` and `<meta charset>`

Single starter file: empty `<!doctype html>...<body></body>` skeleton with comments listing every requirement.

## 9. Course meta

```ts
export const HTML_101_COURSE = {
  title: "HTML 101 — Скелет страницы",
  description:
    "Курс для тех, кто никогда не делал сайтов. За 30 уроков ты пройдёшь от «что такое тег» до полностью свёрстанной страницы рецепта. После курса умеешь использовать все базовые HTML-элементы: текст, ссылки, картинки, списки и таблицы.",
  tags: ["HTML", "Веб", "С нуля"],
  difficulty: "beginner",
  image: null,
};
```

`tags` includes `"Веб"` so the course shows up in the hypothetical Frontend track filter (`courses-section.tsx` filters tracks by overlap with `tags`). `"С нуля"` keeps it grouped with Python 101 in beginner search.

## 10. Seeding

`prisma/seed-html-101.ts` mirrors `seed-python-101.ts`:
- Idempotent upsert by course title (or by a slug field if one exists).
- For each lesson: upsert by `(courseId, order)`.
- Serialize `tests` and `hints` as JSON via existing helper.
- Run via `npm run seed:html-101` script added to `package.json`.

`prisma/seed-html-101-news.ts` upserts a single news entry announcing the course (title `Запускаем курс HTML 101`, category `Обновление`, summary, body in markdown).

Both seeders are idempotent — re-running doesn't duplicate.

## 11. Files map

| File | Action |
|------|--------|
| `prisma/content/types.ts` | NEW — shared types |
| `prisma/content/python-101/types.ts` | EDIT — re-export from `../types` |
| `prisma/content/html-101/types.ts` | NEW — re-export from `../types` |
| `prisma/content/html-101/index.ts` | NEW — 30-lesson array + COURSE |
| `prisma/content/html-101/lessons/01..30-*.ts` | NEW — 30 lesson files |
| `prisma/seed-html-101.ts` | NEW |
| `prisma/seed-html-101-news.ts` | NEW |
| `package.json` | EDIT — add `seed:html-101` script |
| `src/components/lesson/runners/html-runner.ts` | NEW |
| `src/components/lesson/runners/types.ts` | possibly EDIT if `RunResult` needs adjustments (it shouldn't) |
| `src/components/lesson/preview-panel.tsx` | NEW — debounced iframe preview |
| `src/components/lesson/code-editor.tsx` | EDIT — Monaco language `html → "html"` mapping |
| `src/app/lesson/[id]/page.tsx` | EDIT — when language === "html", route to HtmlRunner and render PreviewPanel |

## 12. Out of scope (explicit YAGNI)

- CSS-related anything — stays for CSS 101 spec.
- Visual snapshot diffing for final project — keep DOM assertions.
- Multi-file projects — single-file HTML only.
- Code formatting/prettier integration — Monaco default behavior.
- Auto-saving preview state on reload — preview is purely derived from code.

## 13. Testing strategy

The repo currently has no test runner configured. We rely on manual smoke testing:

- After seeding: open each of the 30 lessons in dev, paste the solution, click Запустить, confirm green tests + XP awarded.
- Refresh and re-enter at least 3 random lessons; confirm progress persistence and draft autosave still work.
- Final project (L30): confirm assertion failures show actionable messages when intentionally broken (e.g. remove `<table>` and observe the failing assertion message).
- Cross-browser: open final project lesson in Chrome and Firefox; preview iframe must render identically.

If a test runner is added later, the highest-value coverage to add is `html-runner.ts` against fixed HTML strings (one test per `HtmlAssertion.kind`).
