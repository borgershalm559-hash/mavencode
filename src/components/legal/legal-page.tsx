"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface LegalPageProps {
  eyebrow: string;
  title: string;
  updatedAt: string;
  children: React.ReactNode;
}

const ACCENT = "#10B981";

export function LegalPage({ eyebrow, title, updatedAt, children }: LegalPageProps) {
  return (
    <div
      className="relative min-h-screen font-sans antialiased selection:bg-[#10B981] selection:text-black"
      style={{ background: "#0A0A0B", color: "#EDEDED" }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-3xl mx-auto px-6 lg:px-10 py-16 lg:py-24"
      >
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-white/35 hover:text-[#10B981] transition-colors mb-12"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          назад
        </Link>

        {/* Eyebrow */}
        <div className="font-mono text-[10px] uppercase tracking-[0.35em]" style={{ color: ACCENT }}>
          {eyebrow}
        </div>

        {/* Title */}
        <h1 className="mt-3 font-mono text-[clamp(32px,5vw,48px)] font-bold uppercase tracking-[-0.01em] leading-[1.05]">
          {title}
        </h1>

        {/* Meta */}
        <div className="mt-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/30">
          <span>обновлено</span>
          <span className="h-px flex-1 max-w-[40px] bg-white/10" />
          <span className="text-white/55">{updatedAt}</span>
        </div>

        {/* Content */}
        <div className="mt-14 space-y-10 legal-content">{children}</div>

        {/* Footer */}
        <div className="mt-20 pt-6 border-t-2 border-white/[0.06] flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-white/25">
          <span>mavencode — 2026</span>
          <div className="flex gap-4">
            <Link href="/legal/terms" className="hover:text-white/60 transition-colors">
              условия
            </Link>
            <Link href="/legal/privacy" className="hover:text-white/60 transition-colors">
              конфиденциальность
            </Link>
          </div>
        </div>
      </motion.div>

      <style jsx global>{`
        .legal-content h2 {
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: ${ACCENT};
          border-top: 2px solid rgba(255, 255, 255, 0.08);
          padding-top: 22px;
          margin-top: 8px;
          margin-bottom: 16px;
        }
        .legal-content h2::before {
          content: counter(section, decimal-leading-zero) " · ";
          color: rgba(255, 255, 255, 0.3);
          counter-increment: section;
        }
        .legal-content {
          counter-reset: section;
          font-size: 15px;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.72);
        }
        .legal-content p {
          margin: 0 0 12px;
        }
        .legal-content ul {
          margin: 10px 0 16px;
          padding-left: 0;
          list-style: none;
        }
        .legal-content ul li {
          position: relative;
          padding-left: 22px;
          margin: 6px 0;
        }
        .legal-content ul li::before {
          content: "—";
          position: absolute;
          left: 0;
          color: ${ACCENT};
          opacity: 0.6;
        }
        .legal-content strong {
          color: #fff;
          font-weight: 600;
        }
        .legal-content code {
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 13px;
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.22);
          padding: 1px 6px;
          color: ${ACCENT};
        }
      `}</style>
    </div>
  );
}
