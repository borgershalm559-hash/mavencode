"use client";

import { ArrowLeft, Lightbulb } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface LessonHeaderProps {
  courseId: string;
  courseTitle: string;
  lessonTitle: string;
  lessonOrder: number;
  totalLessons: number;
  hintsUsed: number;
  totalHints: number;
  onHintRequest: () => void;
  completed: boolean;
}

export function LessonHeader({
  courseId,
  courseTitle,
  lessonTitle,
  lessonOrder,
  totalLessons,
  hintsUsed,
  totalHints,
  onHintRequest,
  completed,
}: LessonHeaderProps) {
  const router = useRouter();

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-surface border-b-2 border-white/[0.07]">
      {/* Accent stripe */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#10B981] z-10" />

      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push(`/dashboard?section=courses&course=${courseId}`)}
          className="flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors text-sm font-mono"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">{courseTitle}</span>
        </button>

        <div className="w-px h-5 bg-white/[0.07]" />

        <div className="flex items-center gap-2">
          <span className="text-white/85 text-sm font-medium">{lessonTitle}</span>
          <span className="font-mono text-white/30 text-xs">
            {lessonOrder} / {totalLessons}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Progress bar */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-24 h-1.5 bg-white/[0.04] overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#10B981] to-[#047857]"
              initial={{ width: 0 }}
              animate={{ width: `${(lessonOrder / totalLessons) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {completed && (
          <span className="font-mono text-xs text-emerald-600 bg-emerald-400/10 border border-emerald-400/25 px-2 py-0.5 uppercase tracking-[0.1em]">
            Пройден
          </span>
        )}

        {/* Hints button */}
        {totalHints > 0 && (
          <button
            onClick={onHintRequest}
            disabled={hintsUsed >= totalHints}
            className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-white/[0.07] text-sm font-mono
              text-white/50 bg-surface
              hover:text-[#10B981] hover:border-[#10B981]/30 hover:bg-[#10B981]/[0.04]
              disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>{hintsUsed}/{totalHints}</span>
          </button>
        )}
      </div>
    </header>
  );
}
