"use client";

import { motion } from "framer-motion";

export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-[400px] z-20 bg-[#0F1011] border-2 border-white/[0.07] px-8 py-8"
      style={{ boxShadow: "4px 4px 0 0 rgba(16,185,129,0.35)" }}
    >
      {children}
    </motion.div>
  );
}
