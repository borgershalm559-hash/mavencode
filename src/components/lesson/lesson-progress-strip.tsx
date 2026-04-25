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
  const currentLesson = lessons.find((l) => l.id === currentLessonId);

  return (
    <div
      className="px-10 py-5 border-b border-white/[0.07]"
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        alignItems: "center",
        gap: 18,
      }}
    >
      {/* Left label */}
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 shrink-0">
        Прогресс курса · {completedCount}/{lessons.length}
      </span>

      {/* Bars */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${lessons.length}, 1fr)`,
          gap: 3,
        }}
      >
        {lessons.map((lesson) => {
          const isCurrent = lesson.id === currentLessonId;
          return (
            <div
              key={lesson.id}
              title={lesson.title}
              style={{
                height: 8,
                background:
                  lesson.completed || isCurrent
                    ? "#10B981"
                    : !lesson.isAvailable
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(255,255,255,0.12)",
                opacity: isCurrent ? 0.55 : 1,
                outline: isCurrent ? "1.5px solid #10B981" : "none",
                outlineOffset: isCurrent ? 2 : 0,
              }}
            />
          );
        })}
      </div>

      {/* Right: current lesson */}
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#10B981] shrink-0">
        ► Урок {String(currentLesson?.order ?? 1).padStart(2, "0")}
      </span>
    </div>
  );
}
