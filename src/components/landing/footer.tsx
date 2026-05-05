import Link from "next/link";
import { G } from "./shared";

export function LandingFooter() {
  return (
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
  );
}
