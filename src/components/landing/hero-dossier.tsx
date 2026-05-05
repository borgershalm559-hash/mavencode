"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import useSWR from "swr";
import { ChevronRight } from "lucide-react";
import { fetcher } from "@/lib/fetcher";
import { G, GL, EASE, formatNum, type PublicStats } from "./shared";

export function HeroDossier() {
  const { data: stats } = useSWR<PublicStats>("/api/public/stats", fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: false,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE }}
      className="relative bg-black border-2 border-[#10B981]/60 p-7 md:p-9 flex flex-col justify-between min-h-[480px] md:min-h-[560px]"
    >
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
          // маяк / 2026
        </div>

        <h1 className="mt-5 font-mono text-[40px] md:text-[52px] leading-[0.95] font-black uppercase text-white">
          Учись.<br />
          Практикуй.<br />
          <span style={{ color: G }}>Доминируй.</span>
        </h1>

        <p className="mt-6 font-mono text-[12px] md:text-[13px] leading-relaxed text-white/55 max-w-[320px]">
          Интерактивные курсы, живой код в браузере, прогресс через действие.
          Не лекции — практика.
        </p>

        <div className="mt-6 flex flex-col gap-1 font-mono text-[11px] text-white/40">
          <div>// без видеолекций</div>
          <div>// без карты</div>
          <div>// без воды</div>
        </div>

        <Link
          href="/login?tab=register"
          className="mt-8 inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.2em] font-black px-6 py-3.5 border-2 transition-all"
          style={{ background: G, borderColor: G, color: "#000", boxShadow: `4px 4px 0 0 ${GL}` }}
        >
          Начать бесплатно
          <ChevronRight className="size-4" />
        </Link>
      </div>

      <div className="mt-10 space-y-3">
        <StatRow label="students"     value={stats ? formatNum(stats.students) : "—"} />
        <StatRow label="solved today" value={stats ? formatNum(stats.solvedToday) : "—"} />
        <StatRow label="courses"      value={stats ? formatNum(stats.coursesCount) : "—"} />
      </div>

      <div
        className="absolute -bottom-4 -right-2 rotate-[-6deg] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] font-bold border-2 border-black select-none"
        style={{ background: G, color: "#000", boxShadow: "3px 3px 0 0 #fff" }}
      >
        без воды
      </div>
    </motion.div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between border-t-2 border-white/10 pt-3">
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
        &gt; {label}
      </span>
      <span className="font-mono text-[20px] font-bold text-white tabular-nums">{value}</span>
    </div>
  );
}
