"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Terminal, FlaskConical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { RunResult } from "./runners/types";

interface ConsoleOutputProps {
  result: RunResult | null;
  isRunning: boolean;
}

export function ConsoleOutput({ result, isRunning }: ConsoleOutputProps) {
  const [tab, setTab] = useState<"output" | "tests">("tests");

  const passedCount = result?.tests.filter((t) => t.passed).length ?? 0;
  const totalCount = result?.tests.length ?? 0;
  const allPassed = totalCount > 0 && passedCount === totalCount;

  return (
    <div className="flex flex-col h-full border-t-2 border-white/[0.07] bg-surface">
      {/* Tabs */}
      <div className="flex items-center gap-1 px-3 py-1.5 border-b-2 border-white/[0.07] bg-white/[0.03]">
        <button
          onClick={() => setTab("tests")}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono transition-all border-2 ${
            tab === "tests"
              ? "text-white/80 bg-surface border-white/[0.07]"
              : "text-white/30 border-transparent hover:text-white/55"
          }`}
        >
          <FlaskConical className="w-3 h-3" />
          Тесты
          {result && (
            <span className={`ml-1 text-[10px] font-bold ${allPassed ? "text-emerald-600" : "text-red-500"}`}>
              {passedCount}/{totalCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab("output")}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono transition-all border-2 ${
            tab === "output"
              ? "text-white/80 bg-surface border-white/[0.07]"
              : "text-white/30 border-transparent hover:text-white/55"
          }`}
        >
          <Terminal className="w-3 h-3" />
          Вывод
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 font-mono text-xs custom-scrollbar">
        <AnimatePresence mode="wait">
          {isRunning ? (
            <motion.div key="running" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-white/35">
              <div className="w-1.5 h-1.5 bg-[#10B981] animate-pulse" />
              Выполняю...
            </motion.div>
          ) : !result ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/25">
              Нажмите «Запустить» чтобы выполнить код
            </motion.div>
          ) : tab === "tests" ? (
            <motion.div key="tests" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
              {result.error && (
                <div className="p-2.5 bg-red-50 border-2 border-red-400/30 text-red-600 text-xs">
                  {result.error}
                </div>
              )}
              {result.tests.map((test, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2 p-2.5 border-2 ${
                    test.passed
                      ? "bg-emerald-50 border-emerald-400/30"
                      : "bg-red-50 border-red-400/30"
                  }`}
                >
                  {test.passed ? (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className={test.passed ? "text-emerald-700" : "text-red-600"}>
                      {test.description}
                    </div>
                    {!test.passed && (
                      <div className="mt-1 text-white/40 space-y-0.5">
                        <div>Ожидалось: <span className="text-emerald-600">{test.expected}</span></div>
                        <div>Получено: <span className="text-red-500">{test.actual}</span></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {allPassed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 p-3 bg-emerald-50 border-2 border-emerald-400/40 text-emerald-700 text-sm font-medium"
                >
                  <CheckCircle className="w-4 h-4" />
                  Все тесты пройдены!
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div key="output" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
              {result.error && (
                <div className="text-red-500 mb-2">{result.error}</div>
              )}
              {result.output ? (
                <pre className="text-white/65 whitespace-pre-wrap bg-white/[0.03] p-3 border border-white/[0.07]">{result.output}</pre>
              ) : (
                <span className="text-white/25">Нет вывода</span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
