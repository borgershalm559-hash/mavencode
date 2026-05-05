# Landing Page Redesign — Design Spec

**Date:** 2026-05-05
**Status:** Approved (pending implementation plan)
**File touched:** `src/app/page.tsx` + new `src/components/landing/`

---

## 1. Problem

The current landing at `src/app/page.tsx` (397 lines) shares the project's color palette and font but lacks the "dossier/terminal" personality that defines `/login` and the dashboard. It reads as a generic SaaS landing: hero → 3 features → 3 steps → languages chips → CTA. Stacked sections of similar shape, no real product visible, no copy with edge.

User feedback (B + C + D from clarifying round):
- **B** — style is too plain, missing terminal motifs
- **C** — content doesn't grab, generic stat blocks and feature cards
- **D** — composition is monotonous vertical stack

## 2. Goal

Redesign the landing to be a **dossier-style scroll with real product elements interleaved**. Keep conversion focus (register CTA), but show the product instead of describing it. Each section should have a different visual shape so the page never feels like a stack of identical blocks.

Non-goals:
- No dark/light toggle, no i18n, no A/B testing infra
- No tests for the landing (static marketing page; `next build` + manual smoke is sufficient)

## 3. Section Composition

| # | Section | Shape | Data | Notes |
|---|---|---|---|---|
| 1 | Nav | Top bar | — | Unchanged from current |
| 2 | Hero "dossier" | 2-column (lg+) | `/api/public/stats` | Left: manifesto card. Right: live mini-lesson runner. |
| 3 | Real courses | Horizontal strip | `/api/public/courses` (NEW) | 4 cards from real DB courses |
| 4 | How it works | Asymmetric 3-grid | — | "STEP_XX.md" cards with offset shadows of varying sizes |
| 5 | Stats SQL | Full-width thin bar | `/api/public/stats` | Typewriter SQL queries with mock results |
| 6 | Languages | Compact chips | hardcoded | 12 chips, 1-2 rows |
| 7 | Final CTA | Centered card | — | Heavy `8px 8px 0 0` shadow, `register.sh` chrome |
| 8 | Footer | — | — | Unchanged |

### 3.1 Hero (section 2)

**Left panel** (black bg, green border `#10B981/60`, dossier card):
- Slash-label `// маяк / 2026`
- Headline `Учись.\nПрактикуй.\n**Доминируй.**` (last word green)
- 2-3 mono description lines
- 3 mono `// без` tags
- "Начать" button → `/login?tab=register`
- Bottom: 3 stats from `/api/public/stats` (`students`, `solvedToday`, `coursesCount`) formatted as `> students  1,247`
- Tilted "без воды" badge (rotate -6deg, hard shadow), copying the badge from `/login`

**Right panel** (`#0F1011` bg, hard green shadow `6px 6px 0 0 #10B981`):
- Terminal chrome with traffic-light circles + filename `lesson_01.py`
- Tabs: `Python` / `JavaScript` / `HTML` switching the code snippet
- **Read-only** styled code block (syntax-highlighted `<pre>`, no editing on landing — full editor lives behind /login)
- Green "Запустить" button
- After click: shows actual execution result. Reuses existing runners from [src/components/lesson/runners/](src/components/lesson/runners/) — `python-runner.ts` (Pyodide), `js-runner.ts` (sandboxed iframe), `html-runner.ts` (srcdoc iframe)
- Result line: `✓ тесты пройдены  +50 XP` styled as a dossier badge

Pyodide is loaded **lazy on first click** of the Python tab's "Запустить". JS and HTML tabs run instantly via the existing iframe sandbox runners.

### 3.2 Real courses strip (section 3)

