"use client";

import { motion } from "framer-motion";
import {
  Award, LockKeyhole, ArrowRight,
  Rocket, Shield, Palette, Zap, Flame, Users, Star, Trophy,
  Medal, Target, Crown, Gem, Sword, Heart, Globe,
} from "lucide-react";
import { ProfileSkeleton } from "./loading-skeleton";
import { GlassCard } from "./glass-card";
import { HeroCard } from "./profile/hero-card";
import { NextSteps } from "./profile/next-steps";
import { WeeklyGoals } from "./profile/weekly-goals";
import { RecentActivityCard } from "./profile/recent-activity-card";
import { ActivityHeatmap } from "./activity-heatmap";
import { SkillRadar } from "./skill-radar";
import { LeaderboardCard } from "./leaderboard-card";
import type { UserProfile } from "@/types/dashboard";

// ── Achievement icon map ──────────────────────────────────────────────────────
const ACHIEVEMENT_ICONS: Record<string, React.ElementType> = {
  rocket: Rocket, shield: Shield, palette: Palette, zap: Zap,
  flame: Flame, users: Users, star: Star, trophy: Trophy,
  medal: Medal, target: Target, crown: Crown, gem: Gem,
  sword: Sword, heart: Heart, globe: Globe, award: Award,
};

// ── Motion presets ────────────────────────────────────────────────────────────
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
};

// ── V1 card header (Meta + Sub, exact sizes) ──────────────────────────────────
function CardHeader({
  title,
  sub,
  right,
}: {
  title: string;
  sub?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="px-5 pt-4 pb-2 flex items-baseline justify-between">
      <div>
        <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-white/90">
          {title}
        </div>
        {sub && (
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 mt-1">{sub}</div>
        )}
      </div>
      {right && (
        <div className="font-mono text-[10px] text-white/25 uppercase tracking-[0.2em]">{right}</div>
      )}
    </div>
  );
}

