"use client";

import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { G, formatNum, type PublicStats } from "./shared";

const QUERIES = [
  { sql: "SELECT COUNT(*) FROM users;",          key: "students" as const },
  { sql: "SELECT SUM(count) FROM today;",        key: "solvedToday" as const },
  { sql: "SELECT COUNT(*) FROM courses;",        key: "coursesCount" as const },
];

export function StatsSql() {
  const { data: stats } = useSWR<PublicStats>("/api/public/stats", fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: false,
  });
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVisible(true);
        obs.disconnect();
      }
    }, { threshold: 0.4 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative z-10 border-y-2 border-white/[0.07] bg-[#0A0A0B] py-6 px-6 md:px-10"
    >
      <div className="max-w-[1100px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 font-mono text-[11px] md:text-[12px]">
          {QUERIES.map((q, i) => (
            <SqlRow
              key={q.sql}
              sql={q.sql}
              value={stats ? formatNum(stats[q.key]) : "—"}
              start={visible}
              delay={i * 600}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function SqlRow({ sql, value, start, delay }: { sql: string; value: string; start: boolean; delay: number }) {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (!start) return;
    let interval: ReturnType<typeof setInterval> | null = null;
    const t = setTimeout(() => {
      let i = 0;
      interval = setInterval(() => {
        i++;
        setTyped(sql.slice(0, i));
        if (i >= sql.length && interval !== null) {
          clearInterval(interval);
          interval = null;
        }
      }, 30);
    }, delay);
    return () => {
      clearTimeout(t);
      if (interval !== null) clearInterval(interval);
    };
  }, [start, delay, sql]);

  const done = typed === sql;

  return (
    <div className="flex items-center gap-3">
      <span className="text-white/35">&gt;</span>
      <span className="text-white/65 flex-1 truncate">{typed}<BlinkCursor visible={!done} /></span>
      <span className="animate-pulse" style={{ color: G }}>▸</span>
      <span className="font-black tabular-nums" style={{ color: G }}>{done ? value : "…"}</span>
    </div>
  );
}

function BlinkCursor({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return <span className="inline-block w-[6px] h-[12px] bg-white/60 animate-pulse ml-0.5 align-middle" />;
}