- Section label `// курсы / опубликованные`
- Horizontal scrollable strip with 4 cards, snap-x on mobile
- Each card pulled from new `/api/public/courses` (top 4 published courses)
- Card content: `iconText` (or generic icon if null), title, lesson count, difficulty badge, color stripe using course `color`
- Hover: shadow grows from `4px 4px` to `6px 6px`, border pulses green once (300ms)
- Footer link `→ все курсы` → `/login?tab=register` (since they're not authed)

### 3.3 How it works (section 4)

3 cards in a grid where each card has a **different height** and **different shadow offset** to break monotony:

- **STEP_01.md** — "Регистрация → 30 секунд". Shorter card, shadow `3px 3px`. Inside: terminal-like log `> POST /register → 201 OK`
- **STEP_02.md** — "Решай задачи". Tallest card, shadow `5px 5px`. Inside: SVG mockup of Monaco editor with code highlighting
- **STEP_03.md** — "Растёшь каждый день". Medium height, shadow `4px 4px`. Inside: SVG mockup of streak heatmap (10x10 grid, varying greens)

Mobile: stack vertically, all shadows reduced to `2px 2px`.

### 3.4 SQL stats bar (section 5)

Full-width thin band (60-80px), dark bg, mono font:

```
> SELECT COUNT(*) FROM users;        ▸  1,247
> SELECT SUM(count) FROM today;      ▸  342
> SELECT COUNT(*) FROM courses;      ▸  8
```

- Numbers come from `/api/public/stats` (extend it to also return courses count)
- Cursor `▸` blinks 0.5s on / 0.5s off
- Typewriter animation when scrolled into view (one-shot via `viewport: { once: true }`)

### 3.5 Languages strip (section 6)

Same as current `LANGS` array, but more compact: 12 chips in 1-2 rows, smaller padding. Subheading changes to `// 12 технологий и растёт`.

### 3.6 Final CTA (section 7)

Centered card, max-width `~720px`:
- Top chrome: `register.sh` filename
- Headline: `Стань лучше.\n**Каждый день.**`
- Two buttons: "Создать аккаунт" (primary green) + "Войти" (ghost)
- Heavy shadow `8px 8px 0 0 rgba(16,185,129,0.55)` to anchor as final visual punch

## 4. Component Decomposition

`src/app/page.tsx` becomes a thin composition file (~50 lines). Logic moves to:

```
src/components/landing/
├── shared.ts                  ← color constants (G, GS, GL), motion presets
├── nav.tsx
├── hero-dossier.tsx           ← left panel of hero
├── hero-runner.tsx            ← right panel: tabs + editor + run button
├── courses-strip.tsx          ← horizontal real-courses strip
├── how-it-works.tsx           ← 3 STEP cards
├── stats-sql.tsx              ← SQL typewriter bar
├── languages-strip.tsx        ← chips
├── final-cta.tsx              ← bottom CTA
└── footer.tsx
```

## 5. Data Flow

| Data | Endpoint | Fetcher | Cache |
|---|---|---|---|
| Public stats | `/api/public/stats` | SWR | 60s refresh, no revalidateOnFocus |
| Public courses | `/api/public/courses` | SWR | no revalidate |

### New endpoint: `/api/public/courses`

`src/app/api/public/courses/route.ts`:
- Public, no auth required
- Returns top 4 published courses ordered by `createdAt` desc
- Selects only: `id, title, description, iconText, color, difficulty, tags`, plus `_count.lessons` for lesson count
- Does NOT select user-specific data (progress, completion)
- Cache headers: `public, max-age=60, s-maxage=60`

The existing `/api/courses` requires auth context for progress enrichment; spinning a separate public endpoint avoids leaking auth scaffolding into the landing.

### Extension to `/api/public/stats`

Add `coursesCount: prisma.course.count({ where: { isPublished: true } })` to the existing parallel query so the SQL bar can show all 3 stats from one fetch.

## 6. Edge Cases

| Case | Handling |
|---|---|
| Pyodide load is slow (~50MB) | Lazy-load on first "Запустить" click for Python tab. Show "Загрузка Python…" banner (reuse existing pattern from lesson runner) |
| API returns error | Stats fallback to `—` (already in route handler). Courses strip renders 4 skeleton cards |
| User already authed | Existing middleware redirects `/` → `/dashboard` ([src/middleware.ts:16](src/middleware.ts:16)). No client-side guard needed |
| Slow connection | Hero text renders immediately; runner and courses stream in. No blocking |
| Course list has fewer than 4 published courses | Render however many exist (no padding with empty cards) |
| iframe sandbox postMessage failure | Reuses existing html-runner protocol — same handling as on lesson pages |
| Pyodide CDN (jsdelivr) blocked | Python tab shows a friendly fallback message; JS / HTML tabs continue to work |

## 7. Animations

All using `framer-motion` already installed. No new libraries.

| Element | Effect | Timing |
|---|---|---|
| Hero left | fade-up | 0.55s, ease `[0.22, 1, 0.36, 1]` |
| Hero right | fade-up | 0.55s, delay 0.15s |
| Course cards | stagger fade-in | 0.06s gap, `whileInView`, once |
| STEP cards | stagger fade-up + slight scale | 0.08s gap, `whileInView`, once |
| SQL stats | typewriter per line, ~30 char/sec | one-shot on viewport entry |
| Cursor `▸` in SQL | blink | 0.5s on / 0.5s off, infinite |
| Languages chips | existing stagger | unchanged |
| Final CTA | none (always visible at scroll bottom) | — |

## 8. Responsive

Single breakpoint `lg: 1024px`.

- **Hero**: `grid-cols-1 lg:grid-cols-[1fr_1fr]`. Mobile stacks left → right.
- **Courses strip**: desktop 4-up grid; mobile horizontal scroll with `snap-x snap-mandatory`
- **How it works**: desktop 3-col asymmetric; mobile vertical stack, all shadows reduced to `2px 2px`
- **SQL bar**: desktop one row of 3 queries; mobile each query on its own row
- **Languages**: desktop 1-2 rows; mobile 3-4 rows with smaller chip padding
- **Final CTA**: desktop `8px 8px` shadow; mobile `4px 4px` shadow + reduced padding

## 9. What We Drop From Current Page

- The `FEATURES` array (3 generic feature cards) — replaced by section 4 "How it works" with personality
- The `STEPS` array — replaced by new "STEP_XX.md" cards with mockup content
- The current 3-stat box section — replaced by SQL bar
- The "reviews" section — already removed in commit `ece2dbb`, nothing to do
- `LANGS` array stays as-is (hardcoded; YAGNI on moving to DB)

## 10. Out of Scope

- Tests — landing is marketing static; `next build` + manual smoke is sufficient
- Image upload (no images in design — all SVG mockups inline)
- A/B testing infra
- Cookie banner (already lives in legal modal, not on landing)
- Skeleton for hero-runner (pre-execution editor state IS the empty state)
- Moving `LANGS` to DB

## 11. Files Touched

**Created:**
- `src/app/api/public/courses/route.ts`
- `src/components/landing/shared.ts`
- `src/components/landing/nav.tsx`
- `src/components/landing/hero-dossier.tsx`
- `src/components/landing/hero-runner.tsx`
- `src/components/landing/courses-strip.tsx`
- `src/components/landing/how-it-works.tsx`
- `src/components/landing/stats-sql.tsx`
- `src/components/landing/languages-strip.tsx`
- `src/components/landing/final-cta.tsx`
- `src/components/landing/footer.tsx`

**Modified:**
- `src/app/page.tsx` — slim composition shell (~50 lines)
- `src/app/api/public/stats/route.ts` — add `coursesCount` field
