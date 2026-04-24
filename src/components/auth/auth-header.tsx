"use client";

import { motion } from "framer-motion";

export function AuthHeader() {
  return (
    <div className="text-center mb-10">
      {/* Logo mark */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="inline-block mb-6"
      >
        <div className="inline-flex items-center justify-center w-12 h-12 bg-[#10B981]/[0.08] border-2 border-[#10B981]/25">
          <span className="text-[#10B981] font-bold text-lg tracking-tight">M</span>
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="text-xl font-bold tracking-tight text-white"
      >
        MavenCode
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="text-sm text-white/30 mt-2 font-normal tracking-wide"
      >
        Обучение через код
      </motion.p>
    </div>
  );
}
