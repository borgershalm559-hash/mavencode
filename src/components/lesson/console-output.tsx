"use client";

import { useState } from "react";
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

  const tabBase: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "7px 12px",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: 11,
    letterSpacing: "0.1em",
    cursor: "pointer",
    border: "2px solid",
    marginBottom: -2,
    background: "transparent",
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ borderTop: "2px solid rgba(255,255,255,0.07)", background: "#101013" }}
    >
      {/* Tab bar */}
      <div style={{ display: "flex", gap: 6, padding: "10px 18px 0" }}>
        <button
          onClick={() => setTab("tests")}
          style={{
            ...tabBase,
            borderColor: tab === "tests" ? "rgba(255,255,255,0.07)" : "transparent",
            borderBottom: tab === "tests" ? "2px solid #101013" : "2px solid transparent",
            background: tab === "tests" ? "#0E0E10" : "transparent",
            color: tab === "tests" ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.35)",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/>
          </svg>
          Тесты
          {result && (
            <span
              style={{
                color: allPassed ? "#10B981" : "#F87171",
                fontWeight: 600,
              }}
            >
              {passedCount}/{totalCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setTab("output")}
          style={{
            ...tabBase,
            borderColor: tab === "output" ? "rgba(255,255,255,0.07)" : "transparent",
            borderBottom: tab === "output" ? "2px solid #101013" : "2px solid transparent",
            background: tab === "output" ? "#0E0E10" : "transparent",
            color: tab === "output" ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.35)",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
          </svg>
          Вывод
        </button>
      </div>

      {/* Content */}
      <div
        className="flex-1 overflow-y-auto custom-scrollbar"
        style={{ borderTop: "2px solid rgba(255,255,255,0.07)" }}
      >
        <AnimatePresence mode="wait">
          {isRunning ? (
            <motion.div
              key="running"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-mono"
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 22px", fontSize: 12, color: "rgba(255,255,255,0.35)" }}
            >
              <div style={{ width: 6, height: 6, background: "#10B981", animation: "pulse 1s infinite" }} />
              Выполняю...
            </motion.div>
          ) : !result ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-mono"
              style={{ padding: "14px 22px", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}
            >
              Нажмите «Запустить» для выполнения
            </motion.div>
          ) : tab === "tests" ? (
            <motion.div
              key="tests"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ padding: "14px 22px 22px", display: "grid", gap: 8 }}
            >
              {result.error && (
                <div
                  className="font-mono"
                  style={{
                    padding: "10px 14px",
                    border: "1.5px solid rgba(248,113,113,0.3)",
                    background: "rgba(248,113,113,0.06)",
                    fontSize: 12,
                    color: "#F87171",
                    marginBottom: 4,
                  }}
                >
                  {result.error}
                </div>
              )}

              {result.tests.map((test, i) => (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto",
                    alignItems: "center",
                    gap: 14,
                    padding: "10px 14px",
                    border: `1.5px solid ${test.passed ? "rgba(16,185,129,0.25)" : "rgba(248,113,113,0.25)"}`,
                    background: test.passed ? "rgba(16,185,129,0.05)" : "rgba(248,113,113,0.05)",
                  }}
                >
                  {/* Status icon */}
                  <span style={{ color: test.passed ? "#10B981" : "#F87171" }}>
                    {test.passed ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    )}
                  </span>

                  {/* Description */}
                  <span
                    className="font-mono"
                    style={{ fontSize: 12, color: "rgba(255,255,255,0.78)" }}
                  >
                    {test.description}
                  </span>

                  {/* Expected value */}
                  {test.expected && (
                    <span
                      className="font-mono"
                      style={{
                        fontSize: 11,
                        letterSpacing: "0.08em",
                        color: test.passed ? "rgba(255,255,255,0.4)" : "#F87171",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {test.passed ? `→ ${test.expected}` : `ожидалось ${test.expected}`}
                    </span>
                  )}
                </div>
              ))}

              {allPassed && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-mono"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 14px",
                    background: "rgba(16,185,129,0.06)",
                    border: "1.5px solid rgba(16,185,129,0.25)",
                    fontSize: 11,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#10B981",
                  }}
                >
                  ✓ Все тесты пройдены
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="output"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ padding: "14px 22px" }}
            >
              {result.error && (
                <div className="font-mono" style={{ fontSize: 12, color: "#F87171", marginBottom: 8 }}>
                  {result.error}
                </div>
              )}
              {result.output ? (
                <pre
                  className="font-mono custom-scrollbar"
                  style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", whiteSpace: "pre-wrap", margin: 0 }}
                >
                  {result.output}
                </pre>
              ) : (
                <span
                  className="font-mono"
                  style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}
                >
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
