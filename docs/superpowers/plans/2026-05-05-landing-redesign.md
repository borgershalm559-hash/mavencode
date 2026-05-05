# Landing Page Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generic stacked landing at `src/app/page.tsx` with a dossier-style scroll where every section has a different shape and real product elements (live mini-runner, real courses from DB, SQL stats) are interleaved with terminal-style copy.

**Architecture:** Decompose the 397-line monolith into `src/components/landing/*` components. Add a public courses endpoint. Extend the public stats endpoint with `coursesCount`. The page itself becomes a ~50-line composition shell. Reuse existing lesson runners for the live mini-runner.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind 4, framer-motion, SWR, lucide-react, existing `src/components/lesson/runners/*` for code execution.

**Reference spec:** [docs/superpowers/specs/2026-05-05-landing-redesign-design.md](docs/superpowers/specs/2026-05-05-landing-redesign-design.md)

**Verification approach:** No tests — landing is static marketing. Each task ends with `npx tsc --noEmit` passing and a manual visual check at `http://localhost:3000`. Final task additionally runs `npm run build`.

---

## Task 1: Foundation — endpoints + shared constants

**Files:**
- Modify: `src/app/api/public/stats/route.ts`
- Create: `src/app/api/public/courses/route.ts`
- Create: `src/components/landing/shared.ts`

- [ ] **Step 1: Extend `/api/public/stats` with `coursesCount`**

Edit `src/app/api/public/stats/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Public stats for the landing / auth page.
 * Returns: total students, lessons solved today, published courses count.
 * No authentication required.
 */
export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [students, solvedTodayAgg, coursesCount] = await Promise.all([
      prisma.user.count(),
      prisma.activityLog.aggregate({
        _sum: { count: true },
        where: { type: "lesson", date: today },
      }),
      prisma.course.count({ where: { isPublished: true } }),
    ]);

    return NextResponse.json(
      {
        students,
        solvedToday: solvedTodayAgg._sum.count ?? 0,
        coursesCount,
      },
      { headers: { "Cache-Control": "public, max-age=30, s-maxage=30" } }
    );
  } catch {
    return NextResponse.json({ students: 0, solvedToday: 0, coursesCount: 0 });
  }
}
```

- [ ] **Step 2: Create `/api/public/courses`**

Create `src/app/api/public/courses/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Public, unauthenticated list of top published courses for the landing.
 * Excludes user-specific data (progress, completion). Distinct from
 * `/api/courses` which requires auth context.
 */
export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: 4,
      select: {
        id: true,
        title: true,
        description: true,
        iconText: true,
        color: true,
        difficulty: true,
        tags: true,
        _count: { select: { lessons: true } },
      },
    });

    return NextResponse.json(
      courses.map((c) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        iconText: c.iconText,
        color: c.color,
        difficulty: c.difficulty,
        tags: c.tags,
        lessonCount: c._count.lessons,
      })),
      { headers: { "Cache-Control": "public, max-age=60, s-maxage=60" } }
    );
  } catch {
    return NextResponse.json([]);
  }
}
```

- [ ] **Step 3: Create shared constants**

Create `src/components/landing/shared.ts`:

```typescript
// Color tokens used across all landing components — keep in sync with /login.
export const G  = "#10B981";
export const GS = "rgba(16,185,129,0.09)";
export const GL = "rgba(16,185,129,0.28)";

// Standard motion ease used throughout the dashboard and /login.
export const EASE = [0.22, 1, 0.36, 1] as const;

// Public stats payload shape — mirrors the API response.
export interface PublicStats {
  students: number;
  solvedToday: number;
  coursesCount: number;
}

// Public course payload shape.
export interface PublicCourse {
  id: string;
  title: string;
  description: string;
  iconText: string | null;
  color: string | null;
  difficulty: string;
  tags: string[];
  lessonCount: number;
}

export function formatNum(n: number): string {
  return n.toLocaleString("ru-RU");
}
```

- [ ] **Step 4: Verify types compile**

Run: `npx tsc --noEmit`
Expected: exit 0, no output.

- [ ] **Step 5: Smoke test endpoints**

Start dev server in background: `npm run dev` (run_in_background)

Hit the endpoints:
```bash
curl -s http://localhost:3000/api/public/stats
curl -s http://localhost:3000/api/public/courses
```

Expected: stats returns JSON with `students`, `solvedToday`, `coursesCount`. Courses returns array (possibly empty if DB has no courses).

Stop dev server.

- [ ] **Step 6: Commit**

