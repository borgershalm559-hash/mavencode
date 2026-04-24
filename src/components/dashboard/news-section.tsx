"use client";

import { useState, useCallback } from "react";
import {
  RefreshCw, Calendar, Bell, Pin, ArrowRight,
  ArrowLeft, Clock, Link as LinkIcon, Check, Search,
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

/* ── Detail View ──────────────────────────────────────── */
function NewsDetailView({ item, allNews, onBack, onSelectNews }: {
  item: NewsItem;
  allNews: NewsItem[] | undefined;
  onBack: () => void;
  onSelectNews: (n: NewsItem) => void;
}) {
  const [copied, setCopied] = useState(false);
  const c = CATEGORY_HEX[item.category as CatKey];
  const minutes = readMin(item.body);
  const sorted = allNews ?? [];
  const idx = sorted.findIndex((n) => n.id === item.id);
  const prevNews = idx < sorted.length - 1 ? sorted[idx + 1] : null;
  const nextNews = idx > 0 ? sorted[idx - 1] : null;

  const handleCopyLink = useCallback(() => {
    const url = `${window.location.origin}/dashboard?news=${item.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [item.id]);

  const date = new Date(item.date + "T00:00:00").toLocaleDateString("ru-RU", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="size-9 flex items-center justify-center border-2 border-white/[0.07] text-white/40 hover:border-white/[0.15] hover:text-white/70 transition-all"
        >
          <ArrowLeft className="size-5" />
        </button>
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 font-mono text-xs text-white/40 hover:text-white/70 transition-colors px-3 py-1.5 border-2 border-transparent hover:border-white/[0.05]"
        >
          {copied ? (
            <><Check className="size-4 text-emerald-600" /><span className="text-emerald-600">Скопировано</span></>
          ) : (
            <><LinkIcon className="size-4" /><span>Скопировать ссылку</span></>
          )}
        </button>
      </div>

      {/* Cover */}
      <div className="border-2 border-white/[0.07] overflow-hidden">
        {item.imageUrl ? (
          <div className="relative aspect-[2.2/1]">
            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
          </div>
        ) : (
          <div
            className="h-32 flex items-center justify-center"
            style={{ background: c?.soft ?? G_SOFT }}
          >
            <CategoryIcon cat={item.category} className="size-10 opacity-30" style={{ color: c?.main ?? G } as React.CSSProperties} />
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 flex-wrap">
        <CategoryPill cat={item.category} />
        <span className="font-mono text-xs text-white/30">{date}</span>
        <span className="flex items-center gap-1.5 font-mono text-xs text-white/25">
          <Clock className="size-4" /> ~{minutes} мин чтения
        </span>
        {item.pinned && (
          <span className="inline-flex items-center gap-1 font-mono text-xs px-3 py-1 border-2 font-medium"
                style={{ color: G, background: G_SOFT, borderColor: G_LINE }}>
            <Pin className="size-3.5 fill-current opacity-60" /> Закреплено
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="text-white text-2xl sm:text-3xl font-bold leading-tight tracking-tight">
        {item.title}
      </h1>

      {/* Body */}
      <div className="bg-[#0F1011] border-2 border-white/[0.07] px-5 sm:px-6 py-5 overflow-hidden">
        <article className="[&>*:first-child]:mt-0">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents as never}>
            {item.body}
          </ReactMarkdown>
        </article>
      </div>

      {/* Prev / Next */}
      {(prevNews || nextNews) && (
        <div className="grid grid-cols-2 gap-4 pt-2">
          {prevNews ? (
            <button
              onClick={() => onSelectNews(prevNews)}
              className="group text-left border-2 border-white/[0.07] bg-[#0F1011] p-4 transition-all hover:border-white/[0.15]"
              style={{ boxShadow: "3px 3px 0 0 rgba(16,185,129,0.25)" }}
            >
              <div className="flex items-center gap-1.5 font-mono text-xs text-white/25 mb-2">
                <ArrowLeft className="size-4" /> Предыдущая
              </div>
              <p className="text-white/70 text-base font-medium truncate group-hover:text-[#10B981] transition-colors">
                {prevNews.title}
              </p>
            </button>
          ) : <div />}
          {nextNews ? (
            <button
              onClick={() => onSelectNews(nextNews)}
              className="group text-right border-2 border-white/[0.07] bg-[#0F1011] p-4 transition-all hover:border-white/[0.15]"
            >
              <div className="flex items-center justify-end gap-1.5 font-mono text-xs text-white/25 mb-2">
                Следующая <ArrowRight className="size-4" />
              </div>
              <p className="text-white/70 text-base font-medium truncate group-hover:text-[#10B981] transition-colors">
                {nextNews.title}
              </p>
            </button>
          ) : <div />}
        </div>
      )}
    </div>
  );
}
