"use client";

import { useState, useMemo } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Clock,
  Download,
  FileText,
  Grid3x3,
  List as ListIcon,
  Mic,
  PlayCircle,
  Search,
  Sparkles,
  Hash,
  ArrowUpDown,
  BookOpen,
  FileArchive,
} from "lucide-react";
import { LibrarySkeleton } from "./loading-skeleton";
import type { LibraryItem } from "@/types/dashboard";

/* Palette */
const G = "#10B981";
const G_DEEP = "#047857";
const G_SOFT = "rgba(16,185,129,0.09)";
const G_LINE = "rgba(16,185,129,0.28)";

type KindKey = "PDF" | "Видео" | "Шпаргалка" | "Проект" | "Статья" | "Подкаст";

const KINDS: Record<KindKey, { main: string; soft: string; line: string; label: string; glyph: string }> = {
  "PDF":         { main: "#F87171", soft: "rgba(248,113,113,0.10)", line: "rgba(248,113,113,0.28)", label: "PDF", glyph: "p" },
  "Видео":       { main: "#60A5FA", soft: "rgba(96,165,250,0.10)",  line: "rgba(96,165,250,0.28)",  label: "VID", glyph: "v" },
  "Шпаргалка":   { main: "#FBBF24", soft: "rgba(251,191,36,0.10)",  line: "rgba(251,191,36,0.28)",  label: "ШПР", glyph: "ш" },
  "Проект":      { main: "#34D399", soft: "rgba(52,211,153,0.10)",  line: "rgba(52,211,153,0.28)",  label: "ПРО", glyph: "р" },
  "Статья":      { main: "#C4B5FD", soft: "rgba(196,181,253,0.10)", line: "rgba(196,181,253,0.30)", label: "СТА", glyph: "с" },
  "Подкаст":     { main: "#F472B6", soft: "rgba(244,114,182,0.10)", line: "rgba(244,114,182,0.28)", label: "ПОД", glyph: "п" },
};

function getKind(k: string) {
  return KINDS[k as KindKey] ?? { main: G, soft: G_SOFT, line: G_LINE, label: k.slice(0, 3).toUpperCase(), glyph: k[0]?.toLowerCase() ?? "•" };
}

function KindIcon({ kind, size = 22 }: { kind: string; size?: number }) {
  if (kind === "PDF" || kind === "Статья") return <FileText size={size} />;
  if (kind === "Видео") return <PlayCircle size={size} />;
  if (kind === "Шпаргалка") return <BookOpen size={size} />;
  if (kind === "Проект") return <FileArchive size={size} />;
  if (kind === "Подкаст") return <Mic size={size} />;
  return <FileText size={size} />;
}

function estimateMins(kind: string): number {
  if (kind === "Видео") return 30;
  if (kind === "Подкаст") return 40;
  if (kind === "Проект") return 60;
  if (kind === "PDF") return 15;
  if (kind === "Шпаргалка") return 5;
  return 10;
}

interface LibrarySectionProps {
  library: LibraryItem[] | undefined;
  loading: boolean;
  selectedLibrary: LibraryItem | null;
  onSelectLibrary: (item: LibraryItem) => void;
  onBack: () => void;
}

export function LibrarySection({ library, loading, selectedLibrary, onSelectLibrary, onBack }: LibrarySectionProps) {
  if (selectedLibrary) {
    return <LibraryDetail item={selectedLibrary} onBack={onBack} />;
  }

  if (loading || !library) return <LibrarySkeleton />;

  return <LibraryAtlas library={library} onSelect={onSelectLibrary} />;
}

