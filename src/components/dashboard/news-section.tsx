"use client";

import { useState, useCallback } from "react";
import {
  RefreshCw, Calendar, Bell, Pin, ArrowRight,
  ArrowLeft, Clock, Link as LinkIcon, Check, Search,
  Share2, Bookmark, Sparkles,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { NewsSkeleton } from "./loading-skeleton";
import type { NewsItem } from "@/types/dashboard";

/* ── Palette ──────────────────────────────────────────── */
const G      = "#10B981";
const G_SOFT = "rgba(16,185,129,0.09)";
const G_LINE = "rgba(16,185,129,0.28)";

type CatKey = "Обновление" | "Событие" | "Объявление";

const CATEGORY_HEX: Record<CatKey, { main: string; soft: string; line: string; label: string }> = {
  "Обновление": { main: "#60A5FA", soft: "rgba(96,165,250,0.10)",  line: "rgba(96,165,250,0.28)",  label: "UPD" },
  "Событие":    { main: "#34D399", soft: "rgba(52,211,153,0.10)",  line: "rgba(52,211,153,0.28)",  label: "EVT" },
  "Объявление": { main: "#C4B5FD", soft: "rgba(196,181,253,0.10)", line: "rgba(196,181,253,0.30)", label: "NTC" },
};

/* ── Date helpers ─────────────────────────────────────── */
function relativeDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const diff = Math.floor((now.getTime() - date.getTime()) / 86400000);
  if (diff === 0) return "Сегодня";
  if (diff === 1) return "Вчера";
  if (diff < 7)  return `${diff} дн. назад`;
  if (diff < 14) return "1 нед. назад";
  if (diff < 30) return `${Math.floor(diff / 7)} нед. назад`;
  return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" });
}

function monthShort(dateStr: string): string {
  return new Date(dateStr + "T00:00:00")
    .toLocaleDateString("ru-RU", { month: "short" })
    .replace(".", "")
    .toUpperCase();
}

function dayNum(dateStr: string): string {
  return String(new Date(dateStr + "T00:00:00").getDate()).padStart(2, "0");
}

function readMin(body: string): number {
  return Math.max(1, Math.ceil(body.trim().split(/\s+/).length / 200));
}

function extractHighlights(body: string, summary: string): string[] {
  const bullets = body
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("- ") || l.startsWith("* "))
    .map((l) => l.replace(/^[-*]\s+/, "").trim())
    .filter(Boolean)
    .slice(0, 4);
  if (bullets.length > 0) return bullets;
  // Fallback: split summary into fragments
  return summary
    .split(/[.,;]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 8)
    .slice(0, 3);
}

/* ── Category icon ────────────────────────────────────── */
function CategoryIcon({ cat, className, style }: { cat: string; className?: string; style?: React.CSSProperties }) {
  if (cat === "Обновление") return <RefreshCw className={className} style={style} />;
  if (cat === "Событие")    return <Calendar  className={className} style={style} />;
  return <Bell className={className} style={style} />;
}

