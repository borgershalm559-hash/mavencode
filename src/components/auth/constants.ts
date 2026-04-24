/* Variant C — Brutalist / editor-first */

export const inputClass =
  "h-11 bg-surface border-2 border-white/[0.08] text-white/90 rounded-none transition-colors duration-150 placeholder:text-white/25 pl-10 text-[15px] font-medium focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus:border-[#10B981]/60";

export const labelClass =
  "block text-[11px] font-mono uppercase tracking-[0.12em] mb-2 text-white/50";

/* ── Stagger variants ── */
export const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
} as const;

export const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  },
};
