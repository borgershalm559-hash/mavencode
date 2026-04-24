"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, X, AlertTriangle } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface HintsDrawerProps {
  hints: string[];
  hintsUsed: number;
  xpReward: number;
  isOpen: boolean;
  onClose: () => void;
  onRevealHint: () => void;
  onCopyToEditor?: (code: string) => void;
}

const XP_LABELS = ["100%", "75%", "50%", "25%"];

export function HintsDrawer({
  hints,
  hintsUsed,
  xpReward,
  isOpen,
  onClose,
  onRevealHint,
}: HintsDrawerProps) {
  const nextHintIndex = hintsUsed;
  const nextXpPercent = XP_LABELS[Math.min(nextHintIndex + 1, 3)];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 bg-surface border-l-2 border-[#10B981]/20 flex flex-col"
            style={{ boxShadow: "-6px 0 0 0 rgba(16,185,129,0.3)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b-2 border-white/[0.07]">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-[#10B981]" />
                <span className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-white">Подсказки</span>
              </div>
              <button
                onClick={onClose}
                className="size-8 flex items-center justify-center border-2 border-white/[0.07] text-white/40 hover:text-white/70 hover:border-white/[0.15] transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Hints list */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
              {hints.map((hint, i) => (
                <div key={i}>
                  {i < hintsUsed ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-[#10B981]/[0.04] border-2 border-[#10B981]/20"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-[10px] text-[#10B981] uppercase tracking-widest">
                          Подсказка {i + 1}
                        </span>
                      </div>
                      <div className="text-sm text-white/65 leading-relaxed">
                        <ReactMarkdown>{hint}</ReactMarkdown>
                      </div>
                    </motion.div>
                  ) : i === nextHintIndex ? (
                    <div className="p-4 border-2 border-dashed border-[#10B981]/30 bg-[#10B981]/[0.02]">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-3.5 h-3.5 text-[#10B981]/70" />
                        <span className="font-mono text-xs text-white/40">
                          XP снизится до {nextXpPercent} ({Math.round(xpReward * parseFloat(nextXpPercent) / 100)} XP)
                        </span>
                      </div>
                      <button
                        onClick={onRevealHint}
                        className="w-full py-2.5 border-2 border-[#10B981]/30 bg-[#10B981]/[0.06] font-mono text-sm font-medium text-[#10B981] hover:bg-[#10B981]/[0.12] transition-all uppercase tracking-[0.1em]"
                      >
                        Показать подсказку {i + 1}
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 border-2 border-dashed border-white/[0.04] bg-white/[0.03]">
                      <span className="font-mono text-xs text-white/25 uppercase tracking-[0.1em]">
                        Подсказка {i + 1} — сначала откройте предыдущую
                      </span>
                    </div>
                  )}
                </div>
              ))}

              {hints.length === 0 && (
                <div className="text-center font-mono text-white/25 text-xs py-8 uppercase tracking-[0.15em]">
                  Для этого урока подсказки не предусмотрены
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
