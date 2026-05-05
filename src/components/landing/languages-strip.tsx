"use client";

import { motion } from "framer-motion";
import { G } from "./shared";

const LANGS = [
  { name: "Python",     color: "#3B82F6" },
  { name: "JavaScript", color: "#EAB308" },
  { name: "TypeScript", color: "#60A5FA" },
  { name: "Go",         color: "#22D3EE" },
  { name: "SQL",        color: G },
  { name: "HTML/CSS",   color: "#F97316" },
  { name: "React",      color: "#38BDF8" },
  { name: "Docker",     color: "#60A5FA" },
  { name: "Git",        color: "#F87171" },
  { name: "Linux",      color: "#A3E635" },
  { name: "Rust",       color: "#FB923C" },
  { name: "Алгоритмы",  color: G },
];

export function LanguagesStrip() {
  return (
    <section className="relative z-10 px-6 py-14 md:px-10 border-t-2 border-white/[0.06]">
      <div className="max-w-[1100px] mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/30">
            // 12 технологий и растёт
          </div>
          <div className="flex-1 h-px bg-white/[0.07]" />
        </div>
        <div className="flex flex-wrap gap-2">
          {LANGS.map((l, i) => (
            <motion.div
              key={l.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.08, backgroundColor: l.color + "1a" }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
              className="px-3 py-1.5 border-2 font-mono text-[11px] font-bold uppercase tracking-[0.15em] cursor-default"
              style={{
                borderColor: l.color + "44",
                color: l.color,
                background: l.color + "0d",
              }}
            >
              {l.name}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
