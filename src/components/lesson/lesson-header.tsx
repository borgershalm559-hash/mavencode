"use client";

import { ArrowLeft, Lightbulb, Save } from "lucide-react";
import { useRouter } from "next/navigation";

interface LessonHeaderProps {
  courseId: string;
  courseTitle: string;
  lessonOrder: number;
  totalLessons: number;
  hintsUsed: number;
  totalHints: number;
  language: string;
  onHintRequest: () => void;
  isSaving?: boolean;
}

export function LessonHeader({
  courseId,
  courseTitle,
  lessonOrder,
  totalLessons,
  hintsUsed,
  totalHints,
  language,
  onHintRequest,
  isSaving = false,
}: LessonHeaderProps) {
  const router = useRouter();

  return (
    <header className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/35">
        <button
          onClick={() =>
            router.push(`/dashboard?section=courses&course=${courseId}`)
          }
          className="flex items-center gap-1.5 hover:text-white/60 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{courseTitle}</span>
        </button>

        <span className="text-white/15">/</span>

        <span className="text-white/20">
          {language.toUpperCase()}
        </span>

        <span className="text-white/15">&gt;</span>

        <span className="text-white/40">
          Урок {lessonOrder}&nbsp;/&nbsp;{totalLessons}
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        {isSaving && (
          <span className="hidden sm:flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.2em] text-white/20">
            <Save className="w-2.5 h-2.5" />
            Сохранение...
          </span>
        )}

        {totalHints > 0 && (
          <button
            onClick={onHintRequest}
            disabled={hintsUsed >= totalHints}
            className="flex items-center gap-1.5 px-2.5 py-1 border border-white/[0.08] text-[11px] font-mono
              text-white/40 bg-white/[0.02]
              hover:text-[#10B981] hover:border-[#10B981]/25 hover:bg-[#10B981]/[0.03]
              disabled:opacity-25 disabled:cursor-not-allowed transition-all uppercase tracking-[0.1em]"
          >
            <Lightbulb className="w-3 h-3" />
            {hintsUsed}/{totalHints}
          </button>
        )}
      </div>
    </header>
  );
}
