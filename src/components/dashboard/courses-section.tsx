"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  CheckCircle, Lock, Code, Puzzle, Bug, HelpCircle, BookOpen, Clock,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { CoursesSkeleton } from "./loading-skeleton";
import { variants, variantsStill, stagger, tx, DUR } from "./courses/motion";
import { useCountUp } from "./courses/use-count-up";
import type { CourseListItem, CourseDetail } from "@/types/dashboard";

/* ── Palette ──────────────────────────────────────────── */
const G      = "#10B981";
const G_SOFT = "rgba(16,185,129,0.08)";
const G_LINE = "rgba(16,185,129,0.24)";
const G_DEEP = "#047857";

/* ── Career tracks ────────────────────────────────────────
 * Сопоставление с тегами курсов делается case-insensitive (см.
 * trackCourses ниже). Поэтому в курсе тег "HTML" попадает в трек
 * со списком ["html", ...]. Также есть алиасы для русских тегов
 * ("веб") и для альтернативных коротких форм ("ts", "next").
 */
const TRACKS = [
  {
    id: "frontend",
    title: "Frontend-инженер",
    subtitle: "от языка к production-интерфейсам",
    color: "#06B6D4",
    tags: ["frontend", "react", "html", "css", "ts", "next", "web", "веб", "дизайн", "семантика", "формы"],
  },
  {
    id: "backend",
    title: "Backend-инженер",
    subtitle: "сервисы, БД, распределённые системы",
    color: "#EF4444",
    tags: ["backend", "architecture", "go", "node"],
  },
  {
    id: "data",
    title: "Инженер данных",
    subtitle: "Python, SQL, пайплайны",
    color: "#A78BFA",
    tags: ["data", "python", "sql", "ml", "основы"],
  },
  {
    id: "devops",
    title: "DevOps-инженер",
    subtitle: "инфраструктура и наблюдаемость",
    color: G,
    tags: ["devops", "infra", "docker"],
  },
  {
    id: "all",
    title: "Все курсы",
    subtitle: "каталог без фильтра",
    color: "#F59E0B",
    tags: [] as string[],
  },
];

/* ── Helpers ──────────────────────────────────────────── */
const DIFF: Record<string, { label: string; color: string }> = {
  beginner:     { label: "Начальный",   color: "#10B981" },
  intermediate: { label: "Средний",     color: "#F59E0B" },
  advanced:     { label: "Продвинутый", color: "#EF4444" },
};

const TYPE_ICON: Record<string, React.ReactNode> = {
  code:          <Code         className="size-[11px]" />,
  "fill-blanks": <Puzzle       className="size-[11px]" />,
  "fix-bug":     <Bug          className="size-[11px]" />,
  quiz:          <HelpCircle   className="size-[11px]" />,
};
const TYPE_LABEL: Record<string, string> = {
  code: "Код", "fill-blanks": "Задача", "fix-bug": "Баг", quiz: "Тест",
};

const ICON_COLOR: Record<string, string> = {
  JS: "#FACC15", PY: "#3B82F6", RE: "#06B6D4", TS: "#3B82F6",
  NX: "#ffffff", CS: "#EC4899", SQL: "#F59E0B", GO: "#06B6D4",
  DV: "#10B981", SD: "#EF4444",
};

function deriveIcon(title: string): string {
  const map: Record<string, string> = {
    javascript: "JS", python: "PY", react: "RE",
    typescript: "TS", "next.js": "NX", css: "CS",
    sql: "SQL", " go": "GO", devops: "DV", системный: "SD",
  };
  const lower = title.toLowerCase();
  for (const [k, v] of Object.entries(map)) {
    if (lower.includes(k)) return v;
  }
  return title.slice(0, 2).toUpperCase();
}

function iconColor(ico: string) { return ICON_COLOR[ico] || "#ffffff"; }

function trackCourses(track: typeof TRACKS[0], courses: CourseListItem[]): CourseListItem[] {
  if (track.id === "all") return courses;
  const trackTagsLower = new Set(track.tags.map((t) => t.toLowerCase()));
  return courses.filter((c) =>
    c.tags.some((t) => trackTagsLower.has(t.toLowerCase())),
  );
}

/* ── Primitives ───────────────────────────────────────── */
function Card({ children, className = "", shadow = true, style }: {
  children: React.ReactNode; className?: string; shadow?: boolean; style?: React.CSSProperties;
}) {
  return (
    <div
      className={`bg-[#0F1011] border-2 border-white/[0.07] overflow-hidden ${className}`}
      style={{ boxShadow: shadow ? `4px 4px 0 0 ${G}55` : "none", ...style }}
    >
      {children}
    </div>
  );
}