/* ── V1 Atlas ─────────────────────────────────────────────────────────── */
function LibraryAtlas({ library, onSelect }: { library: LibraryItem[]; onSelect: (item: LibraryItem) => void }) {
  const [active, setActive] = useState<string>("Все");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");

  const filters = useMemo(() => ["Все", ...Array.from(new Set(library.map((r) => r.kind)))], [library]);
  const counts = useMemo(() => {
    const c: Record<string, number> = { "Все": library.length };
    library.forEach((r) => {
      c[r.kind] = (c[r.kind] ?? 0) + 1;
    });
    return c;
  }, [library]);

  const grid = useMemo(() => {
    return library.filter((r) => {
      if (active !== "Все" && r.kind !== active) return false;
      if (search && !r.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [library, active, search]);

  const featured = useMemo(() => library.slice(0, 3), [library]);

  const sumDocs = library.filter((r) => ["PDF", "Шпаргалка", "Статья"].includes(r.kind)).length;
  const sumMins = library.reduce((acc, r) => acc + estimateMins(r.kind), 0);

  const stats: { k: string; v: number; accent?: boolean }[] = [
    { k: "ресурсов", v: library.length, accent: true },
    { k: "документов", v: sumDocs },
    { k: "минут видео/аудио", v: sumMins },
  ];

  return (
    <div
      className="library-atlas"
      style={{
        background: "#0A0A0B",
        color: "#fff",
        fontFamily: "'Inter', system-ui, sans-serif",
        padding: "32px 40px 64px",
      }}
    >
      {/* HEADER */}
      <div
        className="library-atlas-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          paddingBottom: 22,
          borderBottom: "2px solid rgba(255,255,255,0.08)",
          gap: 32,
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: "1 1 420px", minWidth: 280 }}>
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
            /библиотека · атлас ресурсов
          </div>
          <h1
            style={{
              fontFamily: '"Fraunces", Georgia, serif',
              fontWeight: 300,
              fontSize: "clamp(48px, 7vw, 76px)",
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              margin: 0,
              color: "#fff",
            }}
          >
            Библиотека<span style={{ color: G }}>.</span>
          </h1>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.55,
              color: "rgba(255,255,255,0.55)",
              maxWidth: 640,
              marginTop: 14,
            } as React.CSSProperties}
          >
            Подобранный набор материалов под курсы MavenCode: шпаргалки, видео-разборы, статьи, готовые проекты. Открывайте, читайте, возвращайтесь в любой момент.
          </p>
        </div>

        {/* Vital stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, auto)", gap: 28 }}>
          {stats.map((s) => (
            <div key={s.k} style={{ textAlign: "right" }}>
              <div
                style={{
                  fontFamily: '"Fraunces", Georgia, serif',
                  fontSize: 64,
                  fontWeight: 200,
                  lineHeight: 0.9,
                  letterSpacing: "-0.04em",
                  color: s.accent ? G : "rgba(255,255,255,0.92)",
                }}
              >
                {String(s.v).padStart(2, "0")}
              </div>
              <div
                className="font-mono"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.4)",
                  marginTop: 4,
                }}
              >
                {s.k}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURED STRIP */}
      {featured.length > 0 && (
        <div style={{ marginTop: 28, marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
            <Sparkles size={14} style={{ color: G }} />
            <span
              className="font-mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: G,
                fontWeight: 700,
              }}
            >
              рекомендуем · отобрано редакцией
            </span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
            <span
              className="font-mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              обновлено сегодня
            </span>
          </div>

          <div className="library-featured-grid" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 18 }}>
            {featured.map((r, i) => {
              const k = getKind(r.kind);
              const big = i === 0;
              return (
                <article
                  key={r.id}
                  onClick={() => onSelect(r)}
                  style={{
                    background: "#14141A",
                    border: "2px solid rgba(255,255,255,0.1)",
                    boxShadow: `6px 6px 0 ${G_DEEP}`,
                    padding: 24,
                    position: "relative",
                    overflow: "hidden",
                    minHeight: big ? 280 : 220,
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage: `repeating-linear-gradient(45deg, ${k.main}10 0 2px, transparent 2px 14px)`,
                      opacity: 0.5,
                    }}
                  />
                  <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                      <span
                        className="font-mono"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "6px 12px",
                          border: `2px solid ${k.line}`,
                          background: k.soft,
                          color: k.main,
                          fontSize: 10,
                          letterSpacing: "0.22em",
                          textTransform: "uppercase",
                          fontWeight: 700,
                        }}
                      >
                        <KindIcon kind={r.kind} size={11} />
                        {r.kind}
                      </span>
                      <span
                        className="font-mono"
                        style={{
                          fontSize: 10,
                          letterSpacing: "0.22em",
                          textTransform: "uppercase",
                          color: "rgba(255,255,255,0.35)",
                        }}
                      >
                        #{r.id}
                      </span>
                    </div>

                    <h3
                      style={{
                        fontFamily: '"Fraunces", Georgia, serif',
                        fontWeight: 300,
                        letterSpacing: "-0.015em",
                        fontSize: big ? 38 : 26,
                        lineHeight: 1.1,
                        color: "#fff",
                        margin: "0 0 14px",
                      }}
                    >
                      {r.title}
                    </h3>
                    <p
                      style={{
                        fontSize: 14,
                        lineHeight: 1.55,
                        color: "rgba(255,255,255,0.65)",
                        margin: "0 0 18px",
                        flex: 1,
                      } as React.CSSProperties}
                    >
                      {r.body}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderTop: "1px dashed rgba(255,255,255,0.1)",
                        paddingTop: 14,
                      }}
                    >
                      <span
                        className="font-mono"
                        style={{
                          fontSize: 10,
                          letterSpacing: "0.22em",
                          textTransform: "uppercase",
                          color: "rgba(255,255,255,0.4)",
                        }}
                      >
                        {r.size}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(r);
                        }}
                        className="font-mono"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "8px 14px",
                          background: G,
                          color: "#0A0A0B",
                          border: "none",
                          fontSize: 10,
                          letterSpacing: "0.22em",
                          textTransform: "uppercase",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        открыть <ArrowUpRight size={11} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* FILTER BAR */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "16px 0",
          borderTop: "2px solid rgba(255,255,255,0.08)",
          borderBottom: "2px solid rgba(255,255,255,0.08)",
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        <span
          className="font-mono"
          style={{
            fontSize: 10,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.4)",
            marginRight: 6,
            fontWeight: 700,
          }}
        >
          типы
        </span>

        {filters.map((f) => {
          const on = active === f;
          const k = f === "Все" ? null : getKind(f);
          return (
            <button
              key={f}
              onClick={() => setActive(f)}
              className="font-mono"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 14px",
                border: `2px solid ${on ? (k?.line ?? G_LINE) : "rgba(255,255,255,0.08)"}`,
                background: on ? (k?.soft ?? G_SOFT) : "transparent",
                color: on ? (k?.main ?? G) : "rgba(255,255,255,0.55)",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {f}
              <span style={{ opacity: 0.5, fontVariantNumeric: "tabular-nums" }}>{counts[f] ?? 0}</span>
            </button>
          );
        })}

        <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          {/* Search */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              border: "2px solid rgba(255,255,255,0.1)",
              minWidth: 220,
            }}
          >
            <Search size={12} style={{ color: "rgba(255,255,255,0.4)", flexShrink: 0 }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="поиск по библиотеке…"
              className="font-mono"
              style={{
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.85)",
                background: "transparent",
                border: 0,
                outline: 0,
                flex: 1,
                minWidth: 0,
              }}
            />
          </div>

          {/* Sort (decorative) */}
          <div
            className="font-mono"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              border: "2px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.55)",
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            <ArrowUpDown size={12} />
            сортировка: <span style={{ color: G, fontWeight: 700 }}>свежие</span>
          </div>

          {/* View toggle */}
          <div style={{ display: "inline-flex", border: "2px solid rgba(255,255,255,0.1)" }}>
            {(["grid", "list"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{
                  width: 36,
                  height: 36,
                  display: "grid",
                  placeItems: "center",
                  background: view === v ? G : "transparent",
                  color: view === v ? "#0A0A0B" : "rgba(255,255,255,0.55)",
                  border: "none",
                  cursor: "pointer",
                  borderLeft: v === "list" ? "2px solid rgba(255,255,255,0.1)" : "none",
                }}
              >
                {v === "grid" ? <Grid3x3 size={14} /> : <ListIcon size={14} />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RESULT META */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
          <span
            style={{
              fontFamily: '"Fraunces", Georgia, serif',
              fontWeight: 300,
              fontSize: 36,
              color: "#fff",
              letterSpacing: "-0.02em",
            }}
          >
            {grid.length}{" "}
            {grid.length === 1 ? "ресурс" : grid.length > 1 && grid.length < 5 ? "ресурса" : "ресурсов"}
          </span>
          <span
            className="font-mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            {active === "Все" ? "вся коллекция" : `категория · ${active}`}
          </span>
        </div>
        <span
          className="font-mono"
          style={{
            fontSize: 10,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          стр. 1 / 1
        </span>
      </div>

      {/* GRID / LIST */}
      {grid.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 0", color: "rgba(255,255,255,0.3)" }}>
          <Search size={28} style={{ marginBottom: 12, opacity: 0.4 }} />
          <span className="font-mono" style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" }}>
            Ничего не найдено
          </span>
        </div>
      ) : view === "grid" ? (
        <div
          className="library-cards-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}
        >
          {grid.map((r) => (
            <ResourceCard key={r.id} r={r} onSelect={onSelect} />
          ))}
        </div>
      ) : (
        <div style={{ display: "grid", gap: 8 }}>
          {grid.map((r) => (
            <ResourceListRow key={r.id} r={r} onSelect={onSelect} />
          ))}
        </div>
      )}

      {/* FOOTER */}
      <div
        className="font-mono"
        style={{
          marginTop: 36,
          paddingTop: 16,
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
        <span>MavenCode · библиотека/атлас</span>
        <span>стр. 1 / 1 · v1 · атлас</span>
      </div>
    </div>
  );
}

/* ── Resource grid card ─────────────────────────────────────────────── */
function ResourceCard({ r, onSelect }: { r: LibraryItem; onSelect: (r: LibraryItem) => void }) {
  const k = getKind(r.kind);
  const mins = estimateMins(r.kind);

  return (
    <article
      onClick={() => onSelect(r)}
      style={{
        background: "#14141A",
        border: "2px solid rgba(255,255,255,0.08)",
        boxShadow: "4px 4px 0 rgba(255,255,255,0.04)",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      {/* Header band */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: 18,
          padding: 18,
          borderBottom: "1px dashed rgba(255,255,255,0.08)",
          alignItems: "center",
          background: "rgba(0,0,0,0.25)",
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            display: "grid",
            placeItems: "center",
            background: k.soft,
            color: k.main,
            border: `2px solid ${k.line}`,
            position: "relative",
          }}
        >
          <KindIcon kind={r.kind} size={22} />
          <span
            style={{
              position: "absolute",
              bottom: -8,
              left: -8,
              fontFamily: '"Fraunces", Georgia, serif',
              fontWeight: 300,
              fontSize: 38,
              lineHeight: 0.8,
              color: k.main,
              opacity: 0.4,
            }}
          >
            {k.glyph}
          </span>
        </div>

        <div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 4 }}>
            <span
              className="font-mono"
              style={{
                fontSize: 9,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: k.main,
                fontWeight: 700,
              }}
            >
              {k.label}
            </span>
            <span
              className="font-mono"
              style={{
                fontSize: 9,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              · {r.kind}
            </span>
          </div>
          <div
            className="font-mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.05em",
              color: "rgba(255,255,255,0.45)",
            }}
          >
            {r.size}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "18px 20px 20px" }}>
        <h3
          style={{
            fontFamily: '"Fraunces", Georgia, serif',
            fontWeight: 400,
            fontSize: 22,
            lineHeight: 1.2,
            color: "#fff",
            margin: "0 0 10px",
            letterSpacing: "-0.01em",
          }}
        >
          {r.title}
        </h3>
        <p
          style={{
            fontSize: 13.5,
            lineHeight: 1.55,
            color: "rgba(255,255,255,0.62)",
            margin: "0 0 16px",
          } as React.CSSProperties}
        >
          {r.body}
        </p>

        {/* Stats row */}
        <div
          className="font-mono"
          style={{
            display: "flex",
            gap: 14,
            marginBottom: 16,
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.4)",
            flexWrap: "wrap",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <Clock size={11} />~{mins} мин
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <Hash size={11} />
            {r.id}
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 8 }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(r);
            }}
            className="font-mono"
            style={{
              padding: "10px 14px",
              background: G,
              color: "#0A0A0B",
              border: "none",
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 700,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: `3px 3px 0 ${G_DEEP}`,
            }}
          >
            открыть <ArrowRight size={11} />
          </button>
          {r.url && (
            <a
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              title="Скачать"
              style={{
                width: 38,
                height: 38,
                display: "grid",
                placeItems: "center",
                background: "transparent",
                color: "rgba(255,255,255,0.6)",
                border: "2px solid rgba(255,255,255,0.1)",
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              <Download size={14} />
            </a>
          )}
          <button
            onClick={(e) => e.stopPropagation()}
            title="В закладки"
            style={{
              width: 38,
              height: 38,
              display: "grid",
              placeItems: "center",
              background: "transparent",
              color: "rgba(255,255,255,0.6)",
              border: "2px solid rgba(255,255,255,0.1)",
              cursor: "pointer",
            }}
          >
            <Bookmark size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}

/* ── List row (compact view) ────────────────────────────────────────── */
function ResourceListRow({ r, onSelect }: { r: LibraryItem; onSelect: (r: LibraryItem) => void }) {
  const k = getKind(r.kind);
  return (
    <button
      onClick={() => onSelect(r)}
      style={{
        display: "grid",
        gridTemplateColumns: "auto auto 1fr auto",
        gap: 16,
        alignItems: "center",
        padding: "14px 18px",
        background: "#14141A",
        border: "2px solid rgba(255,255,255,0.08)",
        cursor: "pointer",
        textAlign: "left",
        width: "100%",
      }}
    >
      <span
        className="font-mono"
        style={{
          padding: "4px 10px",
          fontSize: 10,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: k.main,
          background: k.soft,
          border: `1.5px solid ${k.line}`,
          fontWeight: 700,
        }}
      >
        {k.label}
      </span>
      <span className="font-mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: "rgba(255,255,255,0.3)" }}>
        #{r.id}
      </span>
      <span style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 18, color: "#fff", letterSpacing: "-0.01em" }}>
        {r.title}
      </span>
      <span className="font-mono" style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
        {r.size}
      </span>
    </button>
  );
}

