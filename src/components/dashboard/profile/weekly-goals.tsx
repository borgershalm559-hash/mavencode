"use client";

import type { UserProfile } from "@/types/dashboard";

interface WeeklyGoalsProps {
  profile: UserProfile;
}

interface Goal {
  title: string;
  value: number;
  total: number;
  unit: string;
  due: string;
}

export function WeeklyGoals({ profile }: WeeklyGoalsProps) {
  const xpPct = Math.round((profile.xp / profile.xpForNextLevel) * 100);
  const streakTarget = Math.max(14, Math.ceil((profile.streak + 1) / 7) * 7);
  const streakLeft = streakTarget - profile.streak;

  const goals: Goal[] = [];

  const activeCourse = profile.currentCourses[0];
  if (activeCourse) {
    const title =
      activeCourse.title.length > 24
        ? activeCourse.title.slice(0, 22) + "…"
        : activeCourse.title;
    goals.push({
      title,
      value: activeCourse.progress,
      total: 100,
      unit: "%",
      due: `${activeCourse.completed} / ${activeCourse.total} уроков`,
    });
  }

  goals.push({
    title: `Серия ${streakTarget} дней`,
    value: profile.streak,
    total: streakTarget,
    unit: " дн",
    due: streakLeft <= 0 ? "цель достигнута!" : `ещё ${streakLeft} дн`,
  });

  goals.push({
    title: `До Lv.${profile.level + 1}`,
    value: xpPct,
    total: 100,
    unit: "%",
    due: `${(profile.xpForNextLevel - profile.xp).toLocaleString("ru-RU")} XP осталось`,
  });

  return (
    <div className="px-5 pb-5 space-y-4">
      {goals.map((g, i) => {
        const pct = Math.min((g.value / g.total) * 100, 100);
        return (
          <div key={i}>
            <div className="flex items-center justify-between gap-2">
              <div className="text-white/85 text-[13px] truncate">{g.title}</div>
              <div className="font-mono text-[10px] tabular-nums text-[#10B981] flex-shrink-0">
                {g.value}
                <span className="text-white/25">/{g.total}{g.unit}</span>
              </div>
            </div>
            <div className="mt-1.5 h-1.5 bg-white/[0.05] overflow-hidden">
              <div
                className="h-full bg-[#10B981] transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/25 mt-1">
              {g.due}
            </div>
          </div>
        );
      })}
    </div>
  );
}
