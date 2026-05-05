"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import useSWR from "swr";
import { ArrowRight } from "lucide-react";
import { fetcher } from "@/lib/fetcher";
import { G, GL, EASE, type PublicCourse } from "./shared";

export function CoursesStrip() {
  const { data: courses } = useSWR<PublicCourse[]>("/api/public/courses", fetcher, {
    revalidateOnFocus: false,
  });

  return (
    <section className="relative z-10 px-6 py-16 md:px-10 border-t-2 border-white/[0.06]">
      <div className="max-w-[1100px] mx-auto">
        <div className="mb-8 flex items-baseline gap-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/30">
            // курсы / опубликованные
          </div>
          <div className="flex-1 h-px bg-white/[0.07]" />
          <Link
            href="/login?tab=register"
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 hover:text-white inline-flex items-center gap-1"
          >
            все курсы <ArrowRight className="size-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(courses ?? Array.from({ length: 4 }).map(() => null)).map((c, i) => (
            <CourseCard key={c?.id ?? i} course={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CourseCard({ course, index }: { course: PublicCourse | null; index: number }) {
  const c = course;
  const accent = c?.color ?? G;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: EASE }}
      className="group relative bg-[#0F1011] border-2 border-white/[0.07] hover:border-white/20 transition-all"
      style={{ boxShadow: `4px 4px 0 0 ${GL}` }}
    >
      {/* color stripe */}
      <div className="h-1.5" style={{ background: accent }} />

      <div className="p-5 flex flex-col gap-3 min-h-[180px]">
        {!c ? (
          <>
            <div className="h-4 w-24 bg-white/[0.06] animate-pulse" />
            <div className="h-6 w-full bg-white/[0.06] animate-pulse" />
            <div className="h-3 w-3/4 bg-white/[0.06] animate-pulse" />
          </>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <span
                className="size-9 grid place-items-center font-mono text-[12px] font-black border-2"
                style={{ color: accent, borderColor: accent + "55", background: accent + "0d" }}
              >
                {c.iconText ?? c.title.slice(0, 2).toUpperCase()}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">
                {c.difficulty}
              </span>
            </div>

            <h3 className="font-mono text-[14px] font-black uppercase text-white leading-tight">
              {c.title}
            </h3>

            <p className="font-mono text-[11px] leading-relaxed text-white/45 line-clamp-2">
              {c.description}
            </p>

            <div className="mt-auto pt-3 border-t-2 border-white/[0.05] flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                {c.lessonCount} уроков
              </span>
              <Link
                href="/login?tab=register"
                className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold inline-flex items-center gap-1 group-hover:text-white"
                style={{ color: accent }}
              >
                открыть <ArrowRight className="size-3" />
              </Link>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
