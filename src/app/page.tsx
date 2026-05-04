"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import useSWR from "swr";
import Link from "next/link";
import { fetcher } from "@/lib/fetcher";
import { GraduationCap, BookOpen, Flame, ChevronRight, Code2, Trophy, Zap } from "lucide-react";

interface PublicStats {
  students: number;
  solvedToday: number;
  activeMatches: number;
}

const G  = "#10B981";
const GS = "rgba(16,185,129,0.09)";
const GL = "rgba(16,185,129,0.28)";

function formatNum(n: number) {
  return n.toLocaleString("ru-RU");
}

const FEATURES = [
  {
    icon: GraduationCap,
    title: "Интерактивные курсы",
    desc: "Пиши код прямо в браузере. Теория + практика в каждом уроке. Никакой воды — только работающий код.",
    tag: "курсы",
  },
  {
    icon: BookOpen,
    title: "Библиотека знаний",
    desc: "Справочники, шпаргалки и разборы алгоритмов. Всё что нужно — под рукой в одном месте.",
    tag: "материалы",
  },
  {
    icon: Trophy,
    title: "Геймификация",
    desc: "XP, уровни, стрики и достижения. Прогресс виден каждый день — мотивация не пропадает.",
    tag: "прогресс",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Регистрируйся",
    desc: "14 дней бесплатно. Без карты. Без обязательств. Просто начни.",
  },
  {
    n: "02",
    title: "Учись на практике",
    desc: "Решай задачи, пиши код, получай мгновенную обратную связь. Никаких видеолекций — только действие.",
  },
  {
    n: "03",
    title: "Растёшь каждый день",
    desc: "Отслеживай прогресс, защищай стрики, поднимайся в рейтинге. Программирование становится привычкой.",
  },
];

function GridBg() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    />
  );
}

