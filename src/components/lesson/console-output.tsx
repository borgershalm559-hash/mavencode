"use client";

import { useState } from "react";
import { Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { RunResult } from "./runners/types";

interface ConsoleOutputProps {
  result: RunResult | null;
  isRunning: boolean;
}

export function ConsoleOutput({ result, isRunning }: ConsoleOutputProps) {
  const [tab, setTab] = useState<"tests" | "output">("tests");

  const passedCount = result?.tests.filter((t) => t.passed).length ?? 0;
  const totalCount = result?.tests.length ?? 0;
  const allPassed = totalCount > 0 && passedCount === totalCount;

  return (
    <div className="flex flex-col h-full border-t border-white/[0.06]">
      {/* Tab bar */}
      <div className="flex items-center px-3 py-1.5 border-b border-white/[0.06] gap-1">
        <button
          onClick={() => setTab("tests")}
          className={`flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] border transition-all ${
            tab === "tests"
              ? "text-white/70 border-white/[0.09] bg-white/[0.04]"
              : "text-white/25 border-transparent hover:text-white/45"
          }`}
        >
          Тесты
          {result && (
            <span
              className={`text-[9px] font-bold ${
                allPassed ? "text-[#10B981]" : "text-red-500/80"
              }`}
            >
              {passedCount}/{totalCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab("output")}
          className={`flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] border transition-all ${
            tab === "output"
              ? "text-white/70 border-white/[0.09] bg-white/[0.04]"
              : "text-white/25 border-transparent hover:text-white/45"
          }`}
        >
          <Terminal className="w-3 h-3" />
          Вывод
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="wait">
          {isRunning ? (
            <motion.div
              key="running"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 px-4 py-3 font-mono text-xs text-white/30"
            >
              <div className="w-1.5 h-1.5 bg-[#10B981] animate-pulse" />
              Выполняю...
            </motion.div>
          ) : !result ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-4 py-3 font-mono text-[10px] text-white/20 uppercase tracking-[0.15em]"
            >
              Нажмите «Запустить»
            </motion.div>
          ) : tab === "tests" ? (
            <motion.div
              key="tests"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {result.error && (
                <div className="px-4 py-2 font-mono text-xs text-red-400/80 border-b border-red-400/10 bg-red-400/[0.04]">
                  {result.error}
                </div>
              )}

              {/* 3-column grid: status | description | expected */}
              <div className="divide-y divide-white/[0.04]">
                {result.tests.map((test, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[20px_1fr_auto] items-start gap-3 px-4 py-2.5"
                  >
                    {/* Status icon */}
                    <span
                      className={`font-mono text-xs mt-0.5 ${
                        test.passed ? "text-[#10B981]" : "text-red-400/80"
                      }`}
                    >
                      {test.passed ? "✓" : "✗"}
                    </span>

                    {/* Description */}
                    <span
                      className={`font-mono text-[11px] leading-relaxed ${
                        test.passed ? "text-white/55" : "text-white/65"
                      }`}
                    >
                      {test.description}
                      {!test.passed && test.actual && (
                        <span className="block text-[10px] text-red-400/60 mt-0.5">
                          Получено: {test.actual}
                        </span>
                      )}
                    </span>

                    {/* Expected */}
                    {test.expected && (
                      <span className="font-mono text-[10px] text-white/25 shrink-0 text-right">
                        {test.expected}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {allPassed && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#10B981]/[0.06] border-t border-[#10B981]/10"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#10B981]">
                    ✓ Все тесты пройдены
                  </span>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="output"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4"
            >
              {result.error && (
                <div className="font-mono text-xs text-red-400/80 mb-2">{result.error}</div>
              )}
              {result.output ? (
                <pre className="font-mono text-xs text-white/55 whitespace-pre-wrap">
                  {result.output}
                </pre>
              ) : (
                <span className="font-mono text-[10px] text-white/20 uppercase tracking-[0.15em]">
                  Нет вывода
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
