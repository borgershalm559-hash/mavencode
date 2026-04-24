"use client";

import { ArrowRight, Zap, BookOpen, Trophy } from "lucide-react";
import { GlassCard } from "../glass-card";
import type { UserProfile } from "@/types/dashboard";

const GREEN = "#10B981";
const GREEN_SOFT = "rgba(16,185,129,0.08)";
const GREEN_LINE = "rgba(16,185,129,0.24)";

interface NextStepsProps {
  profile: UserProfile;
  onNavigate?: (key: string) => void;
}

export function NextSteps({ profile, onNavigate }: NextStepsProps) {
  const xpNeeded = profile.xpForNextLevel - profile.xp;
  const activeCourse = profile.currentCourses[0];
  const nextAchievement = profile.achievements.find((a) => !a.unlocked);

  const quests: {
    tag: string;
    icon: React.ReactNode;
    title: string;
    sub: string;
    cta: string;
    onClick: () => void;
  }[] = [
    {
      tag: "QUEST 01",
      icon: <Zap className="size-[18px]" />,
      title: `${xpNeeded.toLocaleString("ru-RU")} XP до Lv.${profile.level + 1}`,
      sub: "Продолжи начатый урок",
      cta: "К курсам",
      onClick: () => onNavigate?.("courses"),
    },
    {
      tag: "QUEST 02",
      icon: <BookOpen className="size-[18px]" />,
      title: activeCourse?.title ?? "Начни первый курс",
      sub: activeCourse
        ? `${activeCourse.completed} / ${activeCourse.total} уроков · ${activeCourse.progress}%`
        : "Выбери язык программирования",
      cta: "Продолжить",
      onClick: () => onNavigate?.("courses"),
    },
    {
      tag: "QUEST 03",
      icon: <Trophy className="size-[18px]" />,
      title: nextAchievement?.title ?? "Все ачивки открыты",
      sub: nextAchievement?.description ?? "—",
      cta: "Разблокировать",
      onClick: () => onNavigate?.("courses"),
    },
  ];

  return (
    <GlassCard>
      <div className="px-5 pt-4 pb-2 flex items-baseline justify-between">
        <div>
          <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-white/90">
            Что дальше
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 mt-1">
            Активные квесты
          </div>
        </div>
        <div className="font-mono text-[10px] text-white/25 uppercase tracking-[0.2em]">3 / 3</div>
      </div>

      <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-3 gap-3">
        {quests.map((q, i) => (
          <div
            key={i}
            className="border-2 border-white/[0.06] bg-white/[0.015] p-4 flex flex-col gap-3 group"
          >
            {/* icon + tag */}
            <div className="flex items-center justify-between">
              <div
                className="size-9 flex items-center justify-center border-2"
                style={{ color: GREEN, background: GREEN_SOFT, borderColor: GREEN_LINE }}
              >
                {q.icon}
              </div>
              <div
                className="font-mono text-[9px] tracking-[0.25em] uppercase"
                style={{ color: `${GREEN}90` }}
              >
                {q.tag}
              </div>
            </div>

            {/* content */}
            <div>
              <div className="text-white/90 text-[15px] font-semibold leading-tight">{q.title}</div>
              <div className="text-white/40 text-xs mt-1 leading-snug">{q.sub}</div>
            </div>

            {/* cta */}
            <button
              onClick={q.onClick}
              className="mt-1 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em] font-semibold transition-opacity hover:opacity-70"
              style={{ color: GREEN }}
            >
              {q.cta} <ArrowRight className="size-3" />
            </button>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