```bash
git add src/app/api/public/stats/route.ts src/app/api/public/courses/route.ts src/components/landing/shared.ts
git commit -m "feat: add public courses endpoint and shared landing tokens"
```

---

## Task 2: Nav + Footer

**Files:**
- Create: `src/components/landing/nav.tsx`
- Create: `src/components/landing/footer.tsx`

- [ ] **Step 1: Create nav component**

Create `src/components/landing/nav.tsx`:

```tsx
import Link from "next/link";
import { G, GL } from "./shared";

export function LandingNav() {
  return (
    <nav className="relative z-30 border-b-2 border-white/[0.07] flex items-center justify-between px-6 py-4 md:px-10">
      <a href="/" className="flex items-center gap-3">
        <img src="/logo.svg" alt="MavenCode" width={36} height={28} />
        <span className="font-mono text-[15px] font-black tracking-tight text-white">
          maven<span style={{ color: G }}>code</span>
        </span>
      </a>
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="font-mono text-[11px] uppercase tracking-[0.2em] font-bold text-white/60 hover:text-white transition-colors px-4 py-2 border-2 border-white/10 hover:border-white/25"
        >
          Войти
        </Link>
        <Link
          href="/login?tab=register"
          className="font-mono text-[11px] uppercase tracking-[0.2em] font-bold px-4 py-2 border-2 transition-colors"
          style={{ background: G, borderColor: G, color: "#000", boxShadow: `3px 3px 0 0 ${GL}` }}
        >
          Начать бесплатно
        </Link>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Create footer component**

Create `src/components/landing/footer.tsx`:

```tsx
import Link from "next/link";
import { G } from "./shared";