function Pill({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 border-2 font-mono text-[10px] font-semibold uppercase tracking-[0.15em]"
      style={{ color, borderColor: color + "40", background: color + "12" }}
    >
      {children}
    </span>
  );
}

function IconBadge({ ico, size = 44 }: { ico: string; size?: number }) {
  const c = iconColor(ico);
  return (
    <div
      className="flex items-center justify-center border-2 flex-shrink-0 font-mono font-black"
      style={{
        width: size, height: size,
        color: c, borderColor: c + "40", background: c + "18",
        fontSize: Math.round(size / 3),
      }}
    >
      {ico}
    </div>
  );
}

/* ── Track Rail Item ──────────────────────────────────── */
function TrackRailItem({ track, courses, selected, onSelect }: {
  track: typeof TRACKS[0];
  courses: CourseListItem[];
  selected: boolean;
  onSelect: () => void;
}) {
  const tc = trackCourses(track, courses);
  const progress = tc.length
    ? Math.round(tc.reduce((s, c) => s + c.progress, 0) / tc.length)
    : 0;
  const done = tc.filter((c) => c.progress === 100).length;
  const abbr = track.id === "all" ? "★" : track.id.slice(0, 2).toUpperCase();

  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ x: 2 }}
      transition={tx()}
      className="w-full text-left px-4 py-3 flex items-start gap-3 relative"
      style={{
        background: selected ? "rgba(255,255,255,0.04)" : "transparent",
      }}
    >
      {/* Animated active indicator — slides between selected items */}
      {selected && (
        <motion.span
          layoutId="track-active-indicator"
          className="absolute left-0 top-0 bottom-0 w-[2px]"
          style={{ background: track.color }}
          transition={tx(DUR.fast)}
        />
      )}

      <div
        className="size-9 flex items-center justify-center font-mono text-[11px] font-black flex-shrink-0 border-2 transition-colors"
        style={{
          background: track.color + "18",
          color: track.color,
          borderColor: selected ? track.color : track.color + "40",
        }}
      >
        {abbr}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <div className={`text-[13px] font-semibold truncate ${selected ? "text-white" : "text-white/80"}`}>
            {track.title}
          </div>
          <span
            className="font-mono text-[10px] tabular-nums flex-shrink-0"
            style={{ color: selected ? track.color : "rgba(255,255,255,0.4)" }}
          >
            {progress}%
          </span>
        </div>
        <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.15em] text-white/35 truncate">
          {track.subtitle}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-[3px] bg-white/[0.06] overflow-hidden">
            <motion.div
              className="h-full"
              style={{ background: track.color }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={tx(DUR.slow)}
            />
          </div>
          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/40 tabular-nums flex-shrink-0">
            {done}/{tc.length}
          </span>
        </div>
      </div>
    </motion.button>
  );
}

