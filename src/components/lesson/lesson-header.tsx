"use client";

import { useRouter } from "next/navigation";

interface LessonHeaderProps {
  courseId: string;
  courseTitle: string;
  lessonOrder: number;
  hintsUsed: number;
  totalHints: number;
  onHintRequest: () => void;
  isSaving?: boolean;
}

export function LessonHeader({
  courseId,
  courseTitle,
  lessonOrder,
  hintsUsed,
  totalHints,
  onHintRequest,
  isSaving = false,
}: LessonHeaderProps) {
  const router = useRouter();

  return (
    <header
      className="font-mono shrink-0"
      style={{
        padding: "20px 40px",
        borderBottom: "2px solid rgba(255,255,255,0.07)",
        display: "flex",
        alignItems: "center",
        gap: 22,
        fontSize: 11,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.4)",
      }}
    >
      <button
        onClick={() => router.push(`/dashboard?section=courses&course=${courseId}`)}
        style={{
          width: 36,
          height: 36,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid rgba(255,255,255,0.08)",
          background: "transparent",
          color: "rgba(255,255,255,0.5)",
          cursor: "pointer",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
        </svg>
      </button>

      <span>{courseTitle}</span>
      <span style={{ color: "rgba(255,255,255,0.15)" }}>/</span>
      <span style={{ color: "#fff" }}>Урок {String(lessonOrder).padStart(2, "0")}</span>

      <div style={{ flex: 1 }} />

      {/* Autosave indicator */}
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        <span
          style={{
            width: 6,
            height: 6,
            background: isSaving ? "#FFBD2E" : "#10B981",
            display: "inline-block",
          }}
        />
        {isSaving ? "Сохраняется…" : "Черновик автосохранён"}
      </span>

      <span style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
      <span>REV 2026.02</span>

      {totalHints > 0 && (
        <button
          onClick={onHintRequest}
          disabled={hintsUsed >= totalHints}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 12px",
            border: "2px solid rgba(255,255,255,0.08)",
            background: "transparent",
            color: hintsUsed >= totalHints ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.5)",
            fontFamily: "inherit",
            fontSize: 11,
            letterSpacing: "inherit",
            textTransform: "inherit",
            cursor: hintsUsed >= totalHints ? "not-allowed" : "pointer",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21h6M12 3a7 7 0 0 0-4 12.7V18a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.3A7 7 0 0 0 12 3z"/>
          </svg>
          Подсказки {hintsUsed}/{totalHints}
        </button>
      )}
    </header>
  );
}
