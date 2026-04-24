"use client";

import { ArrowLeft, CheckCircle, Lock, Code, Puzzle, Bug, HelpCircle, Play, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import type { CourseDetail as CourseDetailType } from "@/types/dashboard";

/* ── Constants ───────────────────────────────────────────── */
const G = "#10B981";

const DIFFICULTY_MAP: Record<string, { label: string; hex: string }> = {
  beginner:     { label: "Начальный",   hex: "#34D399" },
  intermediate: { label: "Средний",     hex: "#F59E0B" },
  advanced:     { label: "Продвинутый", hex: "#F87171" },
};

const TYPE_META: Record<string, { short: string; hex: string; icon: React.ReactNode }> = {
  code:          { short: "CODE", hex: "#60A5FA", icon: <Code    style={{ width: 15, height: 15 }} /> },
  "fill-blanks": { short: "FILL", hex: "#C4B5FD", icon: <Puzzle  style={{ width: 15, height: 15 }} /> },
  "fix-bug":     { short: "BUG",  hex: "#F87171", icon: <Bug     style={{ width: 15, height: 15 }} /> },
  quiz:          { short: "QUIZ", hex: "#34D399", icon: <HelpCircle style={{ width: 15, height: 15 }} /> },
};

const LANG_META: Record<string, { label: string; hex: string }> = {
  javascript: { label: "JS", hex: "#F6E05E" },
  python:     { label: "PY", hex: "#60A5FA" },
};

/* ── Mono text helper ────────────────────────────────────── */
const mono: React.CSSProperties = {
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, 'JetBrains Mono', monospace",
};

/* ── Props ───────────────────────────────────────────────── */
interface CourseDetailProps {
  courseId: string;
  onBack: () => void;
}

/* ── Component ───────────────────────────────────────────── */
export function CourseDetail({ courseId, onBack }: CourseDetailProps) {
  const router = useRouter();
  const { data: course, isLoading } = useSWR<CourseDetailType>(`/api/courses/${courseId}`, fetcher);

  /* Loading skeleton */
  if (isLoading || !course) {
    return (
      <div style={{ padding: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            onClick={onBack}
            style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid rgba(255,255,255,0.08)", background: "transparent", color: "rgba(255,255,255,0.5)", cursor: "pointer" }}
          >
            <ArrowLeft style={{ width: 18, height: 18 }} />
          </button>
          <div style={{ height: 14, width: 200, background: "rgba(255,255,255,0.06)", borderRadius: 2 }} />
        </div>
      </div>
    );
  }

  const diff = DIFFICULTY_MAP[course.difficulty] ?? { label: course.difficulty, hex: G };
  const doneCount   = course.lessons.filter(l => l.completed).length;
  const lockedCount = course.lessons.filter(l => !l.isAvailable).length;
  const currentLesson = course.lessons.find(l => !l.completed && l.isAvailable) ?? course.lessons[0];

  /* ── Render ── */
  return (
    <div style={{ background: "#0B0B0C", color: "#EDEDED", fontFamily: '"Inter", system-ui, sans-serif', padding: 40, minHeight: "100%" }}>

      {/* ── Breadcrumb / back ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, ...mono, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
        <button
          onClick={onBack}
          style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid rgba(255,255,255,0.08)", background: "transparent", color: "rgba(255,255,255,0.5)", cursor: "pointer", flexShrink: 0 }}
        >
          <ArrowLeft style={{ width: 18, height: 18 }} />
        </button>
        <span>Обучение</span>
        <span style={{ color: "rgba(255,255,255,0.15)" }}>/</span>
        <span>Курсы</span>
        <span style={{ color: "rgba(255,255,255,0.15)" }}>/</span>
        <span style={{ color: G }}>Досье</span>
        <div style={{ flex: 1 }} />
        <span>№ MC-{course.id.slice(0, 8).toUpperCase()}</span>
      </div>

      {/* ── Hero ── */}
      <div style={{ marginTop: 28, borderTop: "2px solid rgba(255,255,255,0.1)", paddingTop: 28 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 40, alignItems: "end" }}>

          {/* Left: title + description + badges */}
          <div>
            <div style={{ ...mono, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: G }}>
              Досье · курс
            </div>
            <h1 style={{ margin: "14px 0 0", fontFamily: '"Fraunces", Georgia, serif', fontWeight: 300, fontSize: 64, lineHeight: 0.95, letterSpacing: "-0.02em" }}>
              {course.title}
            </h1>
            <p style={{ maxWidth: 620, marginTop: 20, fontSize: 15, lineHeight: 1.65, color: "rgba(255,255,255,0.68)" }}>
              {course.description}
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 20, ...mono, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", border: `1.5px solid ${diff.hex}55`, color: diff.hex, background: `${diff.hex}14` }}>
                {diff.label}
              </span>
              {course.tags.map(t => (
                <span key={t} style={{ padding: "6px 12px", border: "1.5px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.55)" }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right: stat stack */}
          <div style={{ borderLeft: "1px solid rgba(255,255,255,0.08)", paddingLeft: 28, display: "grid", gap: 20 }}>
            {[
              { k: "Уроков",   v: course.lessons.length,  sub: `${doneCount} завершено` },
              { k: "Прогресс", v: `${course.progress}%`,  sub: `${lockedCount} заблокировано`, accent: true },
            ].map(x => (
              <div key={x.k}>
                <div style={{ ...mono, fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>{x.k}</div>
                <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontWeight: 300, fontSize: 44, lineHeight: 1, marginTop: 4, color: x.accent ? G : "#fff" }}>{x.v}</div>
                <div style={{ ...mono, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{x.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 40, marginTop: 52 }}>

        {/* ── LEFT: Curriculum table ── */}
        <div>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ ...mono, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
              § Программа обучения
            </div>
            <div style={{ ...mono, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
              {course.lessons.length} уроков
            </div>
          </div>

          {/* Table */}
          <div style={{ border: "2px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.012)" }}>
            {/* Header row */}
            <div style={{ display: "grid", gridTemplateColumns: "44px 32px 1fr 68px 56px 28px", alignItems: "center", gap: 14, padding: "10px 16px", ...mono, fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)" }}>
              <span>№</span>
              <span />
              <span>Урок</span>
              <span>Тип</span>
              <span>Язык</span>
              <span />
            </div>

            {/* Lesson rows */}
            {course.lessons.map(l => {
              const t = TYPE_META[l.type] ?? { short: l.type.toUpperCase(), hex: "rgba(255,255,255,0.4)", icon: null };
              const lang = LANG_META[l.language] ?? { label: l.language.slice(0, 3).toUpperCase(), hex: "rgba(255,255,255,0.4)" };
              const isCurrent = l.id === currentLesson?.id;
              const locked = !l.isAvailable;

              return (
                <div
                  key={l.id}
                  onClick={() => !locked && router.push(`/lesson/${l.id}`)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "44px 32px 1fr 68px 56px 28px",
                    alignItems: "center",
                    gap: 14,
                    padding: "12px 16px",
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    background: isCurrent ? `${G}0D` : "transparent",
                    opacity: locked ? 0.42 : 1,
                    cursor: locked ? "default" : "pointer",
                    position: "relative",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => { if (!locked) (e.currentTarget as HTMLDivElement).style.background = isCurrent ? `${G}18` : "rgba(255,255,255,0.025)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = isCurrent ? `${G}0D` : "transparent"; }}
                >
                  {/* Active left bar */}
                  {isCurrent && (
                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: G }} />
                  )}

                  {/* № */}
                  <span style={{ ...mono, fontSize: 11, letterSpacing: "0.1em", color: "rgba(255,255,255,0.38)" }}>
                    {String(l.order).padStart(2, "0")}
                  </span>

                  {/* Status icon */}
                  <span style={{ color: l.completed ? G : locked ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.5)", display: "flex" }}>
                    {l.completed
                      ? <CheckCircle style={{ width: 16, height: 16 }} />
                      : locked
                        ? <Lock style={{ width: 14, height: 14 }} />
                        : t.icon}
                  </span>

                  {/* Title */}
                  <span style={{ fontSize: 14, color: isCurrent ? "#fff" : l.completed ? "rgba(255,255,255,0.52)" : "rgba(255,255,255,0.88)", fontWeight: isCurrent ? 500 : 400, textDecoration: l.completed ? "line-through" : "none", textDecorationColor: "rgba(255,255,255,0.15)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {l.title}
                  </span>

                  {/* Type */}
                  <span style={{ ...mono, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: t.hex }}>
                    {t.short}
                  </span>

                  {/* Language */}
                  <span style={{ ...mono, fontSize: 10, letterSpacing: "0.15em", color: lang.hex }}>
                    {lang.label}
                  </span>

                  {/* Arrow */}
                  <span style={{ color: isCurrent ? G : "rgba(255,255,255,0.18)", display: "flex", justifyContent: "flex-end" }}>
                    {isCurrent
                      ? <Play style={{ width: 14, height: 14 }} />
                      : <ChevronRight style={{ width: 14, height: 14 }} />}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT: Status report ── */}
        <div style={{ display: "grid", gap: 18, alignContent: "start", position: "sticky", top: 20 }}>

          {/* Status report card */}
          <div style={{ border: `2px solid ${G}44`, background: `${G}0D`, padding: 22 }}>
            <div style={{ ...mono, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: G, marginBottom: 12 }}>
              ● ОТЧЁТ О СТАТУСЕ
            </div>

            {/* Big progress number */}
            <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontWeight: 300, fontSize: 68, lineHeight: 1, color: "#fff" }}>
              {course.progress}
              <span style={{ fontSize: 36, color: "rgba(255,255,255,0.35)" }}>%</span>
            </div>
            <div style={{ ...mono, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginTop: 4 }}>
              {doneCount} из {course.lessons.length} уроков
            </div>

            {/* Dashed progress bars */}
            <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: `repeat(${Math.min(course.lessons.length, 14)}, 1fr)`, gap: 3 }}>
              {course.lessons.map(l => {
                const isCur = l.id === currentLesson?.id;
                return (
                  <div key={l.id} style={{
                    height: 10,
                    background: l.completed ? G : isCur ? G : !l.isAvailable ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.12)",
                    opacity: isCur ? 0.55 : 1,
                    outline: isCur ? `1.5px solid ${G}` : "none",
                    outlineOffset: isCur ? 2 : 0,
                  }} />
                );
              })}
            </div>

            {/* CTA button */}
            <button
              onClick={() => {
                const next = course.lessons.find(l => !l.completed && l.isAvailable);
                if (next) router.push(`/lesson/${next.id}`);
              }}
              style={{
                width: "100%", marginTop: 22, height: 48,
                background: G, color: "#0B0B0C", border: "2px solid #0B0B0C",
                ...mono, fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
                boxShadow: `3px 3px 0 0 ${G}CC`,
                cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "transform 0.1s, box-shadow 0.1s",
              }}
              onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.transform = "translate(2px,2px)"; b.style.boxShadow = `1px 1px 0 0 ${G}CC`; }}
              onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.transform = ""; b.style.boxShadow = `3px 3px 0 0 ${G}CC`; }}
            >
              <Play style={{ width: 14, height: 14 }} />
              {course.progress > 0 ? "Продолжить" : "Начать курс"}
              {currentLesson && (
                <span style={{ opacity: 0.7 }}>· {String(currentLesson.order).padStart(2, "0")}</span>
              )}
            </button>
          </div>

          {/* Next lesson card */}
          {currentLesson && (
            <div
              onClick={() => router.push(`/lesson/${currentLesson.id}`)}
              style={{ border: "2px solid rgba(255,255,255,0.08)", padding: 18, cursor: "pointer" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${G}44`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)"; }}
            >
              <div style={{ ...mono, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
                Следующий урок
              </div>
              <div style={{ marginTop: 10, fontFamily: '"Fraunces", Georgia, serif', fontWeight: 300, fontSize: 20, lineHeight: 1.2, color: "#fff" }}>
                {currentLesson.title}
              </div>
              <div style={{ marginTop: 10, display: "flex", gap: 10, ...mono, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>
                {(() => {
                  const t = TYPE_META[currentLesson.type];
                  const lang = LANG_META[currentLesson.language];
                  return (
                    <>
                      {t && <span style={{ color: t.hex }}>{t.short}</span>}
                      {t && lang && <span>·</span>}
                      {lang && <span style={{ color: lang.hex }}>{lang.label}</span>}
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Meta */}
          <div style={{ ...mono, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", display: "grid", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Уровень</span>
              <span style={{ color: DIFFICULTY_MAP[course.difficulty]?.hex ?? "rgba(255,255,255,0.7)" }}>
                {DIFFICULTY_MAP[course.difficulty]?.label ?? course.difficulty}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Уроков</span>
              <span style={{ color: "rgba(255,255,255,0.7)" }}>{course.lessons.length}</span>
            </div>
            {course.tags.length > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Теги</span>
                <span style={{ color: "rgba(255,255,255,0.7)" }}>{course.tags.join(", ")}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
