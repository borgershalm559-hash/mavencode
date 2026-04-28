"use client";

import useSWR from "swr";
import Link from "next/link";
import Image from "next/image";
import { fetcher } from "@/lib/fetcher";
import {
  Users, GraduationCap, BookOpen, Newspaper, Library, Loader2,
  TrendingUp, TrendingDown, ShieldCheck, Activity, Award, ArrowRight,
} from "lucide-react";

interface Stats {
  counts: {
    users: number;
    admins: number;
    publishedCourses: number;
    draftCourses: number;
    publishedLessons: number;
    draftLessons: number;
    news: number;
    library: number;
    completedLessons: number;
  };
  growth: { signupsLast30: number; signupsPrev30: number; delta: number | null };
  timeline: { days: string[]; signups: number[]; activity: number[] };
  topCourses: Array<{ id: string; title: string; count: number }>;
  recentUsers: Array<{
    id: string; name: string | null; email: string; image: string | null;
    role: string; level: number; xp: number; createdAt: string;
  }>;
}

export default function AdminPage() {
  const { data, isLoading } = useSWR<Stats>("/api/admin/stats", fetcher);

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-5 h-5 text-[#10B981]/50 animate-spin" />
      </div>
    );
  }

  const { counts, growth, timeline, topCourses, recentUsers } = data;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-bold font-mono uppercase tracking-[0.15em] text-white/90">Аналитика</h1>
        <p className="text-[12px] text-white/40 font-mono mt-1">Снимок платформы за последние 30 дней</p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi
          icon={Users}
          label="Пользователи"
          value={counts.users}
          subtitle={`${counts.admins} админов`}
          accent
        />
        <Kpi
          icon={GraduationCap}
          label="Курсы"
          value={counts.publishedCourses}
          subtitle={counts.draftCourses > 0 ? `+${counts.draftCourses} в черновиках` : "все опубликованы"}
        />
        <Kpi
          icon={BookOpen}
          label="Уроки"
          value={counts.publishedLessons}
          subtitle={counts.draftLessons > 0 ? `+${counts.draftLessons} в черновиках` : "все опубликованы"}
        />
        <Kpi
          icon={Award}
          label="Завершённые уроки"
          value={counts.completedLessons}
          subtitle="всего по платформе"
        />
      </div>

      {/* Secondary counts */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MiniStat icon={Newspaper} label="Новостей" value={counts.news} href="/admin/news" />
        <MiniStat icon={Library} label="Библиотека" value={counts.library} href="/admin/library" />
        <MiniStat icon={ShieldCheck} label="Админов" value={counts.admins} href="/admin/users?role=admin" />
        <MiniStat icon={Activity} label="Драфт-уроков" value={counts.draftLessons} href="/admin/courses" />
      </div>

      {/* Growth chart + signups card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard
          title="Регистрации"
          subtitle="за последние 30 дней"
          values={timeline.signups}
          days={timeline.days}
          color="#10B981"
        />
        <ChartCard
          title="Активность"
          subtitle="события пользователей"
          values={timeline.activity}
          days={timeline.days}
          color="#F59E0B"
        />
        <div className="border-2 border-white/[0.07] bg-[#0F1011] p-5">
          <div className="font-mono mb-2" style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>
            Прирост за 30 дней
          </div>
          <div className="text-[36px] text-white">{growth.signupsLast30}</div>
          <div className="text-[12px] text-white/45 font-mono">новых аккаунтов</div>
          <div className="mt-3 text-[11px] text-white/35 font-mono">
            Предыдущий период: {growth.signupsPrev30}
          </div>
          {growth.delta !== null && (
            <div
              className="mt-2 inline-flex items-center gap-1 font-mono text-[11px]"
              style={{ color: growth.delta >= 0 ? "#10B981" : "#ef4444" }}
            >
              {growth.delta >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {growth.delta >= 0 ? "+" : ""}{growth.delta}%
            </div>
          )}
        </div>
      </div>

      {/* Top courses + recent users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="border-2 border-white/[0.07] bg-[#0F1011] p-5">
          <div className="font-mono mb-3" style={{ fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", fontWeight: 700 }}>
            § Топ курсов
          </div>
          {topCourses.length === 0 ? (
            <div className="text-[12px] text-white/40 font-mono">Пока нет данных</div>
          ) : (
            <div className="space-y-2">
              {topCourses.map((c, i) => {
                const max = topCourses[0].count || 1;
                const pct = Math.round((c.count / max) * 100);
                return (
                  <Link
                    key={c.id}
                    href={`/admin/courses/${c.id}`}
                    className="block group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[13px] text-white/85 group-hover:text-[#10B981] truncate">
                        <span className="font-mono text-white/35 mr-2">#{i + 1}</span>
                        {c.title}
                      </span>
                      <span className="font-mono text-[11px] text-white/55 ml-2 flex-shrink-0">{c.count}</span>
                    </div>
                    <div className="h-1.5 bg-white/[0.04] overflow-hidden">
                      <div className="h-full bg-[#10B981]/70" style={{ width: `${pct}%` }} />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-2 border-white/[0.07] bg-[#0F1011] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="font-mono" style={{ fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", fontWeight: 700 }}>
              § Новые пользователи
            </div>
            <Link
              href="/admin/users"
              className="font-mono text-[10px] text-white/40 hover:text-[#10B981] inline-flex items-center gap-1"
              style={{ letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700 }}
            >
              Все <ArrowRight size={10} />
            </Link>
          </div>
          {recentUsers.length === 0 ? (
            <div className="text-[12px] text-white/40 font-mono">Пока нет регистраций</div>
          ) : (
            <div className="space-y-1">
              {recentUsers.map((u) => (
                <Link
                  key={u.id}
                  href={`/admin/users/${u.id}`}
                  className="flex items-center gap-3 px-2 py-2 hover:bg-white/[0.03] group"
                >
                  <div className="w-8 h-8 border-2 border-white/[0.08] bg-[#0B0B0C] flex items-center justify-center overflow-hidden flex-shrink-0">
                    {u.image ? (
                      <Image src={u.image} alt="" width={32} height={32} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[12px] font-mono text-white/55">
                        {(u.name || u.email).charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] text-white truncate group-hover:text-[#10B981]">
                      {u.name || "—"}
                    </div>
                    <div className="text-[11px] text-white/45 truncate font-mono">{u.email}</div>
                  </div>
                  <span className="font-mono text-[10px] text-white/40">
                    Lv.{u.level} · {u.xp} XP
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Kpi({
  icon: Icon, label, value, subtitle, accent,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: number;
  subtitle?: string;
  accent?: boolean;
}) {
  return (
    <div
      className="border-2 px-5 py-4"
      style={{
        borderColor: accent ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.07)",
        background: "#0F1011",
        boxShadow: accent ? "4px 4px 0 0 rgba(16,185,129,0.4)" : undefined,
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="size-10 border-2 flex items-center justify-center flex-shrink-0"
          style={{
            borderColor: accent ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.08)",
            background: accent ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.02)",
          }}
        >
          <Icon size={18} className={accent ? "text-[#10B981]/80" : "text-white/55"} />
        </div>
        <div className="min-w-0">
          <div className="text-[24px] font-bold font-mono text-white/90">{value}</div>
          <div className="text-[10px] text-white/40 font-mono" style={{ letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700 }}>{label}</div>
          {subtitle && <div className="text-[10px] text-white/35 font-mono mt-0.5 truncate">{subtitle}</div>}
        </div>
      </div>
    </div>
  );
}

function MiniStat({
  icon: Icon, label, value, href,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="border-2 border-white/[0.07] bg-[#0F1011] px-4 py-3 hover:border-[#10B981]/30 transition-colors group"
    >
      <div className="flex items-center gap-3">
        <Icon size={16} className="text-white/45 group-hover:text-[#10B981]" />
        <div className="flex-1 min-w-0">
          <div className="text-[18px] font-mono text-white/85">{value}</div>
          <div className="text-[10px] text-white/40 font-mono" style={{ letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700 }}>{label}</div>
        </div>
      </div>
    </Link>
  );
}

function ChartCard({
  title, subtitle, values, days, color,
}: {
  title: string;
  subtitle: string;
  values: number[];
  days: string[];
  color: string;
}) {
  const max = Math.max(1, ...values);
  const total = values.reduce((s, v) => s + v, 0);
  const w = 320;
  const h = 80;
  const barWidth = w / values.length;

  return (
    <div className="border-2 border-white/[0.07] bg-[#0F1011] p-5">
      <div className="flex items-baseline justify-between mb-2">
        <div>
          <div className="font-mono" style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>
            {title}
          </div>
          <div className="text-[10px] text-white/30 font-mono mt-0.5">{subtitle}</div>
        </div>
        <div className="text-[20px] text-white font-mono">{total}</div>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none" style={{ height: 80 }}>
        {values.map((v, i) => {
          const bh = (v / max) * (h - 4);
          return (
            <rect
              key={days[i]}
              x={i * barWidth + 1}
              y={h - bh}
              width={Math.max(1, barWidth - 2)}
              height={bh}
              fill={color}
              opacity={v === 0 ? 0.15 : 0.7}
            />
          );
        })}
      </svg>
      <div className="flex items-center justify-between mt-1 font-mono text-[9px] text-white/30">
        <span>{days[0]?.slice(5)}</span>
        <span>{days[days.length - 1]?.slice(5)}</span>
      </div>
    </div>
  );
}
