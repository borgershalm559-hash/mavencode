"use client";

interface LessonStatus {
  id: string;
  order: number;
  title: string;
  completed: boolean;
  isAvailable: boolean;
}

interface LessonProgressStripProps {
  lessons: LessonStatus[];
  currentLessonId: string;
  courseTitle: string;
}

export function LessonProgressStrip({
  lessons,
  currentLessonId,
  courseTitle,
}: LessonProgressStripProps) {
  const completedCount = lessons.filter((l) => l.completed).length;

  return (
    <div className="px-6 py-3 border-b border-white/[0.06] flex items-center gap-4">
      <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/25 shrink-0">
        {courseTitle}
      </span>

      <div className="flex items-center gap-1 flex-1 min-w-0 overflow-hidden">
        {lessons.map((lesson) => {
          const isCurrent = lesson.id === currentLessonId;
          return (
            <div
              key={lesson.id}
              title={lesson.title}
              className="w-2 h-2 shrink-0 transition-all duration-200"
              style={{
                background: lesson.completed
                  ? "#10B981"
                  : isCurrent
                  ? "rgba(255,255,255,0.50)"
                  : lesson.isAvailable
                  ? "rgba(255,255,255,0.12)"
                  : "rgba(255,255,255,0.05)",
                outline: isCurrent ? "2px solid rgba(16,185,129,0.4)" : "none",
                outlineOffset: "1px",
              }}
            />
          );
        })}
      </div>

      <span className="font-mono text-[9px] text-white/25 shrink-0">
        {completedCount}/{lessons.length}
      </span>
    </div>
  );
}
