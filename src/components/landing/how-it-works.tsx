"use client";

import { motion } from "framer-motion";
import { G, EASE } from "./shared";

interface Step {
  filename: string;
  title: string;
  shadow: string;
  minH: string;
  body: React.ReactNode;
}

const STEPS: Step[] = [
  {
    filename: "STEP_01.md",
    title: "Регистрация → 30 секунд",
    shadow: "shadow-[2px_2px_0_0_rgba(16,185,129,0.28)] lg:shadow-[3px_3px_0_0_rgba(16,185,129,0.28)]",
    minH: "min-h-[260px]",
    body: (
      <div className="font-mono text-[11px] text-white/60 space-y-1">
        <div className="text-white/30">$ curl -X POST /api/register</div>
        <div className="text-white/30">  -d 'email=you@maven.code'</div>
        <div className="text-white/30">  -d 'password=********'</div>
        <div style={{ color: G }}>{"> 201 Created"}</div>
        <div style={{ color: G }}>{"> session: ok"}</div>
      </div>
    ),
  },
  {
    filename: "STEP_02.md",
    title: "Решай задачи",
    shadow: "shadow-[2px_2px_0_0_rgba(16,185,129,0.28)] lg:shadow-[5px_5px_0_0_rgba(16,185,129,0.28)]",
    minH: "min-h-[320px]",
    body: <EditorMock />,
  },
  {
    filename: "STEP_03.md",
    title: "Растёшь каждый день",
    shadow: "shadow-[2px_2px_0_0_rgba(16,185,129,0.28)] lg:shadow-[4px_4px_0_0_rgba(16,185,129,0.28)]",
    minH: "min-h-[290px]",
    body: <StreakMock />,
  },
];

export function HowItWorks() {
  return (
    <section className="relative z-10 px-6 py-16 md:px-10 border-t-2 border-white/[0.06]">
      <div className="max-w-[1100px] mx-auto">
        <div className="mb-10 flex items-center gap-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/30">
            // как устроено
          </div>
          <div className="flex-1 h-px bg-white/[0.07]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.filename}
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ y: -4, scale: 1.015 }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: EASE }}
              className={`relative bg-[#0F1011] border-2 border-white/[0.07] flex flex-col ${s.minH} ${s.shadow}`}
            >
              <div className="px-5 py-2 border-b-2 border-white/[0.07] flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                  {s.filename}
                </span>
                <span className="font-mono text-[10px] font-black tabular-nums" style={{ color: G }}>
                  0{i + 1}
                </span>
              </div>
              <div className="p-5 flex-1">
                <h3 className="font-mono text-[14px] font-black uppercase text-white mb-4">
                  {s.title}
                </h3>
                {s.body}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Inline mockups ──────────────────────────────────────────────────────────

function EditorMock() {
  return (
    <div className="bg-black border-2 border-white/[0.05] font-mono text-[11px] leading-tight">
      <div className="flex items-center gap-1.5 px-2 py-1 border-b-2 border-white/[0.05]">
        <div className="size-1.5 rounded-full bg-red-500/70" />
        <div className="size-1.5 rounded-full bg-yellow-500/70" />
        <div className="size-1.5 rounded-full" style={{ background: G + "aa" }} />
        <span className="ml-1 text-[9px] uppercase tracking-[0.2em] text-white/25">main.py</span>
      </div>
      <div className="px-3 py-3 text-white/70">
        <div><span className="text-white/30 mr-2">1</span><span style={{ color: G }}>def</span> <span className="text-white">solve</span>(<span className="text-white/50">arr</span>):</div>
        <div><span className="text-white/30 mr-2">2</span>    <span style={{ color: G }}>return</span> <span className="text-white">sum</span>(arr)</div>
        <div><span className="text-white/30 mr-2">3</span></div>
        <div><span className="text-white/30 mr-2">4</span><span className="text-white">solve</span>([<span style={{ color: "#A3E635" }}>1</span>,<span style={{ color: "#A3E635" }}>2</span>,<span style={{ color: "#A3E635" }}>3</span>])</div>
      </div>
      <div className="border-t-2 border-white/[0.05] px-3 py-1.5 text-[10px] flex items-center justify-between">
        <span className="text-white/30">3 теста</span>
        <span style={{ color: G }}>✓ pass</span>
      </div>
    </div>
  );
}

function StreakMock() {
  const cells = Array.from({ length: 49 }, (_, i) => {
    const intensity = Math.floor(Math.sin(i * 0.7) * 0.5 * 100 + 50) / 100;
    return intensity;
  });
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-7 gap-[3px]">
        {cells.map((v, i) => (
          <div
            key={i}
            className="aspect-square"
            style={{ background: v > 0.1 ? `rgba(16,185,129,${v})` : "rgba(255,255,255,0.04)" }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
        <span>49 дней</span>
        <span style={{ color: G }}>стрик 23</span>
      </div>
    </div>
  );
}