export function LandingFooter() {
  return (
    <footer className="relative z-10 border-t-2 border-white/[0.07] px-6 py-6 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <img src="/logo.svg" alt="MavenCode" width={24} height={20} />
        <span className="font-mono text-[11px] font-bold text-white/40">
          maven<span style={{ color: G + "99" }}>code</span> · 2026
        </span>
      </div>
      <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
        <a href="/legal/terms" className="hover:text-white/60 transition-colors">Условия</a>
        <a href="/legal/privacy" className="hover:text-white/60 transition-colors">Конфиденциальность</a>
        <Link href="/login" className="hover:text-white/60 transition-colors">Войти</Link>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/components/landing/nav.tsx src/components/landing/footer.tsx
git commit -m "feat: extract landing nav and footer to dedicated components"
```

---

## Task 3: Hero — left dossier panel

**Files:**
- Create: `src/components/landing/hero-dossier.tsx`

- [ ] **Step 1: Create hero-dossier**

Create `src/components/landing/hero-dossier.tsx`. This is the left half of the hero — a black card with green border, manifesto headline, three `// без` tags, primary CTA, three real stats from the API at the bottom, and a tilted "без воды" badge. Mirrors the dossier card pattern from `src/app/login/page.tsx:87-148`.

```tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import useSWR from "swr";
import { ChevronRight } from "lucide-react";
import { fetcher } from "@/lib/fetcher";
import { G, GL, EASE, formatNum, type PublicStats } from "./shared";

export function HeroDossier() {
  const { data: stats } = useSWR<PublicStats>("/api/public/stats", fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: false,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE }}
      className="relative bg-black border-2 border-[#10B981]/60 p-7 md:p-9 flex flex-col justify-between min-h-[480px] md:min-h-[560px]"
    >
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
          // маяк / 2026
        </div>

        <h1 className="mt-5 font-mono text-[40px] md:text-[52px] leading-[0.95] font-black uppercase text-white">
          Учись.<br />
          Практикуй.<br />
          <span style={{ color: G }}>Доминируй.</span>
        </h1>

        <p className="mt-6 font-mono text-[12px] md:text-[13px] leading-relaxed text-white/55 max-w-[320px]">
          Интерактивные курсы, живой код в браузере, прогресс через действие.
          Не лекции — практика.
        </p>

        <div className="mt-6 flex flex-col gap-1 font-mono text-[11px] text-white/40">
          <div>// без видеолекций</div>
          <div>// без карты</div>
          <div>// без воды</div>
        </div>

        <Link
          href="/login?tab=register"
          className="mt-8 inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.2em] font-black px-6 py-3.5 border-2 transition-all"
          style={{ background: G, borderColor: G, color: "#000", boxShadow: `4px 4px 0 0 ${GL}` }}
        >
          Начать бесплатно
          <ChevronRight className="size-4" />
        </Link>
      </div>

      <div className="mt-10 space-y-3">
        <StatRow label="students"     value={stats ? formatNum(stats.students) : "—"} />
        <StatRow label="solved today" value={stats ? formatNum(stats.solvedToday) : "—"} />
        <StatRow label="courses"      value={stats ? formatNum(stats.coursesCount) : "—"} />
      </div>

      <div
        className="absolute -bottom-4 -right-2 rotate-[-6deg] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] font-bold border-2 border-black select-none"
        style={{ background: G, color: "#000", boxShadow: "3px 3px 0 0 #fff" }}
      >
        без воды
      </div>
    </motion.div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between border-t-2 border-white/10 pt-3">
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
        &gt; {label}
      </span>
      <span className="font-mono text-[20px] font-bold text-white tabular-nums">{value}</span>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/hero-dossier.tsx
git commit -m "feat: add hero dossier left panel with manifesto and live stats"
```

---

## Task 4: Hero — right runner panel

**Files:**
- Create: `src/components/landing/hero-runner.tsx`

This is the most complex component. Three tabs (Python / JS / HTML), each showing a hardcoded snippet rendered as a syntax-highlighted read-only code block. A green "Запустить" button runs the active snippet through the existing runner from `src/components/lesson/runners/`. Output appears beneath. Pyodide is lazy-loaded only on first Python run.

- [ ] **Step 1: Read existing runner APIs to confirm shape**

Read these files for runner contracts:
- [src/components/lesson/runners/types.ts](src/components/lesson/runners/types.ts)
- [src/components/lesson/runners/js-runner.ts](src/components/lesson/runners/js-runner.ts)
- [src/components/lesson/runners/python-runner.ts](src/components/lesson/runners/python-runner.ts)
- [src/components/lesson/runners/html-runner.ts](src/components/lesson/runners/html-runner.ts)

Each exports a class with `run(code, tests): Promise<RunResult>` where `RunResult = { output, error, tests }`. For the landing we pass empty `tests: []` and just show `output`.

- [ ] **Step 2: Create hero-runner**

Create `src/components/landing/hero-runner.tsx`:

```tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Loader2 } from "lucide-react";
import { JsRunner } from "@/components/lesson/runners/js-runner";
import { PythonRunner, onPyodideLoadingStatus, type PyodideLoadingStatus } from "@/components/lesson/runners/python-runner";
import { HtmlRunner } from "@/components/lesson/runners/html-runner";
import { G, GL, EASE } from "./shared";

type Lang = "python" | "javascript" | "html";

interface Snippet {
  code: string;
  filename: string;
  highlight: (code: string) => React.ReactNode; // simple span-coloring
}

const SNIPPETS: Record<Lang, Snippet> = {
  python: {
    filename: "lesson_01.py",
    code: `def sum_list(nums: list[int]) -> int:
    return sum(nums)

print(sum_list([1, 2, 3, 4]))`,
    highlight: (code) => <CodePython code={code} />,
  },
  javascript: {
    filename: "lesson_01.js",
    code: `function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("MavenCode"));`,
    highlight: (code) => <CodeJs code={code} />,
  },
  html: {
    filename: "lesson_01.html",
    code: `<button class="cta">
  Начать
</button>
<style>
  .cta { color: #10B981; padding: 8px 16px; }
</style>`,
    highlight: (code) => <CodeHtml code={code} />,
  },
};

export function HeroRunner() {
  const [lang, setLang] = useState<Lang>("python");
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [pyStatus, setPyStatus] = useState<PyodideLoadingStatus | null>(null);

  // Subscribe once for Pyodide loading banner.
  if (typeof window !== "undefined") {
    onPyodideLoadingStatus(setPyStatus);
  }

  async function handleRun() {
    setRunning(true);
    setOutput(null);
    setError(null);
    try {
      const snippet = SNIPPETS[lang].code;
      let result;
      if (lang === "python") {
        const r = new PythonRunner();
        result = await r.run(snippet, []);
        r.destroy();
      } else if (lang === "javascript") {
        const r = new JsRunner();
        result = await r.run(snippet, []);
        r.destroy();
      } else {
        // For HTML we just toss the snippet into a sandboxed iframe via HtmlRunner.
        // The runner returns the rendered DOM as `output` for assertion contexts;
        // for landing we just show that the snippet ran without errors.
        const r = new HtmlRunner();
        result = await r.run(snippet, []);
        r.destroy();
      }
      setOutput(result.output || "✓ выполнено без вывода");
      setError(result.error);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setRunning(false);
    }
  }

  const snippet = SNIPPETS[lang];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.15, ease: EASE }}
      className="relative bg-[#0F1011] border-2 border-white/[0.07]"
      style={{ boxShadow: `6px 6px 0 0 ${GL}` }}
    >
      {/* Terminal chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b-2 border-white/[0.07]">
        <div className="size-2.5 rounded-full bg-red-500/70" />
        <div className="size-2.5 rounded-full bg-yellow-500/70" />
        <div className="size-2.5 rounded-full" style={{ background: G + "aa" }} />
        <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
          {snippet.filename}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex border-b-2 border-white/[0.07]">
        {(["python", "javascript", "html"] as Lang[]).map((l) => (
          <button
            key={l}
            onClick={() => { setLang(l); setOutput(null); setError(null); }}
            className="flex-1 py-2 font-mono text-[10px] uppercase tracking-[0.2em] font-bold transition-colors"
            style={{
              background: lang === l ? "rgba(16,185,129,0.08)" : "transparent",
              color: lang === l ? G : "rgba(255,255,255,0.4)",
              borderBottom: lang === l ? `2px solid ${G}` : "2px solid transparent",
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Code body */}
      <pre className="px-5 py-4 font-mono text-[12px] leading-relaxed text-white/85 overflow-x-auto">
        {snippet.highlight(snippet.code)}
      </pre>

      {/* Run + output */}
      <div className="px-5 pb-5 pt-2 border-t-2 border-white/[0.07] space-y-3">
        <button
          onClick={handleRun}
          disabled={running}
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] font-black px-4 py-2 border-2 transition-all disabled:opacity-50"
          style={{ background: G, borderColor: G, color: "#000", boxShadow: `3px 3px 0 0 ${GL}` }}
        >
          {running ? <Loader2 className="size-3 animate-spin" /> : <Play className="size-3" />}
          Запустить
        </button>

        {pyStatus === "loading" && lang === "python" && (
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
            // загрузка python (~50 mb, один раз)…
          </div>
        )}

        {output && (
          <div className="font-mono text-[11px] text-white/70 whitespace-pre-wrap">{output}</div>
        )}
        {error && (
          <div className="font-mono text-[11px] text-red-400 whitespace-pre-wrap">{error}</div>
        )}
        {!output && !error && !running && (
          <div className="inline-flex items-center gap-2">
            <span
              className="px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-[0.1em] border-2"
              style={{ color: G, borderColor: GL, background: "rgba(16,185,129,0.06)" }}
            >
              ✓ готов к запуску
            </span>
            <span className="text-white/30 text-[11px] font-mono">+50 XP</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Inline syntax-highlight helpers ─────────────────────────────────────────
// Minimal coloring — keyword / string / comment / function. Good enough for
// landing snippets; full highlighting lives in the lesson editor's CodeMirror.

function CodePython({ code }: { code: string }) {
  const KEYWORDS = /\b(def|return|print|list|int|for|in|if|else|elif|class|import|from|as)\b/g;
  return <Highlighted code={code} kwRe={KEYWORDS} stringRe={/(\"[^\"]*\"|'[^']*')/g} commentRe={/(#.*$)/gm} />;
}
function CodeJs({ code }: { code: string }) {
  const KEYWORDS = /\b(function|return|const|let|var|if|else|for|while|class|import|from|export|console)\b/g;
  return <Highlighted code={code} kwRe={KEYWORDS} stringRe={/(\"[^\"]*\"|'[^']*'|`[^`]*`)/g} commentRe={/(\/\/.*$)/gm} />;
}
function CodeHtml({ code }: { code: string }) {
  // Tags + attributes; very rough.
  const tagRe = /(&lt;\/?[a-zA-Z][^&]*?&gt;|<\/?[a-zA-Z][^>]*?>)/g;
  return <Highlighted code={code} kwRe={tagRe} stringRe={/("[^"]*")/g} commentRe={/(<!--[\s\S]*?-->)/g} />;
}

function Highlighted({ code, kwRe, stringRe, commentRe }: { code: string; kwRe: RegExp; stringRe: RegExp; commentRe: RegExp }) {
  // Order matters: comments → strings → keywords. Replace with marker spans.
  let html = code
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(commentRe, (m) => `COMMENT${m}/COMMENT`)
    .replace(stringRe, (m) => `STRING${m}/STRING`)
    .replace(kwRe, (m) => `KW${m}/KW`);

  const parts: React.ReactNode[] = [];
  const re = /(COMMENT|STRING|KW)([\s\S]*?)\/(?:COMMENT|STRING|KW)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = re.exec(html)) !== null) {
    if (match.index > lastIndex) parts.push(<span key={key++}>{html.slice(lastIndex, match.index)}</span>);
    const color = match[1] === "COMMENT" ? "rgba(255,255,255,0.3)" : match[1] === "STRING" ? "#A3E635" : "#10B981";
    parts.push(<span key={key++} style={{ color }}>{match[2]}</span>);
    lastIndex = re.lastIndex;
  }
  if (lastIndex < html.length) parts.push(<span key={key++}>{html.slice(lastIndex)}</span>);
  return <>{parts}</>;
}
```

- [ ] **Step 3: Verify types**

Run: `npx tsc --noEmit`
Expected: exit 0. If the existing runner imports don't match, adapt the import paths.

- [ ] **Step 4: Quick functional check**

Run dev server in background: `npm run dev` (run_in_background)

Open `http://localhost:3000` in a browser. The page is still the old layout, but in the next task we'll wire in the new components. For now, verify the dev server starts without errors. Stop the server.