/* ── Category Pill ────────────────────────────────────── */
function CategoryPill({ cat, small }: { cat: string; small?: boolean }) {
  const c = CATEGORY_HEX[cat as CatKey];
  if (!c) return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase font-semibold border-2 ${
        small ? "text-[9px] tracking-[0.2em] px-2 py-0.5" : "text-[10px] tracking-[0.18em] px-2.5 py-1"
      }`}
      style={{ color: c.main, background: c.soft, borderColor: c.line }}
    >
      <CategoryIcon cat={cat} className="size-[11px]" />
      {cat}
    </span>
  );
}

/* ── Date Marker ──────────────────────────────────────── */
function DateMarker({ date, first, last, cat }: {
  date: string; first: boolean; last: boolean; cat: string;
}) {
  const c = CATEGORY_HEX[cat as CatKey] ?? { main: G, soft: G_SOFT, line: G_LINE };
  return (
    <div className="relative flex flex-col items-center w-[88px] flex-shrink-0">
      {!first && (
        <div className="absolute top-0 bottom-1/2 w-[2px]" style={{ background: "rgba(255,255,255,0.08)" }} />
      )}
      {!last && (
        <div className="absolute top-1/2 bottom-0 w-[2px]" style={{ background: "rgba(255,255,255,0.08)" }} />
      )}
      {/* Date chip */}
      <div
        className="relative z-10 bg-[#0A0A0B] border-2 border-white/15 px-2.5 py-1.5 text-center"
        style={{ boxShadow: `3px 3px 0 ${c.main}` }}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50 leading-none">
          {monthShort(date)}
        </div>
        <div className="font-mono text-[24px] font-bold tabular-nums text-white leading-none mt-1">
          {dayNum(date)}
        </div>
      </div>
      {/* Connector dot */}
      <div
        className="relative z-10 w-[10px] h-[10px] mt-1.5 border-2 border-white/20"
        style={{ background: c.main }}
      />
    </div>
  );
}

/* ── Timeline Card ────────────────────────────────────── */
function TimelineCard({ n, first, last, onRead }: {
  n: NewsItem; first: boolean; last: boolean; onRead: (n: NewsItem) => void;
}) {
  const c = CATEGORY_HEX[n.category as CatKey] ?? { main: G, soft: G_SOFT, line: G_LINE, label: "NWS" };
  const highlights = extractHighlights(n.body, n.summary);
  const commitHash = n.id.toUpperCase() + "·" + n.date.replace(/-/g, "").slice(2);
  const mins = readMin(n.body);

  return (
    <div className="flex gap-6 pb-8">
      <DateMarker date={n.date} first={first} last={last} cat={n.category} />

      <article
        className="flex-1 min-w-0 border-2 transition"
        style={{
          background: "#14141A",
          borderColor: n.pinned ? G_LINE : "rgba(255,255,255,0.08)",
          boxShadow: n.pinned ? `6px 6px 0 #047857` : "3px 3px 0 rgba(255,255,255,0.04)",
        }}
      >
        {/* Commit header */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.08] bg-black/30">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: c.main }}>
            commit
          </span>
          <span className="font-mono text-[11px] text-white/45 tabular-nums truncate">{commitHash}</span>
          <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.22em] text-white/35 flex-shrink-0">
            {relativeDate(n.date)} · MavenCode
          </span>
        </div>

        <div className="grid grid-cols-[1fr_auto]">
          {/* Body */}
          <div className="px-5 py-4 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <CategoryPill cat={n.category} />
              {n.pinned && (
                <span
                  className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.2em] font-semibold px-2 py-1 border-2"
                  style={{ color: G, background: G_SOFT, borderColor: G_LINE }}
                >
                  <Pin className="size-[11px] fill-current opacity-70" />
                  закреплено
                </span>
              )}
              <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.22em] text-white/35 flex items-center gap-1">
                <Clock className="size-[11px]" />
                {mins} мин
              </span>
            </div>

            <h3
              className="text-white font-bold leading-[1.15] mb-2"
              style={{ fontSize: 20, letterSpacing: "-0.015em" }}
            >
              {n.title}
            </h3>
            <p className="text-white/55 text-[13.5px] leading-[1.55] mb-3">{n.summary}</p>

            {/* Diff-like highlights */}
            {highlights.length > 0 && (
              <div className="border-l-2 pl-3 space-y-1 mb-3" style={{ borderColor: c.line }}>
                {highlights.map((h, i) => (
                  <div key={i} className="flex items-baseline gap-2 font-mono text-[12px] leading-[1.5]">
                    <span className="tabular-nums text-white/25 w-5 text-right">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span style={{ color: c.main }}>+</span>
                    <span className="text-white/80">{h}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3 pt-2 border-t border-white/[0.06]">
              <button
                onClick={() => onRead(n)}
                className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] font-bold px-2.5 py-1 border-2 transition hover:opacity-80"
                style={{ color: G, borderColor: G_LINE, background: G_SOFT }}
              >
                читать <ArrowRight className="size-[11px]" />
              </button>
              <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.22em] text-white/25">
                #{n.id}
              </span>
            </div>
          </div>

          {/* Mini cover */}
          <div
            className="w-[120px] border-l-2 border-white/[0.05] grid place-items-center relative overflow-hidden"
            style={{ background: c.soft }}
          >
            {n.imageUrl ? (
              <img
                src={n.imageUrl} alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale"
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `repeating-linear-gradient(45deg, ${c.main}12 0 2px, transparent 2px 8px)`,
                }}
              />
            )}
            <div className="relative z-10 text-center">
              <CategoryIcon cat={n.category} className="size-6 mx-auto" style={{ color: c.main } as React.CSSProperties} />
              <div
                className="font-mono text-[10px] uppercase tracking-[0.25em] mt-1.5 font-bold"
                style={{ color: c.main }}
              >
                {c.label}
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

/* ── Main ─────────────────────────────────────────────── */
interface NewsSectionProps {
  news: NewsItem[] | undefined;
  loading: boolean;
  selectedNews: NewsItem | null;
  onSelectNews: (item: NewsItem) => void;
  onBack: () => void;
}

export function NewsSection({ news, loading, selectedNews, onSelectNews, onBack }: NewsSectionProps) {
  const [activeFilter, setActiveFilter] = useState("Все");
  const [search, setSearch] = useState("");

  if (selectedNews) {
    return <NewsDetailView item={selectedNews} allNews={news} onBack={onBack} onSelectNews={onSelectNews} />;
  }

  if (loading || !news) return <NewsSkeleton />;

  const counts: Record<string, number> = { "Все": news.length };
  Object.keys(CATEGORY_HEX).forEach((k) => { counts[k] = news.filter((n) => n.category === k).length; });

  const filtered = news.filter((n) => {
    if (activeFilter !== "Все" && n.category !== activeFilter) return false;
    if (search && !n.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="w-full">
      <div className="max-w-[1100px] mx-auto px-2 pt-2 pb-16">

        {/* Header */}
        <div className="flex items-end justify-between pb-5 border-b-2 border-white/10 mb-2">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] font-bold mb-2" style={{ color: G }}>
              /news · changelog
            </div>
            <h1 className="text-white font-black leading-none" style={{ fontSize: 52, letterSpacing: "-0.035em" }}>
              Новости<span style={{ color: G }}>.</span>
            </h1>
            <p className="mt-2 text-white/45 text-[14px] max-w-lg leading-[1.5]">
              Хроника обновлений, событий и объявлений MavenCode. Лента в порядке публикации — как git log платформы.
            </p>
          </div>
          <div className="text-right">
            <div className="font-mono text-[52px] font-black leading-none tabular-nums text-white/10">
              {String(news.length).padStart(2, "0")}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/35 mt-1">
              всего записей
            </div>
          </div>
        </div>

        {/* Filter strip */}
        <div className="flex items-center gap-2 py-4 border-b border-white/[0.08] flex-wrap">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/35 mr-1">filter</span>
          {["Все", ...Object.keys(CATEGORY_HEX)].map((cat) => {
            const active = activeFilter === cat;
            const c = CATEGORY_HEX[cat as CatKey];
            const n = counts[cat] ?? 0;
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] font-semibold px-3 py-1.5 border-2 transition ${
                  active ? "" : "text-white/50 hover:text-white/80"
                }`}
                style={active
                  ? { background: c?.soft ?? G_SOFT, borderColor: c?.line ?? G_LINE, color: c?.main ?? G }
                  : { borderColor: "rgba(255,255,255,0.08)", background: "transparent" }}
              >
                {cat}
                <span className="opacity-50 tabular-nums">{n}</span>
              </button>
            );
          })}
          <div className="ml-auto flex items-center gap-2 border-2 border-white/10 px-3 py-1.5 min-w-[220px]">
            <Search className="size-3 text-white/40 flex-shrink-0" />
            <input
              className="bg-transparent outline-none font-mono text-[11px] uppercase tracking-[0.18em] text-white/80 placeholder:text-white/30 flex-1"
              placeholder="поиск по хронике..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Year kicker */}
        <div className="mt-7 mb-3 flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color: G }}>
            {new Date().getFullYear()} · Q{Math.ceil((new Date().getMonth() + 1) / 3)}
          </span>
          <div className="flex-1 h-px bg-white/[0.08]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/30">обновления платформы</span>
        </div>

        {/* Timeline */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="size-14 border-2 border-white/[0.05] flex items-center justify-center mb-4">
              <Search className="size-6 text-white/15" />
            </div>
            <p className="font-mono text-white/35 text-sm uppercase tracking-[0.15em]">Нет новостей по запросу</p>
          </div>
        ) : (
          <div>
            {filtered.map((n, i) => (
              <TimelineCard
                key={n.id}
                n={n}
                first={i === 0}
                last={i === filtered.length - 1}
                onRead={onSelectNews}
              />
            ))}
          </div>
        )}

        {/* End marker */}
        <div className="mt-2 ml-[44px] flex items-center gap-4 text-white/30">
          <div className="w-[10px] h-[10px] border-2 border-white/30" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em]">
            начало хроники · MavenCode v1.0
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Markdown components ──────────────────────────────── */
const mdComponents = {
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="font-mono text-lg font-bold uppercase tracking-[0.2em] text-white mt-8 mb-3">{children}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="font-mono text-base font-bold uppercase tracking-[0.15em] text-white/80 mt-6 mb-2">{children}</h3>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="text-white/65 text-sm leading-[1.85] mb-4">{children}</p>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="text-white/90 font-semibold">{children}</strong>
  ),
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a href={href} className="text-[#10B981] hover:text-[#047857] underline underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer">{children}</a>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="text-white/65 text-sm leading-[1.85] space-y-2 ml-1 mb-4 list-none">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="text-white/65 text-sm leading-[1.85] space-y-2 ml-1 mb-4 list-decimal list-inside">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="flex items-start gap-2.5">
      <span className="mt-[10px] w-1 h-1 bg-[#10B981]/60 shrink-0" />
      <span className="flex-1">{children}</span>
    </li>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="border-l-2 border-[#10B981]/40 pl-4 my-4 text-white/50 italic">{children}</blockquote>
  ),
  code: ({ className, children }: { className?: string; children?: React.ReactNode }) => {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      return (
        <code className="block bg-white/[0.04] border-2 border-white/[0.07] p-4 text-sm text-white/70 font-mono overflow-x-auto my-4">
          {children}
        </code>
      );
    }
    return <code className="bg-white/[0.06] text-[#10B981] px-1.5 py-0.5 text-sm font-mono">{children}</code>;
  },
  pre: ({ children }: { children?: React.ReactNode }) => <div className="my-4">{children}</div>,
  hr: () => <hr className="border-white/[0.07] my-6" />,
};

/* ── V1 Dossier markdown components — Fraunces serif, monospace § headings ── */
const dossierMd = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 style={{ fontFamily: '"Fraunces", Georgia, serif', fontWeight: 300, fontSize: 38, lineHeight: 1.05, letterSpacing: "-0.02em", margin: "0 0 18px", color: "#fff" }}>
      {children}
    </h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="font-mono" style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: G, margin: "32px 0 12px" }}>
      § {children}
    </h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 style={{ fontFamily: '"Fraunces", Georgia, serif', fontWeight: 400, fontSize: 24, margin: "24px 0 10px", color: "#fff" }}>
      {children}
    </h3>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p style={{ margin: "0 0 16px", fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,0.78)" } as React.CSSProperties}>
      {children}
    </p>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong style={{ color: "#fff", fontWeight: 600 }}>{children}</strong>
  ),
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a href={href} style={{ color: G, textDecoration: "underline", textUnderlineOffset: 2 }} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul style={{ margin: "0 0 18px", padding: 0, listStyle: "none", display: "grid", gap: 8 }}>{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol style={{ margin: "0 0 18px", padding: 0, listStyle: "none", display: "grid", gap: 10 }}>{children}</ol>
  ),
  li: ({ children, ...rest }: { children?: React.ReactNode; ordered?: boolean; index?: number }) => {
    const ordered = (rest as { ordered?: boolean }).ordered;
    if (ordered) {
      return (
        <li style={{ display: "grid", gridTemplateColumns: "32px 1fr", gap: 14, fontSize: 16, lineHeight: 1.6, color: "rgba(255,255,255,0.8)" }}>
          <span className="font-mono" style={{ fontSize: 11, letterSpacing: "0.18em", color: G, border: `1.5px solid ${G_LINE}`, background: G_SOFT, width: 28, height: 28, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            ●
          </span>
          <span>{children}</span>
        </li>
      );
    }
    return (
      <li style={{ display: "flex", gap: 12, fontSize: 16, lineHeight: 1.6, color: "rgba(255,255,255,0.78)" }}>
        <span style={{ marginTop: 10, width: 6, height: 6, background: G, flexShrink: 0 }} />
        <span>{children}</span>
      </li>
    );
  },
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote style={{ margin: "20px 0", padding: "16px 20px", borderLeft: `3px solid ${G}`, background: G_SOFT, fontSize: 16, lineHeight: 1.6, color: "rgba(255,255,255,0.85)", fontStyle: "italic" }}>
      {children}
    </blockquote>
  ),
  code: ({ className, children }: { className?: string; children?: React.ReactNode }) => {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      return (
        <pre className="custom-scrollbar" style={{ margin: "16px 0", padding: 14, background: "#0E0E10", border: "1.5px solid rgba(255,255,255,0.06)", overflow: "auto", fontSize: 13 }}>
          <code className="font-mono" style={{ color: "rgba(251,191,36,0.85)" }}>{children}</code>
        </pre>
      );
    }
    return (
      <code className="font-mono" style={{ color: G, background: G_SOFT, border: `1px solid ${G_LINE}`, padding: "1px 6px", fontSize: "0.86em" }}>
        {children}
      </code>
    );
  },
  pre: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  hr: () => <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.07)", margin: "24px 0" }} />,
};

/* ── Detail View — V1 Dossier (no author card) ──────────────────────────── */
function NewsDetailView({ item, allNews, onBack, onSelectNews }: {
  item: NewsItem;
  allNews: NewsItem[] | undefined;
  onBack: () => void;
  onSelectNews: (n: NewsItem) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const c = CATEGORY_HEX[item.category as CatKey] ?? { main: G, soft: G_SOFT, line: G_LINE, label: "NWS" };
  const minutes = readMin(item.body);
  const wordCount = item.body.split(/\s+/).filter(Boolean).length;
  const highlights = extractHighlights(item.body, item.summary);

  const sorted = allNews ?? [];
  const related = sorted.filter((n) => n.id !== item.id).slice(0, 3);

  const handleCopyLink = useCallback(() => {
    const url = `${window.location.origin}/dashboard?news=${item.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [item.id]);

  const handleShare = useCallback(() => {
    const url = `${window.location.origin}/dashboard?news=${item.id}`;
    if (navigator.share) {
      navigator.share({ title: item.title, url }).catch(() => {});
    } else {
      handleCopyLink();
    }
  }, [item.id, item.title, handleCopyLink]);

  const dateDisplay = item.date.replace(/-/g, ".");
  const titleParts = item.title.split(":");
  const titleMain = titleParts[0];
  const titleTail = titleParts.slice(1).join(":").trim();

  const stats: { k: string; v: string; accent?: boolean }[] = [
    { k: "ID", v: item.id.toUpperCase() },
    { k: "RUBRIC", v: c.label },
    { k: "DATE", v: dateDisplay },
    { k: "READ", v: `~${minutes} MIN` },
    { k: "WORDS", v: String(wordCount) },
    { k: "STATUS", v: item.pinned ? "PINNED" : "PUBLISHED", accent: item.pinned },
  ];

  return (
    <div
      style={{
        background: "#0A0A0B",
        color: "#fff",
        fontFamily: "'Inter', system-ui, sans-serif",
        padding: "32px 56px 64px",
      }}
      className="dossier-news"
    >
      {/* TOP BAR */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: 18,
          borderBottom: "2px solid rgba(255,255,255,0.08)",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <button
          onClick={onBack}
          className="font-mono"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 10,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
            background: "transparent",
            border: 0,
            cursor: "pointer",
          }}
        >
          <ArrowLeft size={14} />
          <span>← К хронике</span>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
          <span style={{ color: G }}>news</span>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
          <span>{item.id}</span>
        </button>

        <div style={{ display: "flex", gap: 8 }}>
          <ActionButton onClick={handleShare} icon={<Share2 size={12} />} label="share" />
          <ActionButton
            onClick={() => setBookmarked((b) => !b)}
            icon={<Bookmark size={12} fill={bookmarked ? G : "none"} stroke={bookmarked ? G : "currentColor"} />}
            label="bookmark"
            on={bookmarked}
          />
          <ActionButton
            onClick={handleCopyLink}
            icon={copied ? <Check size={12} /> : <LinkIcon size={12} />}
            label={copied ? "copied" : "copy link"}
            on={copied}
          />
        </div>
      </div>

      {/* HERO */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "180px 1fr",
          gap: 32,
          paddingTop: 28,
          paddingBottom: 32,
          borderBottom: "2px solid rgba(255,255,255,0.08)",
        }}
        className="dossier-hero"
      >
        {/* Left rail — date stamp + category */}
        <div>
          <div
            style={{
              background: "#14141A",
              border: "2px solid rgba(255,255,255,0.1)",
              boxShadow: `6px 6px 0 #047857`,
              padding: "16px 14px",
              textAlign: "center",
            }}
          >
            <div className="font-mono" style={{ fontSize: 10, letterSpacing: "0.28em", color: "rgba(255,255,255,0.4)" }}>
              {monthShort(item.date)}
            </div>
            <div
              style={{
                fontFamily: '"Fraunces", Georgia, serif',
                fontSize: 56,
                fontWeight: 300,
                lineHeight: 1,
                color: "#fff",
                margin: "6px 0",
              }}
            >
              {dayNum(item.date)}
            </div>
            <div className="font-mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: G }}>
              {new Date(item.date + "T00:00:00").getFullYear()}
            </div>
          </div>

          <div
            className="font-mono"
            style={{
              marginTop: 14,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              border: `2px solid ${c.line}`,
              background: c.soft,
              color: c.main,
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            <CategoryIcon cat={item.category} className="size-[11px]" />
            {item.category}
          </div>

          {item.pinned && (
            <div
              className="font-mono"
              style={{
                marginTop: 8,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                border: `2px solid ${G_LINE}`,
                background: G_SOFT,
                color: G,
                fontSize: 10,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              <Pin size={11} /> Закреплено
            </div>
          )}
        </div>

        {/* Title block (no author) */}
        <div>
          <div
            className="font-mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: G,
              fontWeight: 700,
              marginBottom: 14,
            }}
          >
            /news · dossier #{item.id.toUpperCase()}
          </div>
          <h1
            style={{
              fontFamily: '"Fraunces", Georgia, serif',
              fontWeight: 300,
              fontSize: 64,
              lineHeight: 1.02,
              letterSpacing: "-0.025em",
              margin: "0 0 18px",
              color: "#fff",
            }}
          >
            {titleMain}
            {titleTail && <span style={{ color: G }}>:</span>}
            {titleTail && (
              <span style={{ display: "block", color: "rgba(255,255,255,0.65)", fontStyle: "italic", fontSize: 56 }}>
                {titleTail}
              </span>
            )}
          </h1>
          <p
            style={
              {
                fontSize: 18,
                lineHeight: 1.55,
                color: "rgba(255,255,255,0.62)",
                maxWidth: 720,
                margin: "0 0 22px",
                textWrap: "pretty",
              } as React.CSSProperties
            }
          >
            {item.summary}
          </p>
          <div
            className="font-mono"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Clock size={11} />~{minutes} мин
            </span>
            <span>·</span>
            <span>{relativeDate(item.date)}</span>
          </div>
        </div>
      </div>

      {/* SUB STATS BAR */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          borderBottom: "2px solid rgba(255,255,255,0.08)",
          marginBottom: 32,
        }}
        className="dossier-stats"
      >
        {stats.map((s, i) => (
          <div
            key={s.k}
            style={{
              padding: "14px 18px",
              borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
            }}
          >
            <div
              className="font-mono"
              style={{ fontSize: 10, letterSpacing: "0.28em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}
            >
              {s.k}
            </div>
            <div
              className="font-mono"
              style={{
                fontSize: 14,
                color: s.accent ? G : "#fff",
                marginTop: 6,
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}
            >
              {s.v}
            </div>
          </div>
        ))}
      </div>

      {/* MAIN GRID */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 48 }}
        className="dossier-grid"
      >
        {/* Article */}
        <article>
          {/* Cover plate */}
          <div
            style={{
              height: 220,
              background: `linear-gradient(135deg, #04785733 0%, #0A0A0B 70%)`,
              border: "2px solid rgba(255,255,255,0.08)",
              marginBottom: 32,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt=""
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }}
              />
            ) : (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `repeating-linear-gradient(45deg, ${G}10 0 2px, transparent 2px 14px)`,
                }}
              />
            )}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: 22,
              }}
            >
              <div
                className="font-mono"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 10,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                <span>fig. 01 · {item.id}</span>
                <span>{c.label}</span>
              </div>
              {!item.imageUrl && (
                <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                  <div
                    style={{
                      width: 88,
                      height: 88,
                      border: `2px solid ${G_LINE}`,
                      background: G_SOFT,
                      display: "grid",
                      placeItems: "center",
                      color: G,
                    }}
                  >
                    <Sparkles size={42} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: '"Fraunces", Georgia, serif',
                        fontStyle: "italic",
                        fontSize: 28,
                        lineHeight: 1.1,
                        color: "#fff",
                      }}
                    >
                      {item.title}
                    </div>
                    <div
                      className="font-mono"
                      style={{
                        fontSize: 11,
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.55)",
                        marginTop: 6,
                      }}
                    >
                      {c.label} · {dateDisplay}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Article body */}
          <div className="dossier-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={dossierMd as never}>
              {item.body}
            </ReactMarkdown>
          </div>
        </article>

        {/* Aside (no author card) */}
        <aside>
          <div style={{ position: "sticky", top: 24, display: "grid", gap: 20 }}>
            {/* Highlights */}
            {highlights.length > 0 && (
              <div style={{ background: "#0F1011", border: "2px solid rgba(255,255,255,0.08)" }}>
                <div
                  className="font-mono"
                  style={{
                    padding: "10px 14px",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 10,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                  }}
                >
                  <span style={{ color: G, fontWeight: 700 }}>tl;dr</span>
                  <span style={{ color: "rgba(255,255,255,0.35)" }}>
                    {highlights.length} {highlights.length === 1 ? "пункт" : highlights.length < 5 ? "пункта" : "пунктов"}
                  </span>
                </div>
                <div style={{ padding: "14px 16px" }}>
                  {highlights.map((h, i) => (
                    <div
                      key={i}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "26px 1fr",
                        gap: 10,
                        padding: "8px 0",
                        borderBottom:
                          i < highlights.length - 1 ? "1px dashed rgba(255,255,255,0.06)" : "none",
                      }}
                    >
                      <span
                        className="font-mono"
                        style={{
                          fontSize: 10,
                          letterSpacing: "0.18em",
                          color: G,
                          fontWeight: 700,
                          textAlign: "right",
                        }}
                      >
                        +{String(i + 1).padStart(2, "0")}
                      </span>
                      <span style={{ fontSize: 13, lineHeight: 1.5, color: "rgba(255,255,255,0.78)" }}>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related */}
            {related.length > 0 && (
              <div style={{ background: "#0F1011", border: "2px solid rgba(255,255,255,0.08)" }}>
                <div
                  className="font-mono"
                  style={{
                    padding: "10px 14px",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    fontSize: 10,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.55)",
                  }}
                >
                  связанные записи
                </div>
                <div>
                  {related.map((r, i) => {
                    const rc = CATEGORY_HEX[r.category as CatKey] ?? { main: G, soft: G_SOFT, line: G_LINE, label: "NWS" };
                    return (
                      <button
                        key={r.id}
                        onClick={() => onSelectNews(r)}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          background: "transparent",
                          padding: "12px 14px",
                          borderTop: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
                          borderLeft: 0,
                          borderRight: 0,
                          borderBottom: 0,
                          display: "grid",
                          gap: 6,
                          cursor: "pointer",
                        }}
                        className="hover:bg-white/[0.03] transition-colors"
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span
                            className="font-mono"
                            style={{
                              fontSize: 9,
                              letterSpacing: "0.22em",
                              color: rc.main,
                              fontWeight: 700,
                              padding: "2px 6px",
                              border: `1.5px solid ${rc.line}`,
                              background: rc.soft,
                            }}
                          >
                            {rc.label}
                          </span>
                          <span
                            className="font-mono"
                            style={{
                              fontSize: 10,
                              letterSpacing: "0.18em",
                              color: "rgba(255,255,255,0.35)",
                            }}
                          >
                            {r.date.replace(/-/g, ".")}
                          </span>
                        </div>
                        <div style={{ fontSize: 13.5, lineHeight: 1.4, color: "rgba(255,255,255,0.82)" }}>
                          {r.title}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Footer ribbon */}
      <div
        className="font-mono"
        style={{
          marginTop: 48,
          paddingTop: 18,
          borderTop: "2px solid rgba(255,255,255,0.08)",
          display: "flex",
          justifyContent: "space-between",
          fontSize: 10,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.3)",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <span>MavenCode · news/dossier</span>
        <span>{item.id.toUpperCase()} · {dateDisplay}</span>
        <span>v1 · the dossier</span>
      </div>
    </div>
  );
}

/* Small button used in top action bar */
function ActionButton({ icon, label, onClick, on }: { icon: React.ReactNode; label: string; onClick: () => void; on?: boolean }) {
  return (
    <button
      onClick={onClick}
      className="font-mono"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 14px",
        background: on ? G_SOFT : "transparent",
        color: on ? G : "rgba(255,255,255,0.55)",
        border: `2px solid ${on ? G_LINE : "rgba(255,255,255,0.1)"}`,
        fontSize: 10,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      {icon}
      {label}
    </button>
  );
}
