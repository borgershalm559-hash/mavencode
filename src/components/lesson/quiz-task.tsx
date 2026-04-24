"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Play } from "lucide-react";
import type { RunResult, Test } from "./runners/types";

interface QuizTaskProps {
  tests: Test[];
  onResult: (result: RunResult) => void;
  isRunning: boolean;
}

export function QuizTask({ tests, onResult, isRunning }: QuizTaskProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // Each test.input is the question, test.expected is the correct answer
  // test.description contains comma-separated options
  const questions = tests.map((t) => ({
    question: t.input,
    options: t.description.split(",").map((o) => o.trim()),
    correct: t.expected,
  }));

  const handleSubmit = () => {
    setSubmitted(true);
    const results = questions.map((q, i) => ({
      description: q.question,
      passed: answers[i] === q.correct,
      expected: q.correct,
      actual: answers[i] || "(не выбран)",
    }));

    onResult({
      output: "",
      error: null,
      tests: results,
    });
  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6 custom-scrollbar">
      {questions.map((q, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="p-4 bg-surface border-2 border-white/[0.05]"
        >
          <p className="text-sm text-white/70 mb-3 font-medium">
            {i + 1}. {q.question}
          </p>

          <div className="space-y-2">
            {q.options.map((opt) => {
              const isSelected = answers[i] === opt;
              const isCorrect = submitted && opt === q.correct;
              const isWrong = submitted && isSelected && opt !== q.correct;

              return (
                <label
                  key={opt}
                  className={`flex items-center gap-3 p-2.5 cursor-pointer transition-all border-2 ${
                    isCorrect
                      ? "bg-emerald-500/[0.12] border-emerald-400/40"
                      : isWrong
                        ? "bg-red-500/[0.12] border-red-400/40"
                        : isSelected
                          ? "bg-[#10B981]/[0.06] border-[#10B981]/30"
                          : "bg-surface border-white/[0.04] hover:border-white/[0.07]"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${i}`}
                    value={opt}
                    checked={isSelected}
                    onChange={() => !submitted && setAnswers((a) => ({ ...a, [i]: opt }))}
                    disabled={submitted}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 border-2 flex items-center justify-center shrink-0 ${
                      isCorrect
                        ? "border-emerald-400"
                        : isWrong
                          ? "border-red-400"
                          : isSelected
                            ? "border-[#10B981]"
                            : "border-white/20"
                    }`}
                  >
                    {isSelected && !submitted && (
                      <div className="w-2 h-2 bg-[#10B981]" />
                    )}
                    {isCorrect && <CheckCircle className="w-3 h-3 text-emerald-400" />}
                    {isWrong && <XCircle className="w-3 h-3 text-red-400" />}
                  </div>
                  <span className={`text-sm ${
                    isCorrect ? "text-emerald-300" : isWrong ? "text-red-300" : "text-white/65"
                  }`}>{opt}</span>
                </label>
              );
            })}
          </div>
        </motion.div>
      ))}

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={isRunning || Object.keys(answers).length < questions.length}
          className="flex items-center gap-2 px-5 py-2.5 border-2 border-black text-sm font-mono font-medium
            bg-[#10B981] text-black uppercase tracking-[0.08em]
            hover:bg-[#047857] hover:border-black
            disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          style={{ boxShadow: "4px 4px 0 0 rgba(16,185,129,0.50)" }}
        >
          <Play className="w-3.5 h-3.5" />
          Проверить ответы
        </button>
      )}
    </div>
  );
}