- [ ] **Step 5: Commit**

```bash
git add src/components/landing/hero-runner.tsx
git commit -m "feat: add hero runner with Python/JS/HTML tabs and live execution"
```

---

## Task 5: Real courses strip

**Files:**
- Create: `src/components/landing/courses-strip.tsx`

- [ ] **Step 1: Create courses-strip**

Create `src/components/landing/courses-strip.tsx`:

```tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import useSWR from "swr";
import { ArrowRight } from "lucide-react";
import { fetcher } from "@/lib/fetcher";
import { G, GL, EASE, type PublicCourse } from "./shared";

export function CoursesStrip() {
  const { data: courses } = useSWR<PublicCourse[]>("/api/public/courses", fetcher, {
    revalidateOnFocus: false,
  });

  return (
    <section className="relative z-10 px-6 py-16 md:px-10 border-t-2 border-white/[0.06]">
      <div className="max-w-[1100px] mx-auto">
        <div className="mb-8 flex items-baseline gap-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/30">
            // курсы / опубликованные
          </div>
          <div className="flex-1 h-px bg-white/[0.07]" />
          <Link
            href="/login?tab=register"
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 hover:text-white inline-flex items-center gap-1"
          >
            все курсы <ArrowRight className="size-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(courses ?? Array.from({ length: 4 }).map(() => null)).map((c, i) => (
            <CourseCard key={c?.id ?? i} course={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CourseCard({ course, index }: { course: PublicCourse | null; index: number }) {
  const c = course;
  const accent = c?.color ?? G;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: EASE }}
      className="group relative bg-[#0F1011] border-2 border-white/[0.07] hover:border-white/20 transition-all"
      style={{ boxShadow: `4px 4px 0 0 ${GL}` }}
    >
      {/* color stripe */}
      <div className="h-1.5" style={{ background: accent }} />

      <div className="p-5 flex flex-col gap-3 min-h-[180px]">
        {!c ? (
          <>
            <div className="h-4 w-24 bg-white/[0.06] animate-pulse" />
            <div className="h-6 w-full bg-white/[0.06] animate-pulse" />
            <div className="h-3 w-3/4 bg-white/[0.06] animate-pulse" />
          </>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <span
                className="size-9 grid place-items-center font-mono text-[12px] font-black border-2"
                style={{ color: accent, borderColor: accent + "55", background: accent + "0d" }}
              >
                {c.iconText ?? c.title.slice(0, 2).toUpperCase()}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">
                {c.difficulty}
              </span>
            </div>

            <h3 className="font-mono text-[14px] font-black uppercase text-white leading-tight">
              {c.title}
            </h3>

            <p className="font-mono text-[11px] leading-relaxed text-white/45 line-clamp-2">
              {c.description}
            </p>

            <div className="mt-auto pt-3 border-t-2 border-white/[0.05] flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                {c.lessonCount} уроков
              </span>
              <Link
                href="/login?tab=register"
                className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold inline-flex items-center gap-1 group-hover:text-white"
                style={{ color: accent }}
              >
                открыть <ArrowRight className="size-3" />
              </Link>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/courses-strip.tsx
git commit -m "feat: add real courses strip pulled from public API"
```

