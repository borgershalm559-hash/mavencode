"use client";

const TYPE_META: Record<string, { short: string; hex: string }> = {
  code:          { short: "CODE", hex: "#60A5FA" },
  "fill-blanks": { short: "FILL", hex: "#C4B5FD" },
  "fix-bug":     { short: "BUG",  hex: "#F87171" },
  quiz:          { short: "QUIZ", hex: "#34D399" },
};

const LANG_META: Record<string, { label: string; hex: string }> = {
  python:     { label: "PY", hex: "#60A5FA" },
  javascript: { label: "JS", hex: "#F6E05E" },
  typescript: { label: "TS", hex: "#3B82F6" },
};

interface LessonHeroProps {
  title: string;
  order: number;
  type: string;
  language: string;
  xpReward: number;
  testsCount: number;
  estimatedMinutes: number;
  completed: boolean;
}

export function LessonHero({
  title,
  order,
  type,
  language,
  xpReward,
  testsCount,
  estimatedMinutes,
  completed,
}: LessonHeroProps) {
  const typeMeta = TYPE_META[type] ?? { short: type.toUpperCase(), hex: "#60A5FA" };
  const langMeta = LANG_META[language] ?? { label: language.toUpperCase(), hex: "#60A5FA" };

  return (
    <div
      className="border-b border-white/[0.07]"
      style={{
        padding: "36px 40px",
        display: "grid",
        gridTemplateColumns: "1fr 360px",
        gap: 40,
        alignItems: "end",
      }}
    >
      {/* Left: overline + title */}
      <div>
        <div
          className="font-mono text-[11px] tracking-[0.3em] uppercase flex items-center gap-3.5"
          style={{ color: "#10B981" }}
        >
          <span>Лабораторная № {String(order).padStart(2, "0")}</span>
          <span className="text-white/15">·</span>
          <span style={{ color: typeMeta.hex }}>{typeMeta.short}</span>
          <span className="text-white/15">·</span>
          <span style={{ color: langMeta.hex }}>{langMeta.label}</span>
          {completed && (
            <>
              <span className="text-white/15">·</span>
              <span className="text-[#10B981]">ПРОЙДЕН</span>
            </>
          )}
        </div>

        <h1
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontWeight: 300,
            fontSize: 76,
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            margin: "16px 0 0",
            textWrap: "balance",
            color: "#fff",
          }}
        >
          {title}
        </h1>
      </div>

      {/* Right: status block */}
      <div
        style={{
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          paddingLeft: 28,
          display: "grid",
          gap: 22,
        }}
      >
        {[
          { k: "Время",   v: `${estimatedMinutes}м`, sub: "оценка",   accent: false },
          { k: "Награда", v: `+${xpReward}`,         sub: "XP",       accent: true  },
          { k: "Тесты",   v: `0/${testsCount}`,       sub: "пройдено", accent: false },
        ].map((x) => (
          <div
            key={x.k}
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              columnGap: 18,
              alignItems: "baseline",
            }}
          >
            <div
              className="font-mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)",
                alignSelf: "start",
                marginTop: 14,
              }}
            >
              {x.k}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span
                style={{
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontWeight: 300,
                  fontSize: 44,
                  lineHeight: 1,
                  color: x.accent ? "#10B981" : "#fff",
                }}
              >
                {x.v}
              </span>
              <span
                className="font-mono"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.35)",
                }}
              >
                {x.sub}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