/* ── Station Row ──────────────────────────────────────── */
function StationRow({ c, n, selected, onSelect, trackColor, isLast }: {
  c: CourseListItem; n: number; selected: boolean;
  onSelect: () => void; trackColor: string; isLast: boolean;
}) {
  const ico = deriveIcon(c.title);
  const d = DIFF[c.difficulty];
  const state = c.progress === 100 ? "done" : c.progress > 0 ? "active" : "todo";
  const nodeBg = state === "done" ? "#10B981" : state === "active" ? G : "#0F1011";
  const nodeFg = state === "done" ? "#042F1E" : state === "active" ? "#0A0A0B" : "rgba(255,255,255,0.5)";
  const nodeBorder = state === "todo" ? "rgba(255,255,255,0.12)" : nodeBg;

  return (
    <div className="relative flex items-stretch">
      {/* Rail column */}
      <div className="relative w-10 flex-shrink-0 flex justify-center">
        {!isLast && (
          <div
            className="absolute top-[34px] bottom-[-18px] w-[2px]"
            style={{
              background: `repeating-linear-gradient(180deg, ${trackColor}55 0 5px, transparent 5px 9px)`,
            }}
          />
        )}
        <div
          className="relative z-10 mt-3 size-8 border-2 flex items-center justify-center font-mono text-[11px] font-black"
          style={{ background: nodeBg, color: nodeFg, borderColor: nodeBorder }}
        >
          {state === "done"
            ? <CheckCircle className="size-[14px]" />
            : String(n).padStart(2, "0")
          }
        </div>
      </div>

      {/* Course card */}
      <motion.button
        onClick={onSelect}
        whileHover={
          selected
            ? { boxShadow: `4px 4px 0 0 ${G}66` }
            : { boxShadow: "3px 3px 0 0 rgba(255,255,255,0.10)", backgroundColor: "rgba(255,255,255,0.04)" }
        }
        transition={tx(DUR.fast)}
        className="flex-1 min-w-0 my-1.5 text-left px-3 py-2.5 border-2 flex items-start gap-2.5"
        style={{
          background: selected ? "rgba(255,255,255,0.04)" : "#0F1011",
          borderColor: selected ? G_LINE : "rgba(255,255,255,0.07)",
          boxShadow: selected ? `3px 3px 0 0 ${G}55` : "none",
        }}
      >
        <IconBadge ico={ico} size={34} />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <div className="text-white/90 text-[13px] font-semibold truncate">{c.title}</div>
            <span
              className="font-mono text-[10px] tabular-nums flex-shrink-0"
              style={{ color: c.progress === 100 ? "#10B981" : G }}
            >
              {c.progress}%
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-white/35">
            {d && <span style={{ color: d.color }}>● {d.label}</span>}
            <span className="text-white/20">·</span>
            <span>{c.lessonsCount} ур.</span>
            <span className="text-white/20">·</span>
            <span>{c.estimatedHours}ч</span>
          </div>
          <div className="mt-1.5 h-[3px] bg-white/[0.06] overflow-hidden">
            <motion.div
              className="h-full"
              style={{
                background: c.progress === 100 ? "#10B981" : `linear-gradient(90deg, ${G}, ${G_DEEP})`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${c.progress}%` }}
              transition={tx(DUR.slow)}
            />
          </div>
        </div>
      </motion.button>
    </div>
  );
}

/* ── Course Spread ────────────────────────────────────── */
function CourseSpread({ courseId, onStart }: { courseId: string; onStart: (id: string) => void }) {
  const { data: course, isLoading } = useSWR<CourseDetail>(`/api/courses/${courseId}`, fetcher);
  // Hooks must come before any early return — useCountUp falls back to 0
  // when no course is loaded yet.
  const progressDisplay = useCountUp(course?.progress ?? 0);

  if (isLoading || !course) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-48 bg-white/[0.03] border-2 border-white/[0.05]" />
        <div className="h-64 bg-white/[0.03] border-2 border-white/[0.05]" />
      </div>
    );
  }

  const d = DIFF[course.difficulty];
  const ico = deriveIcon(course.title);
  const done = course.lessons.filter((l) => l.completed).length;
  const total = course.lessons.length;

  return (
    <div className="space-y-4">
      {/* Hero */}
      <Card>
        <div className="p-6">
          <div className="flex items-start gap-5">
            <IconBadge ico={ico} size={72} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {d && <Pill color={d.color}>{d.label}</Pill>}
                {course.tags.map((t) => <Pill key={t} color="rgba(255,255,255,0.45)">{t}</Pill>)}
              </div>
              <h1 className="text-white text-[26px] font-bold tracking-tight leading-tight">{course.title}</h1>
              <p className="mt-2 text-white/55 text-[14px] leading-relaxed max-w-xl">{course.description}</p>
              <div className="mt-4 flex items-center gap-5 font-mono text-[11px] uppercase tracking-[0.15em] text-white/40">
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen className="size-[13px]" /> {total} уроков
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-[13px]" /> ~{course.progress > 0
                    ? Math.ceil(0) || course.progress
                    : course.progress} ч
                </span>
              </div>
            </div>

            {/* Progress panel */}
            <div className="w-52 flex-shrink-0 border-2 border-white/[0.07] bg-white/[0.015] p-4">
              <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/30">Прогресс</div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-black tabular-nums" style={{ color: G }}>
                  {progressDisplay}
                </span>
                <span className="font-mono text-[14px] text-white/30">%</span>
              </div>
              <div className="mt-2 h-1.5 bg-white/[0.06] overflow-hidden">
                <motion.div
                  className="h-full"
                  style={{ background: `linear-gradient(90deg, ${G}, ${G_DEEP})` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${course.progress}%` }}
                  transition={tx(DUR.slow)}
                />
              </div>
              <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-white/45">
                <span className="text-white/80">{done}</span> / {total} уроков
              </div>
              <motion.button
                onClick={() => onStart(course.id)}
                whileHover={{ x: -2, y: -2, boxShadow: `5px 5px 0 0 ${G}AA` }}
                whileTap={{ x: 0, y: 0, boxShadow: `1px 1px 0 0 ${G}66` }}
                transition={tx(DUR.fast)}
                className="mt-3 w-full py-2.5 font-mono text-[11px] uppercase tracking-[0.15em] font-bold text-black"
                style={{ background: G, boxShadow: `3px 3px 0 0 ${G}66` }}
              >
                {course.progress > 0 ? "Продолжить" : "Начать курс"}
              </motion.button>
            </div>
          </div>
        </div>
      </Card>

      {/* Curriculum */}
      <Card shadow={false}>
        <div className="px-5 pt-4 pb-2 flex items-baseline justify-between">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-white font-bold">Программа</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 mt-1">
              {total} уроков
            </div>
          </div>
          <div className="font-mono text-[10px] tabular-nums uppercase tracking-[0.15em]" style={{ color: G }}>
            {total > 0 ? Math.round((done / total) * 100) : 0}% готово
          </div>
        </div>
        <div className="divide-y-2 divide-white/[0.05]">
          {course.lessons.map((l) => (
            <div
              key={l.id}
              className={`flex items-center gap-4 px-5 py-3 transition-colors ${
                l.isAvailable ? "hover:bg-white/[0.02] cursor-pointer" : "opacity-40"
              }`}
            >
              <div className="size-8 border-2 border-white/[0.08] flex items-center justify-center font-mono text-[11px] text-white/50 tabular-nums flex-shrink-0">
                {String(l.order).padStart(2, "0")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white/85 text-[14px] font-medium truncate">{l.title}</div>
                <div className="mt-0.5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.12em] text-white/35">
                  <span className="inline-flex items-center gap-1">
                    {TYPE_ICON[l.type] ?? <Code className="size-[11px]" />}
                    {" "}{TYPE_LABEL[l.type] ?? l.type}
                  </span>
                  <span className="text-white/20">·</span>
                  <span>{l.language?.toUpperCase()}</span>
                </div>
              </div>
              {l.completed ? (
                <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: "#10B981" }}>
                  <CheckCircle className="size-[14px]" /> Готово
                </div>
              ) : !l.isAvailable ? (
                <Lock className="size-[14px] text-white/25" />
              ) : (
                <div className="size-[14px] border-2 border-white/[0.2] flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ── Main ─────────────────────────────────────────────── */
interface CoursesSectionProps {
  courses: CourseListItem[] | undefined;
  loading: boolean;
  onSelectCourse: (id: string) => void;
}

export function CoursesSection({ courses, loading, onSelectCourse }: CoursesSectionProps) {
  const [trackId, setTrackId] = useState("frontend");
  const [selected, setSelected] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const hasMountedRef = useRef(false);

  const track = TRACKS.find((t) => t.id === trackId) ?? TRACKS[0];

  const tc = useMemo(
    () => (courses ? trackCourses(track, courses) : []),
    [track, courses],
  );

  // When track changes, auto-select first in-progress course (or first)
  useEffect(() => {
    if (!tc.length) return;
    const inProg = tc.find((c) => c.progress > 0 && c.progress < 100);
    setSelected((inProg ?? tc[0]).id);
  }, [trackId, tc.length]);

  // Stat count-up (target=0 until courses load, then animates up to actual)
  const tracksCount    = useCountUp(courses ? TRACKS.length - 1 : 0);
  const coursesCount   = useCountUp(courses?.length ?? 0);
  const completedCount = useCountUp(courses?.filter((c) => c.progress === 100).length ?? 0);

  if (loading || !courses) return <CoursesSkeleton />;

  const effectiveSelected = selected ?? tc[0]?.id ?? courses[0]?.id;
  const trackProgress = tc.length
    ? Math.round(tc.reduce((s, c) => s + c.progress, 0) / tc.length)
    : 0;
  const done = tc.filter((c) => c.progress === 100).length;
  const totalHours = tc.reduce((s, c) => s + c.estimatedHours, 0);

  // Once mounted, hold a flag so HMR / re-renders do not replay the cascade.
  // We can't put this in useEffect because we want it to apply on first render.
  const isFirstMount = !hasMountedRef.current;
  if (isFirstMount) hasMountedRef.current = true;

  // Variant pick — reduced motion swaps everything to a no-op
  const v = (key: keyof typeof variants) => (reduced ? variantsStill : variants[key]);

  return (
    <motion.div
      className="w-full p-1"
      variants={reduced ? undefined : stagger.page}
      initial={isFirstMount ? "hidden" : false}
      animate="show"
    >
      {/* Header */}
      <motion.div
        variants={v("fadeUp")}
        transition={tx()}
        className="flex items-end justify-between mb-4"
      >
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/30">
            Learn · Atlas / Tracks
          </div>
          <h1 className="mt-1 text-white text-[26px] font-bold tracking-tight">Курсы по трекам</h1>
          <p className="mt-1 text-white/50 text-[13px]">
            Выберите карьерный трек — программа курса откроется справа.
          </p>
        </div>
        <div className="flex items-center gap-5 font-mono text-[10px] uppercase tracking-[0.2em]">
          <div>
            <div className="text-white/30">треков</div>
            <div className="text-white text-[22px] font-black tabular-nums leading-none mt-0.5">
              {tracksCount}
            </div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <div className="text-white/30">курсов</div>
            <div className="text-white text-[22px] font-black tabular-nums leading-none mt-0.5">
              {coursesCount}
            </div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <div className="text-white/30">пройдено</div>
            <div
              className="text-[22px] font-black tabular-nums leading-none mt-0.5"
              style={{ color: G }}
            >
              {completedCount}
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3-column grid */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "260px 380px 1fr" }}>
        {/* ── Tracks rail ── */}
        <motion.div variants={v("slideRight")} transition={tx()}>
          <Card shadow={false} className="h-fit">
            <div className="px-4 pt-4 pb-2">
              <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-white font-bold">
                Карьерные треки
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                выберите направление
              </div>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {TRACKS.map((t) => (
                <TrackRailItem
                  key={t.id}
                  track={t}
                  courses={courses}
                  selected={trackId === t.id}
                  onSelect={() => setTrackId(t.id)}
                />
              ))}
            </div>
          </Card>
        </motion.div>

        {/* ── Track stations ── */}
        <motion.div variants={v("fadeUp")} transition={tx()}>
          <Card shadow={false} className="h-fit">
            {/* Track header — cross-fades on track change */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={trackId}
                variants={v("fadeIn")}
                initial="hidden"
                animate="show"
                exit="hidden"
                transition={tx(DUR.fast)}
                className="px-5 py-4 border-b-2 border-white/[0.05]"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="size-10 flex items-center justify-center font-mono text-[13px] font-black flex-shrink-0 border-2"
                    style={{
                      background: track.color + "18",
                      color: track.color,
                      borderColor: track.color + "50",
                    }}
                  >
                    {track.id === "all" ? "★" : track.id.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className="font-mono text-[10px] uppercase tracking-[0.25em]"
                      style={{ color: track.color }}
                    >
                      {track.id === "all" ? "каталог" : "трек"}
                    </div>
                    <h2 className="mt-0.5 text-white text-[18px] font-bold tracking-tight leading-tight">
                      {track.title}
                    </h2>
                    <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">
                      {track.subtitle}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/30">Прогресс</div>
                    <div
                      className="mt-0.5 font-mono text-[20px] font-black tabular-nums leading-none"
                      style={{ color: track.color }}
                    >
                      {trackProgress}
                      <span className="text-[11px] text-white/25">%</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.15em] text-white/45">
                  <span>{tc.length} курсов</span>
                  <span className="text-white/15">·</span>
                  <span style={{ color: "#10B981" }}>{done} завершено</span>
                  <span className="text-white/15">·</span>
                  <span>{totalHours} ч</span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Station list — re-staggers on track change */}
            <div className="px-4 py-2 max-h-[700px] overflow-auto">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={trackId}
                  variants={reduced ? undefined : stagger.list}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                >
                  {tc.length === 0 ? (
                    <div className="py-8 text-center font-mono text-[11px] uppercase tracking-[0.15em] text-white/25">
                      Нет курсов в этом треке
                    </div>
                  ) : (
                    tc.map((c, i) => (
                      <motion.div
                        key={c.id}
                        variants={v("fadeUp")}
                        transition={tx(DUR.fast)}
                      >
                        <StationRow
                          c={c}
                          n={i + 1}
                          selected={c.id === effectiveSelected}
                          onSelect={() => setSelected(c.id)}
                          trackColor={track.color}
                          isLast={i === tc.length - 1}
                        />
                      </motion.div>
                    ))
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </Card>
        </motion.div>

        {/* ── Spread — cross-fades on course change ── */}
        <motion.div variants={v("fadeUp")} transition={tx(DUR.normal, 0.15)}>
          <AnimatePresence mode="wait" initial={false}>
            {effectiveSelected && (
              <motion.div
                key={effectiveSelected}
                variants={v("fadeUp")}
                initial="hidden"
                animate="show"
                exit="hidden"
                transition={tx()}
              >
                <CourseSpread courseId={effectiveSelected} onStart={onSelectCourse} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