/* ── Detail view ────────────────────────────────────────────────────── */
function LibraryDetail({ item, onBack }: { item: LibraryItem; onBack: () => void }) {
  const k = getKind(item.kind);
  return (
    <div
      style={{
        background: "#0A0A0B",
        color: "#fff",
        fontFamily: "'Inter', system-ui, sans-serif",
        padding: "32px 40px 64px",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: 18,
          borderBottom: "2px solid rgba(255,255,255,0.08)",
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
          <span>← К библиотеке</span>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
          <span style={{ color: G }}>library</span>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
          <span>{item.id}</span>
        </button>
      </div>

      {/* Hero */}
      <div style={{ paddingTop: 28, paddingBottom: 28, borderBottom: "2px solid rgba(255,255,255,0.08)" }}>
        <div
          className="font-mono"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 12px",
            border: `2px solid ${k.line}`,
            background: k.soft,
            color: k.main,
            fontSize: 10,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            fontWeight: 700,
            marginBottom: 18,
          }}
        >
          <KindIcon kind={item.kind} size={11} />
          {item.kind}
        </div>

        <h1
          style={{
            fontFamily: '"Fraunces", Georgia, serif',
            fontWeight: 300,
            fontSize: "clamp(40px, 5.5vw, 64px)",
            lineHeight: 1.02,
            letterSpacing: "-0.025em",
            margin: "0 0 18px",
            color: "#fff",
          }}
        >
          {item.title}
        </h1>

        <p
          style={
            {
              fontSize: 18,
              lineHeight: 1.55,
              color: "rgba(255,255,255,0.62)",
              maxWidth: 720,
              margin: "0 0 22px",
            } as React.CSSProperties
          }
        >
          {item.body}
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
            flexWrap: "wrap",
          }}
        >
          <span>{item.size}</span>
          <span>·</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Clock size={11} />~{estimateMins(item.kind)} мин
          </span>
          <span>·</span>
          <span>#{item.id}</span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 12, paddingTop: 28, flexWrap: "wrap" }}>
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 22px",
              border: "2px solid #0B0B0C",
              background: G,
              color: "#0A0A0B",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              boxShadow: `3px 3px 0 ${G_DEEP}`,
              textDecoration: "none",
            }}
          >
            Открыть <ArrowUpRight size={14} />
          </a>
        )}
        {item.url && (
          <a
            href={item.url}
            download
            className="font-mono"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 22px",
              border: "2px solid rgba(255,255,255,0.1)",
              background: "transparent",
              color: "rgba(255,255,255,0.7)",
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            <Download size={14} /> Скачать
          </a>
        )}
        <button
          className="font-mono"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 22px",
            border: "2px solid rgba(255,255,255,0.1)",
            background: "transparent",
            color: "rgba(255,255,255,0.7)",
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          <Bookmark size={14} /> В закладки
        </button>
      </div>
    </div>
  );
}
