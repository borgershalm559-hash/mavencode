"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { G, GL, EASE } from "./shared";

export function FinalCta() {
  return (
    <section className="relative z-10 px-6 py-20 md:px-10 border-t-2 border-white/[0.06]">
      <div className="max-w-[720px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          className="bg-[#0F1011] border-2 border-white/[0.07]"
          style={{ boxShadow: `8px 8px 0 0 rgba(16,185,129,0.55)` }}
        >
          <div className="flex items-center gap-2 px-4 py-2.5 border-b-2 border-white/[0.07]">
            <div className="size-2.5 rounded-full bg-red-500/70" />
            <div className="size-2.5 rounded-full bg-yellow-500/70" />
            <div className="size-2.5 rounded-full" style={{ background: G + "aa" }} />
            <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
              register.sh
            </span>
          </div>

          <div className="p-8 md:p-12 text-center">
            <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/30 mb-4">
              // начни сегодня
            </div>
            <h2 className="font-mono text-[32px] md:text-[44px] font-black uppercase text-white leading-tight">
              Стань лучше.<br />
              <span style={{ color: G }}>Каждый день.</span>
            </h2>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/login?tab=register"
                className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.2em] font-black px-8 py-4 border-2 transition-all"
                style={{ background: G, borderColor: G, color: "#000", boxShadow: `4px 4px 0 0 ${GL}` }}
              >
                Создать аккаунт
                <ChevronRight className="size-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.2em] font-bold px-8 py-4 border-2 border-white/15 text-white/60 hover:border-white/30 hover:text-white transition-all"
              >
                Войти
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