---

## Task 6: How it works (3 STEP cards)

**Files:**
- Create: `src/components/landing/how-it-works.tsx`

- [ ] **Step 1: Create how-it-works with asymmetric grid**

Create `src/components/landing/how-it-works.tsx`. Three cards in a CSS grid where each has a different height and shadow offset to break monotony. Inline SVG mockups for editor and heatmap.

```tsx
"use client";

import { motion } from "framer-motion";
import { G, GL, EASE } from "./shared";

interface Step {
  filename: string;
  title: string;
  shadow: string;
  minH: string;
  body: React.ReactNode;
}

const STEPS: Step[] = [
  {
    filename: "STEP_01.md",
    title: "Регистрация → 30 секунд",
    shadow: `3px 3px 0 0 ${GL}`,
    minH: "min-h-[260px]",
    body: (
      <div className="font-mono text-[11px] text-white/60 space-y-1">
        <div className="text-white/30">$ curl -X POST /api/register</div>
        <div className="text-white/30">  -d 'email=you@maven.code'</div>
        <div className="text-white/30">  -d 'password=********'</div>
        <div style={{ color: G }}>{"> 201 Created"}</div>
        <div style={{ color: G }}>{"> session: ok"}</div>
      </div>
    ),
  },
  {
    filename: "STEP_02.md",
    title: "Решай задачи",
    shadow: `5px 5px 0 0 ${GL}`,
    minH: "min-h-[320px]",
    body: <EditorMock />,
  },
  {
    filename: "STEP_03.md",
    title: "Растёшь каждый день",
    shadow: `4px 4px 0 0 ${GL}`,
    minH: "min-h-[290px]",
    body: <StreakMock />,
  },
];

export function HowItWorks() {
  return (
    <section className="relative z-10 px-6 py-16 md:px-10 border-t-2 border-white/[0.06]">
      <div className="max-w-[1100px] mx-auto">
        <div className="mb-10 flex items-center gap-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/30">
            // как устроено
          </div>
          <div className="flex-1 h-px bg-white/[0.07]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.filename}
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: EASE }}
              className={`relative bg-[#0F1011] border-2 border-white/[0.07] flex flex-col ${s.minH}`}
              style={{ boxShadow: s.shadow }}
            >
              <div className="px-5 py-2 border-b-2 border-white/[0.07] flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                  {s.filename}
                </span>
                <span className="font-mono text-[10px] font-black tabular-nums" style={{ color: G }}>
                  0{i + 1}
                </span>
              </div>
              <div className="p-5 flex-1">
                <h3 className="font-mono text-[14px] font-black uppercase text-white mb-4">
                  {s.title}
                </h3>
                {s.body}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Inline mockups ──────────────────────────────────────────────────────────

function EditorMock() {
  // Pseudo Monaco panel
  return (
    <div className="bg-black border-2 border-white/[0.05] font-mono text-[11px] leading-tight">
      <div className="flex items-center gap-1.5 px-2 py-1 border-b-2 border-white/[0.05]">
        <div className="size-1.5 rounded-full bg-red-500/70" />
        <div className="size-1.5 rounded-full bg-yellow-500/70" />
        <div className="size-1.5 rounded-full" style={{ background: G + "aa" }} />
        <span className="ml-1 text-[9px] uppercase tracking-[0.2em] text-white/25">main.py</span>
      </div>
      <div className="px-3 py-3 text-white/70">
        <div><span className="text-white/30 mr-2">1</span><span style={{ color: G }}>def</span> <span className="text-white">solve</span>(<span className="text-white/50">arr</span>):</div>
        <div><span className="text-white/30 mr-2">2</span>    <span style={{ color: G }}>return</span> <span className="text-white">sum</span>(arr)</div>
        <div><span className="text-white/30 mr-2">3</span></div>
        <div><span className="text-white/30 mr-2">4</span><span className="text-white">solve</span>([<span style={{ color: "#A3E635" }}>1</span>,<span style={{ color: "#A3E635" }}>2</span>,<span style={{ color: "#A3E635" }}>3</span>])</div>
      </div>
      <div className="border-t-2 border-white/[0.05] px-3 py-1.5 text-[10px] flex items-center justify-between">
        <span className="text-white/30">3 теста</span>
        <span style={{ color: G }}>✓ pass</span>
      </div>
    </div>
  );
}

function StreakMock() {
  // 7x7 heatmap grid, varying greens
  const cells = Array.from({ length: 49 }, (_, i) => {
    const intensity = Math.floor(Math.sin(i * 0.7) * 0.5 * 100 + 50) / 100;
    return intensity;
  });
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-7 gap-[3px]">
        {cells.map((v, i) => (
          <div
            key={i}
            className="aspect-square"
            style={{ background: v > 0.1 ? `rgba(16,185,129,${v})` : "rgba(255,255,255,0.04)" }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
        <span>49 дней</span>
        <span style={{ color: G }}>стрик 23</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/how-it-works.tsx
git commit -m "feat: add how-it-works section with three asymmetric STEP cards"
```

---

## Task 7: Stats SQL bar

**Files:**
- Create: `src/components/landing/stats-sql.tsx`

- [ ] **Step 1: Create stats-sql with typewriter effect**

Create `src/components/landing/stats-sql.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { G, formatNum, type PublicStats } from "./shared";

const QUERIES = [
  { sql: "SELECT COUNT(*) FROM users;",          key: "students" as const },
  { sql: "SELECT SUM(count) FROM today;",        key: "solvedToday" as const },
  { sql: "SELECT COUNT(*) FROM courses;",        key: "coursesCount" as const },
];

export function StatsSql() {
  const { data: stats } = useSWR<PublicStats>("/api/public/stats", fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: false,
  });
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVisible(true);
        obs.disconnect();
      }
    }, { threshold: 0.4 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative z-10 border-y-2 border-white/[0.07] bg-[#0A0A0B] py-6 px-6 md:px-10"
    >
      <div className="max-w-[1100px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 font-mono text-[11px] md:text-[12px]">
          {QUERIES.map((q, i) => (
            <SqlRow
              key={q.sql}
              sql={q.sql}
              value={stats ? formatNum(stats[q.key]) : "—"}
              start={visible}
              delay={i * 600}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function SqlRow({ sql, value, start, delay }: { sql: string; value: string; start: boolean; delay: number }) {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (!start) return;
    const t = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setTyped(sql.slice(0, i));
        if (i >= sql.length) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(t);
  }, [start, delay, sql]);

  const done = typed === sql;

  return (
    <div className="flex items-center gap-3">
      <span className="text-white/35">&gt;</span>
      <span className="text-white/65 flex-1 truncate">{typed}<BlinkCursor visible={!done} /></span>
      <span className="animate-pulse" style={{ color: G }}>▸</span>
      <span className="font-black tabular-nums" style={{ color: G }}>{done ? value : "…"}</span>
    </div>
  );
}

function BlinkCursor({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return <span className="inline-block w-[6px] h-[12px] bg-white/60 animate-pulse ml-0.5 align-middle" />;
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/stats-sql.tsx
git commit -m "feat: add SQL-style stats bar with typewriter effect"
```

---

## Task 8: Languages strip

**Files:**
- Create: `src/components/landing/languages-strip.tsx`

- [ ] **Step 1: Create languages-strip**

Create `src/components/landing/languages-strip.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { G } from "./shared";

const LANGS = [
  { name: "Python",     color: "#3B82F6" },
  { name: "JavaScript", color: "#EAB308" },
  { name: "TypeScript", color: "#60A5FA" },
  { name: "Go",         color: "#22D3EE" },
  { name: "SQL",        color: G },
  { name: "HTML/CSS",   color: "#F97316" },
  { name: "React",      color: "#38BDF8" },
  { name: "Docker",     color: "#60A5FA" },
  { name: "Git",        color: "#F87171" },
  { name: "Linux",      color: "#A3E635" },
  { name: "Rust",       color: "#FB923C" },
  { name: "Алгоритмы",  color: G },
];

export function LanguagesStrip() {
  return (
    <section className="relative z-10 px-6 py-14 md:px-10 border-t-2 border-white/[0.06]">
      <div className="max-w-[1100px] mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/30">
            // 12 технологий и растёт
          </div>
          <div className="flex-1 h-px bg-white/[0.07]" />
        </div>
        <div className="flex flex-wrap gap-2">
          {LANGS.map((l, i) => (
            <motion.div
              key={l.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
              className="px-3 py-1.5 border-2 font-mono text-[11px] font-bold uppercase tracking-[0.15em]"
              style={{
                borderColor: l.color + "44",
                color: l.color,
                background: l.color + "0d",
              }}
            >
              {l.name}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/languages-strip.tsx
git commit -m "feat: add languages strip"
```

---

## Task 9: Final CTA

**Files:**
- Create: `src/components/landing/final-cta.tsx`

- [ ] **Step 1: Create final-cta with heavy shadow**

Create `src/components/landing/final-cta.tsx`:

```tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { G, GL, EASE } from "./shared";

export function FinalCta() {
  return (
    <section className="relative z-10 px-6 py-20 md:px-10 border-t-2 border-white/[0.06]">
      <div className="max-w-[720px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          className="bg-[#0F1011] border-2 border-white/[0.07]"
          style={{ boxShadow: `8px 8px 0 0 rgba(16,185,129,0.55)` }}
        >
          <div className="flex items-center gap-2 px-4 py-2.5 border-b-2 border-white/[0.07]">
            <div className="size-2.5 rounded-full bg-red-500/70" />
            <div className="size-2.5 rounded-full bg-yellow-500/70" />
            <div className="size-2.5 rounded-full" style={{ background: G + "aa" }} />
            <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
              register.sh
            </span>
          </div>

          <div className="p-8 md:p-12 text-center">
            <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/30 mb-4">
              // начни сегодня
            </div>
            <h2 className="font-mono text-[32px] md:text-[44px] font-black uppercase text-white leading-tight">
              Стань лучше.<br />
              <span style={{ color: G }}>Каждый день.</span>
            </h2>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/login?tab=register"
                className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.2em] font-black px-8 py-4 border-2 transition-all"
                style={{ background: G, borderColor: G, color: "#000", boxShadow: `4px 4px 0 0 ${GL}` }}
              >
                Создать аккаунт
                <ChevronRight className="size-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.2em] font-bold px-8 py-4 border-2 border-white/15 text-white/60 hover:border-white/30 hover:text-white transition-all"
              >
                Войти
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/final-cta.tsx
git commit -m "feat: add final CTA dossier card with heavy shadow"
```

---

## Task 10: Slim page.tsx + responsive smoke + production build

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Replace page.tsx with slim composition**

Overwrite `src/app/page.tsx`:

```tsx
import { LandingNav } from "@/components/landing/nav";
import { HeroDossier } from "@/components/landing/hero-dossier";
import { HeroRunner } from "@/components/landing/hero-runner";
import { CoursesStrip } from "@/components/landing/courses-strip";
import { HowItWorks } from "@/components/landing/how-it-works";
import { StatsSql } from "@/components/landing/stats-sql";
import { LanguagesStrip } from "@/components/landing/languages-strip";
import { FinalCta } from "@/components/landing/final-cta";
import { LandingFooter } from "@/components/landing/footer";

function GridBg() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    />
  );
}

export default function LandingPage() {
  return (
    <div
      className="relative min-h-screen overflow-x-hidden font-sans antialiased selection:bg-[#10B981] selection:text-black"
      style={{ background: "#0A0A0B", color: "#fff" }}
    >
      <GridBg />

      <LandingNav />

      <section className="relative z-10 px-6 pt-12 md:px-10 md:pt-16">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 lg:gap-10">
          <HeroDossier />
          <HeroRunner />
        </div>
      </section>

      <CoursesStrip />
      <HowItWorks />
      <StatsSql />
      <LanguagesStrip />
      <FinalCta />
      <LandingFooter />
    </div>
  );
}
```

- [ ] **Step 2: Verify types**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Visual smoke check**

Run dev server in background: `npm run dev` (run_in_background)

Open `http://localhost:3000` in a browser. Verify:
- Hero: left dossier card with manifesto + 3 stats + tilted "без воды" badge; right runner with 3 tabs + "Запустить" button
- Click "Запустить" on JavaScript tab → expect output `Hello, MavenCode!` within 1s
- Click "Запустить" on Python tab → first time shows "загрузка python…", then `10` after a delay
- Courses strip shows real courses from DB (or 4 skeletons if DB is empty)
- How-it-works section has 3 cards of varying heights, asymmetric shadows
- SQL bar: typewriter animation runs once when scrolled to
- Languages: 12 chips wrap nicely
- Final CTA: large card with heavy 8px shadow

Resize the browser to <1024px wide:
- Hero stacks vertically
- Courses become a horizontal scroll OR 2-up depending on viewport
- How-it-works stacks
- SQL bar rows stack
- Final CTA shadow becomes lighter

Stop the dev server.

- [ ] **Step 4: Production build**

Run: `npm run build`
Expected: build completes without errors. Note any warnings about bundle size for the runners. If Pyodide-related code bloats the initial bundle, consider dynamic-importing the runners inside hero-runner.tsx using `next/dynamic` with `ssr: false` — but only if the build actually flags it.

- [ ] **Step 5: Final commit**

```bash
git add src/app/page.tsx
git commit -m "feat: compose new landing from dossier-style components"
```

---

## Done

After Task 10:
- `src/app/page.tsx` is ~50 lines, just composes 9 child components
- New `src/components/landing/` directory holds all section logic
- New public courses endpoint exposes 4 published courses without auth
- Stats endpoint extended with `coursesCount`
- Live mini-runner on the hero executes Python/JS/HTML for real
- 8 visually distinct sections — no two share the same shape

To deploy: push to `main`, Vercel auto-deploys (same workflow as the PvP removal earlier).
