"use client";

import { motion } from "framer-motion";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { G } from "./shared";

// Color + display order for every technology the platform might cover.
// Only the techs present in the API response (i.e. that have at least one
// published course) are rendered. Names must match `/api/public/technologies`.
const TECH_COLORS: { name: string; color: string }[] = [
  { name: "Python",     color: "#3B82F6" },
  { name: "JavaScript", color: "#EAB308" },
  { name: "TypeScript", color: "#60A5FA" },
  { name: "Go",         color: "#22D3EE" },
  { name: "SQL",        color: G },
  { name: "HTML",       color: "#F97316" },
  { name: "CSS",        color: "#60A5FA" },
  { name: "React",      color: "#38BDF8" },
  { name: "Next.js",    color: "#A3E635" },
  { name: "Docker",     color: "#60A5FA" },
  { name: "Git",        color: "#F87171" },
  { name: "Linux",      color: "#A3E635" },
  { name: "Rust",       color: "#FB923C" },
  { name: "Алгоритмы",  color: G },
];

export function LanguagesStrip() {
  const { data: available } = useSWR<string[]>(
    "/api/public/technologies",
    fetcher,
    { revalidateOnFocus: false }
  );

  const visible = available
    ? TECH_COLORS.filter((t) => available.includes(t.name))
    : [];

  return (
    <section className="relative z-10 px-6 py-14 md:px-10 border-t-2 border-white/[0.06]">
      <div className="max-w-[1100px] mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/30">
            {available
              ? `// ${visible.length} ${pluralRu(visible.length, ["технология", "технологии", "технологий"])} и растёт`
              : "// технологии"}
          </div>
          <div className="flex-1 h-px bg-white/[0.07]" />
        </div>
        <div className="flex flex-wrap gap-2 min-h-[36px]">
          {visible.map((l, i) => (
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

// Russian plural form: 1 технология, 2-4 технологии, 5+ технологий.
function pluralRu(n: number, forms: [string, string, string]): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
}
