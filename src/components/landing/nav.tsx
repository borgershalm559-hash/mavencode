"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { G, GL } from "./shared";

const MotionLink = motion.create(Link);

export function LandingNav() {
  return (
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
        <MotionLink
          href="/login?tab=register"
          whileTap={{ scale: 0.96 }}
          className="font-mono text-[11px] uppercase tracking-[0.2em] font-bold px-4 py-2 border-2 transition-colors"
          style={{ background: G, borderColor: G, color: "#000", boxShadow: `3px 3px 0 0 ${GL}` }}
        >
          Начать бесплатно
        </MotionLink>
      </div>
    </nav>
  );
}