// ── Stat bar — V1 StatBlock inner-bordered cells ──────────────────────────────
function StatBar({ profile }: { profile: UserProfile }) {
  const unlockedCount = profile.achievements.filter((a) => a.unlocked).length;
  const stats = [
    { label: "Уровень", value: profile.level,                          sub: `${profile.xp}/${profile.xpForNextLevel} XP` },
    { label: "Опыт",    value: profile.xp.toLocaleString("ru-RU"),      sub: "всего" },
    { label: "Серия",   value: profile.streak,                          sub: "дней" },
    { label: "Курсы",   value: profile.coursesCount,                    sub: `прогресс ${profile.overallProgress}%` },
    { label: "Ачивки",  value: `${unlockedCount} / ${profile.achievements.length}`, sub: "собрано" },
  ];

  return (
    <GlassCard shadow={false}>
      <div className="grid grid-cols-2 md:grid-cols-5 divide-y-2 md:divide-y-0 md:divide-x-2 divide-white/[0.06]">
        {stats.map((s) => (
          <div key={s.label} className="px-4 py-3">
            {/* inner bordered box — V1 StatBlock */}
            <div className="border-2 border-white/[0.06] bg-white/[0.015] px-4 py-3">
              <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/30">{s.label}</div>
              <div className="mt-1 text-white text-2xl font-bold tabular-nums leading-none">{s.value}</div>
              {s.sub && (
                <div className="font-mono text-[9px] uppercase tracking-[0.18em] mt-1.5 text-[#10B981]/60">
                  {s.sub}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

// ── Courses list ──────────────────────────────────────────────────────────────
function CoursesList({
  profile,
  onNavigate,
}: {
  profile: UserProfile;
  onNavigate?: (key: string) => void;
}) {
  return (
    <div className="px-5 pb-5 space-y-2.5">
      {profile.currentCourses.slice(0, 4).map((c) => (
        <div
          key={c.title}
          className="border-2 border-white/[0.05] bg-white/[0.015] px-3.5 py-3"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="text-white/85 text-[13px] truncate">{c.title}</div>
            <span className="font-mono text-[11px] tabular-nums font-semibold text-[#10B981] flex-shrink-0">
              {c.progress}%
            </span>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex-1 h-1 bg-white/[0.06] overflow-hidden">
              <div
                className="h-full"
                style={{
                  width: `${c.progress}%`,
                  background: "linear-gradient(90deg, #10B981, #047857)",
                }}
              />
            </div>
            <span className="font-mono text-[10px] text-white/25 tabular-nums whitespace-nowrap">
              {c.completed}/{c.total}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Achievements — V1 style: all shown, locked = opacity-35, 4-col tile grid ──
function AchievementsGrid({ profile }: { profile: UserProfile }) {
  const unlockedCount = profile.achievements.filter((a) => a.unlocked).length;

  return (
    <>
      <CardHeader
        title="Достижения"
        sub={`${unlockedCount} из ${profile.achievements.length}`}
      />
      <div className="px-5 pb-5">
        {profile.achievements.length === 0 ? (
          <p className="font-mono text-xs text-white/25 uppercase tracking-[0.15em] py-2">
            Пока нет достижений
          </p>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {profile.achievements.map((a) => {
              const IconComp = a.unlocked
                ? (a.icon ? (ACHIEVEMENT_ICONS[a.icon.toLowerCase()] ?? Award) : Award)
                : LockKeyhole;
              return (
                <div
                  key={a.id}
                  title={`${a.title} — ${a.description}`}
                  className={`aspect-square flex flex-col items-center justify-center gap-1.5 border-2 transition-all duration-300 ${
                    a.unlocked ? "" : "opacity-35"
                  }`}
                  style={
                    a.unlocked
                      ? {
                          borderColor: "rgba(16,185,129,0.24)",
                          background: "rgba(16,185,129,0.08)",
                          color: "#10B981",
                        }
                      : {
                          borderColor: "rgba(255,255,255,0.06)",
                          background: "rgba(255,255,255,0.015)",
                          color: "rgba(255,255,255,0.4)",
                        }
                  }
                >
                  <IconComp className={a.unlocked ? "size-[18px]" : "size-3.5"} />
                  <div className="font-mono text-[8.5px] uppercase tracking-[0.15em] text-center px-1 truncate w-full text-white/80 font-semibold">
                    {a.title}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
interface ProfileSectionProps {
  profile: UserProfile | undefined;
  loading: boolean;
  onProfileUpdate?: (data: { name: string; image: string | null }) => void;
  onNavigate?: (key: string) => void;
}

export function ProfileSection({
  profile,
  loading,
  onProfileUpdate,
  onNavigate,
}: ProfileSectionProps) {
  if (loading || !profile) return <ProfileSkeleton />;

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-4">

      {/* Row 1 — HUD strip */}
      <motion.div variants={item}>
        <HeroCard profile={profile} onProfileUpdate={onProfileUpdate} />
      </motion.div>

      {/* Row 2 — Stat bar (no shadow, inner-bordered StatBlocks) */}
      <motion.div variants={item}>
        <StatBar profile={profile} />
      </motion.div>

      {/* Row 3 — Next quests */}
      <motion.div variants={item}>
        <NextSteps profile={profile} onNavigate={onNavigate} />
      </motion.div>

      {/* Row 4 — Activity heatmap (8) + Weekly goals (4) */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <GlassCard className="lg:col-span-8">
          <div className="px-5 pt-4 pb-2 flex items-baseline justify-between">
            <div>
              <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-white/90">
                Активность
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 mt-1">
                Последние 140 дней
              </div>
            </div>
            <div className="font-mono text-[10px] text-white/25 uppercase tracking-[0.2em]">
              Серия · {profile.streak} дн.
            </div>
          </div>
          <div className="px-5 pb-5">
            <ActivityHeatmap activity={profile.activity} streak={profile.streak} />
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-4">
          <CardHeader title="Цели недели" sub="" />
          <WeeklyGoals profile={profile} />
        </GlassCard>
      </motion.div>

      {/* Row 5 — Skill radar (4) + Current courses (5) + Leaderboard (3) */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <GlassCard className="lg:col-span-4">
          <CardHeader title="Навыки" sub="По курсам" />
          <div className="px-5 pb-5">
            <SkillRadar skills={profile.skillRadar} />
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-5">
          <div className="px-5 pt-4 pb-2 flex items-center justify-between">
            <div>
              <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-white/90">
                Текущие курсы
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 mt-1">
                В процессе · {profile.currentCourses.length}
              </div>
            </div>
            {profile.currentCourses.length > 0 && (
              <button
                onClick={() => onNavigate?.("courses")}
                className="font-mono text-[10px] text-white/30 uppercase tracking-[0.15em] flex items-center gap-1 hover:text-white/60 transition-colors"
              >
                Все <ArrowRight className="size-2.5" />
              </button>
            )}
          </div>
          <CoursesList profile={profile} onNavigate={onNavigate} />
        </GlassCard>

        <GlassCard className="lg:col-span-3">
          <CardHeader title="Рейтинг" sub="Топ по XP" />
          <LeaderboardCard currentUserId={profile.id} compact />
        </GlassCard>
      </motion.div>

      {/* Row 6 — Achievements (7) + Recent activity (5) */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <GlassCard className="lg:col-span-7">
          <AchievementsGrid profile={profile} />
        </GlassCard>

        <GlassCard className="lg:col-span-5">
          <CardHeader title="События" sub="Последние действия" />
          <RecentActivityCard />
        </GlassCard>
      </motion.div>

    </motion.div>
  );
}
