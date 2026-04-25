"use client";

interface LessonHeroProps {
  title: string;
  xpReward: number;
  testsCount: number;
  estimatedMinutes: number;
  completed: boolean;
}

export function LessonHero({
  title,
  xpReward,
  testsCount,
  estimatedMinutes,
  completed,
}: LessonHeroProps) {
  return (
    <div className="px-6 pt-6 pb-4 border-b border-white/[0.06]">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
        {/* Title */}
        <div className="flex-1 min-w-0">
          {completed && (
            <div className="mb-2 inline-flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-[#10B981]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#10B981]">
                Пройден
              </span>
            </div>
          )}
          <h1
            className="text-[clamp(36px,5.5vw,76px)] font-light leading-[1.05] text-white/90"
            style={{ fontFamily: "var(--font-fraunces)", fontWeight: 300 }}
          >
            {title}
          </h1>
        </div>

        {/* Status block */}
        <div className="flex items-stretch gap-0 shrink-0">
          <StatusCell label="Награда" value={xpReward} unit="XP" />
          <div className="w-px bg-white/[0.07]" />
          <StatusCell label="Тесты" value={testsCount} unit="шт" />
          <div className="w-px bg-white/[0.07]" />
          <StatusCell label="Время" value={estimatedMinutes} unit="мин" />
        </div>
      </div>
    </div>
  );
}

function StatusCell({
  label,
  value,
  unit,
}: {
  label: string;
  value: number;
  unit: string;
}) {
  return (
    <div className="flex flex-col items-center px-5 py-2 min-w-[72px]">
      <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/30 mb-1">
        {label}
      </span>
      <span
        className="text-[44px] leading-none text-white/85"
        style={{ fontFamily: "var(--font-fraunces)", fontWeight: 300 }}
      >
        {value}
      </span>
      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/25 mt-0.5">
        {unit}
      </span>
    </div>
  );
}