function StatItem({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex flex-col gap-1 px-6 py-4 border-2 border-white/[0.07] bg-[#0F1011]">
      <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/35">{label}</span>
      <span
        className="font-mono text-[28px] font-black tabular-nums leading-none"
        style={{ color: accent ? G : "#fff" }}
      >
        {value}
      </span>
    </div>
  );
}

export default function LandingPage() {
  const { data: stats } = useSWR<PublicStats>("/api/public/stats", fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: false,
  });

  return (
    <div
      className="relative min-h-screen overflow-x-hidden font-sans antialiased selection:bg-[#10B981] selection:text-black"
      style={{ background: "#0A0A0B", color: "#fff" }}
    >
      <GridBg />

      {/* ── NAV ── */}
      <nav className="relative z-30 border-b-2 border-white/[0.07] flex items-center justify-between px-6 py-4 md:px-10">
        <a href="/" className="flex items-center gap-3">
          <img src="/logo.svg" alt="MavenCode" width={36} height={28} />
          <span className="font-mono text-[15px] font-black tracking-tight text-white">
            maven<span style={{ color: G }}>code</span>
          </span>
        </a>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="font-mono text-[11px] uppercase tracking-[0.2em] font-bold text-white/60 hover:text-white transition-colors px-4 py-2 border-2 border-white/10 hover:border-white/25"
          >
            Войти
          </Link>
          <Link
            href="/login?tab=register"
            className="font-mono text-[11px] uppercase tracking-[0.2em] font-bold px-4 py-2 border-2 transition-colors"
            style={{ background: G, borderColor: G, color: "#000", boxShadow: `3px 3px 0 0 ${GL}` }}
          >
            Начать бесплатно
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-16 md:pt-28 md:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 border-2 font-mono text-[10px] uppercase tracking-[0.25em] font-bold"
            style={{ borderColor: GL, color: G, background: GS }}
          >
            <Zap className="size-3" />
            платформа для программистов
          </div>

          <h1 className="font-mono text-[42px] md:text-[64px] font-black uppercase leading-[0.9] text-white max-w-[700px] mx-auto">
            Учись.<br />
            Практикуй.<br />
            <span style={{ color: G }}>Доминируй.</span>
          </h1>

          <p className="mt-6 font-mono text-[13px] md:text-[14px] leading-relaxed text-white/50 max-w-[480px] mx-auto">
            Интерактивные курсы по программированию, библиотека знаний и система прогресса.
            Пиши реальный код с первого урока.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/login?tab=register"
              className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.2em] font-black px-6 py-3.5 border-2 transition-all"
              style={{ background: G, borderColor: G, color: "#000", boxShadow: `4px 4px 0 0 ${GL}` }}
            >
              Начать бесплатно
              <ChevronRight className="size-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.2em] font-bold px-6 py-3.5 border-2 border-white/15 text-white/70 hover:border-white/30 hover:text-white transition-all"
            >
              Уже есть аккаунт
            </Link>
          </div>

          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/25">
            // 14 дней бесплатно · без карты · отмена в один клик
          </p>
        </motion.div>

        {/* Terminal mockup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 w-full max-w-[580px] mx-auto border-2 text-left"
          style={{ borderColor: GL, background: "#0F1011", boxShadow: `6px 6px 0 0 ${GL}` }}
        >
          <div className="flex items-center gap-2 px-4 py-2.5 border-b-2" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
            <div className="size-2.5 rounded-full bg-red-500/70" />
            <div className="size-2.5 rounded-full bg-yellow-500/70" />
            <div className="size-2.5 rounded-full" style={{ background: G + "aa" }} />
            <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/25">lesson_01.py</span>
          </div>
          <div className="p-5 font-mono text-[12px] leading-relaxed">
            <div className="text-white/30"># Задача: найти сумму элементов списка</div>
            <div className="mt-2">
              <span style={{ color: G }}>def</span>
              <span className="text-white"> sum_list</span>
              <span className="text-white/50">(nums: list[int]) </span>
              <span style={{ color: G }}>-{">"}</span>
              <span className="text-white/50"> int:</span>
            </div>
            <div className="pl-6 text-white/70">
              <span style={{ color: G }}>return</span> sum(nums)
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span
                className="px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-[0.1em] border-2"
                style={{ color: G, borderColor: GL, background: GS }}
              >
                ✓ тесты пройдены
              </span>
              <span className="text-white/30 text-[11px]">+50 XP</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <section className="relative z-10 px-6 pb-16 md:px-10">
        <div className="max-w-[900px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <StatItem label="студентов" value={stats ? formatNum(stats.students) : "—"} />
            <StatItem label="решено сегодня" value={stats ? formatNum(stats.solvedToday) : "—"} />
            <StatItem label="дней бесплатно" value="14" accent />
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="relative z-10 px-6 py-16 md:px-10 border-t-2 border-white/[0.06]">
        <div className="max-w-[900px] mx-auto">
          <div className="mb-10 flex items-center gap-4">
            <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/30">// возможности</div>
            <div className="flex-1 h-px bg-white/[0.07]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.tag}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="border-2 border-white/[0.07] p-6 bg-[#0F1011] flex flex-col gap-4 hover:border-white/15 transition-colors"
                >
                  <div
                    className="size-10 grid place-items-center border-2"
                    style={{ background: GS, borderColor: GL }}
                  >
                    <Icon className="size-4" style={{ color: G }} />
                  </div>
                  <div>
                    <div className="font-mono text-[9px] uppercase tracking-[0.3em] mb-2" style={{ color: G }}>
                      // {f.tag}
                    </div>
                    <h3 className="font-mono text-[15px] font-black uppercase text-white mb-2">{f.title}</h3>
                    <p className="font-mono text-[12px] leading-relaxed text-white/45">{f.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative z-10 px-6 py-16 md:px-10 border-t-2 border-white/[0.06]">
        <div className="max-w-[900px] mx-auto">
          <div className="mb-10 flex items-center gap-4">
            <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/30">// как это работает</div>
            <div className="flex-1 h-px bg-white/[0.07]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-3"
              >
                <div
                  className="font-mono text-[32px] font-black leading-none"
                  style={{ color: GL }}
                >
                  {s.n}
                </div>
                <h3 className="font-mono text-[14px] font-black uppercase text-white">{s.title}</h3>
                <p className="font-mono text-[12px] leading-relaxed text-white/40">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BLOCK ── */}
      <section className="relative z-10 px-6 py-16 md:px-10 border-t-2 border-white/[0.06]">
        <div className="max-w-[900px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="border-2 p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
            style={{ borderColor: GL, background: GS, boxShadow: `6px 6px 0 0 ${GL}` }}
          >
            <div>
              <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/40 mb-3">
                // начни сегодня
              </div>
              <h2 className="font-mono text-[26px] md:text-[32px] font-black uppercase text-white leading-tight">
                Первые 14 дней<br />
                <span style={{ color: G }}>бесплатно.</span>
              </h2>
              <p className="mt-2 font-mono text-[12px] text-white/40">
                // без карты · без обязательств · отмена в один клик
              </p>
            </div>
            <Link
              href="/login?tab=register"
              className="flex-shrink-0 inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.2em] font-black px-8 py-4 border-2 transition-all"
              style={{ background: G, borderColor: "#000", color: "#000", boxShadow: "4px 4px 0 0 #000" }}
            >
              Создать аккаунт
              <ChevronRight className="size-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t-2 border-white/[0.07] px-6 py-6 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="MavenCode" width={24} height={20} />
          <span className="font-mono text-[11px] font-bold text-white/40">
            maven<span style={{ color: G + "99" }}>code</span> · 2026
          </span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
          <a href="/legal/terms" className="hover:text-white/60 transition-colors">Условия</a>
          <a href="/legal/privacy" className="hover:text-white/60 transition-colors">Конфиденциальность</a>
          <Link href="/login" className="hover:text-white/60 transition-colors">Войти</Link>
        </div>
      </footer>
    </div>
  );
}
