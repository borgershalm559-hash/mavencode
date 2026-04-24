"use client";

import { useState, useCallback, useRef, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Trophy, Loader2, Lock, Award } from "lucide-react";

import { fetcher } from "@/lib/fetcher";
import { LessonHeader } from "@/components/lesson/lesson-header";
import { TheoryPanel } from "@/components/lesson/theory-panel";
import { CodeEditor } from "@/components/lesson/code-editor";
import { ConsoleOutput } from "@/components/lesson/console-output";
import { HintsDrawer } from "@/components/lesson/hints-drawer";
import { QuizTask } from "@/components/lesson/quiz-task";
import type { RunResult, Test } from "@/components/lesson/runners/types";

interface LessonData {
  lesson: {
    id: string;
    title: string;
    content: string;
    type: string;
    language: string;
    starterCode: string | null;
    tests: Test[];
    xpReward: number;
    order: number;
    hints: string[];
  };
  course: {
    id: string;
    title: string;
    totalLessons: number;
  };
  progress: {
    completed: boolean;
    score: number;
    attempts: number;
    draft: string | null;
    hintsUsed: number;
  } | null;
  isAvailable: boolean;
}

interface SubmitResponse {
  passed: boolean;
  xpEarned: number;
  nextLessonId: string | null;
  unlockedAchievements?: { id: string; title: string; description: string; icon: string }[];
}

export default function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading, mutate } = useSWR<LessonData>(
    `/api/lessons/${id}`,
    fetcher
  );

  const [code, setCode] = useState("");
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintsOpen, setHintsOpen] = useState(false);
  const [submitResult, setSubmitResult] = useState<SubmitResponse | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const draftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const draftAbortRef = useRef<AbortController | null>(null);
  const codeInitialized = useRef(false);

  // Initialize code from draft or starterCode
  useEffect(() => {
    if (data && !codeInitialized.current) {
      setCode(data.progress?.draft || data.lesson.starterCode || "");
      setHintsUsed(data.progress?.hintsUsed || 0);
      codeInitialized.current = true;
    }
  }, [data]);

  // Auto-save draft
  const saveDraft = useCallback(
    (newCode: string) => {
      if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
      draftTimerRef.current = setTimeout(() => {
        draftAbortRef.current?.abort();
        draftAbortRef.current = new AbortController();
        fetch(`/api/lessons/${id}/draft`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: newCode }),
          signal: draftAbortRef.current.signal,
        }).catch((e) => {
          if (e instanceof DOMException && e.name === "AbortError") return;
          console.warn("[Draft save failed]", e);
        });
      }, 3000);
    },
    [id]
  );

  const handleCodeChange = useCallback(
    (value: string) => {
      setCode(value);
      saveDraft(value);
    },
    [saveDraft]
  );

  const handleReset = useCallback(() => {
    const starter = data?.lesson.starterCode || "";
    setCode(starter);
    setRunResult(null);
    setShowSuccess(false);
    setSubmitResult(null);
  }, [data]);

  const handleRun = useCallback(async () => {
    if (!data || isRunning) return;
    setIsRunning(true);
    setRunResult(null);
    setShowSuccess(false);

    try {
      let result: RunResult;

      if (data.lesson.type === "quiz") {
        // Quiz is handled by QuizTask component
        return;
      }

      const { language } = data.lesson;
      let runner;

      if (language === "python") {
        const { PythonRunner } = await import(
          "@/components/lesson/runners/python-runner"
        );
        runner = new PythonRunner();
      } else {
        const { JsRunner } = await import(
          "@/components/lesson/runners/js-runner"
        );
        runner = new JsRunner();
      }

      result = await runner.run(code, data.lesson.tests);
      runner.destroy();
      setRunResult(result);

      // If all tests pass, submit
      const allPassed =
        result.tests.length > 0 && result.tests.every((t) => t.passed);
      if (allPassed && !result.error) {
        await handleSubmit(result);
      }
    } catch {
      setRunResult({
        output: "",
        error: "Ошибка выполнения. Попробуйте ещё раз.",
        tests: [],
      });
    } finally {
      setIsRunning(false);
    }
  }, [data, code, isRunning, hintsUsed]);

  const handleSubmit = async (result?: RunResult) => {
    try {
      const res = await fetch(`/api/lessons/${id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, hintsUsed }),
      });
      const submitData: SubmitResponse = await res.json();
      setSubmitResult(submitData);
      setShowSuccess(true);
      mutate();
    } catch (e) {
      console.error("[Submit failed]", e);
    }
  };

  const handleQuizResult = useCallback(
    async (result: RunResult) => {
      setRunResult(result);
      const allPassed =
        result.tests.length > 0 && result.tests.every((t) => t.passed);
      if (allPassed) {
        setIsRunning(true);
        await handleSubmit(result);
        setIsRunning(false);
      }
    },
    [hintsUsed]
  );

  const handleRevealHint = useCallback(() => {
    setHintsUsed((prev) => prev + 1);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-canvas">
        <Loader2 className="w-6 h-6 text-[#10B981] animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-screen flex items-center justify-center bg-canvas">
        <p className="text-white/40 font-mono text-sm">Урок не найден</p>
      </div>
    );
  }

  // Locked lesson
  if (!data.isAvailable) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-canvas gap-4">
        <Lock className="w-8 h-8 text-white/20" />
        <p className="text-white/40 text-sm font-mono">
          Пройдите предыдущий урок чтобы открыть этот
        </p>
        <button
          onClick={() => router.back()}
          className="text-[#10B981] text-sm font-mono hover:text-[#047857] transition-colors"
        >
          ← Назад к курсу
        </button>
      </div>
    );
  }

  const isQuiz = data.lesson.type === "quiz";

  return (
    <div className="fixed inset-0 flex flex-col bg-canvas overflow-hidden">
      <LessonHeader
        courseId={data.course.id}
        courseTitle={data.course.title}
        lessonTitle={data.lesson.title}
        lessonOrder={data.lesson.order}
        totalLessons={data.course.totalLessons}
        hintsUsed={hintsUsed}
        totalHints={data.lesson.hints.length}
        onHintRequest={() => setHintsOpen(true)}
        completed={data.progress?.completed ?? false}
      />

      {/* Main split view */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        {/* Left: Theory */}
        <div className="lg:w-[45%] w-full h-[40vh] lg:h-full min-h-0 border-b-2 lg:border-b-0 lg:border-r-2 border-white/[0.07] bg-surface">
          <TheoryPanel content={data.lesson.content} />
        </div>

        {/* Right: Editor + Console */}
        <div className="flex-1 flex flex-col min-h-0 lg:h-full">
          {isQuiz ? (
            <QuizTask
              tests={data.lesson.tests}
              onResult={handleQuizResult}
              isRunning={isRunning}
            />
          ) : (
            <>
              <div className="flex-1 min-h-0">
                <CodeEditor
                  code={code}
                  language={data.lesson.language}
                  onChange={handleCodeChange}
                  onRun={handleRun}
                  onReset={handleReset}
                  isRunning={isRunning}
                />
              </div>
              <div className="h-[200px] lg:h-[220px]">
                <ConsoleOutput result={runResult} isRunning={isRunning} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Hints drawer */}
      <HintsDrawer
        hints={data.lesson.hints}
        hintsUsed={hintsUsed}
        xpReward={data.lesson.xpReward}
        isOpen={hintsOpen}
        onClose={() => setHintsOpen(false)}
        onRevealHint={handleRevealHint}
      />

      {/* Success overlay */}
      <AnimatePresence>
        {showSuccess && submitResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-surface border-2 border-[#10B981]/20 p-8 max-w-sm w-full mx-4 text-center"
              style={{ boxShadow: "8px 8px 0 0 rgba(16,185,129,0.5)" }}
            >
              <div className="w-16 h-16 border-2 border-[#10B981]/30 bg-[#10B981]/[0.08] flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-[#10B981]" />
              </div>

              <h2 className="text-lg font-bold font-mono text-white/90 uppercase tracking-[0.1em] mb-1">
                Урок пройден!
              </h2>

              {submitResult.xpEarned > 0 && (
                <p className="text-[#10B981] text-sm font-mono font-medium mb-4">
                  +{submitResult.xpEarned} XP
                </p>
              )}

              {submitResult.xpEarned === 0 && (
                <p className="text-white/30 text-xs font-mono mb-4">
                  Урок уже был пройден ранее
                </p>
              )}

              {submitResult.unlockedAchievements && submitResult.unlockedAchievements.length > 0 && (
                <div className="mb-4 space-y-2">
                  {submitResult.unlockedAchievements.map((a) => (
                    <motion.div
                      key={a.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center gap-2 px-3 py-2 border-2 border-[#10B981]/20 bg-[#10B981]/[0.06]"
                    >
                      <Award className="w-4 h-4 text-[#10B981]" />
                      <div className="text-left">
                        <div className="text-xs font-semibold font-mono text-[#10B981]">{a.title}</div>
                        <div className="text-[10px] text-white/40">{a.description}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              <div className="flex flex-col gap-2">
                {submitResult.nextLessonId ? (
                  <button
                    onClick={() =>
                      router.push(`/lesson/${submitResult.nextLessonId}`)
                    }
                    className="flex items-center justify-center gap-2 px-5 py-2.5 border-2 border-black text-sm font-mono font-medium
                      bg-[#10B981] text-black uppercase tracking-[0.08em]
                      hover:bg-[#047857] transition-all"
                    style={{ boxShadow: "4px 4px 0 0 rgba(16,185,129,0.50)" }}
                  >
                    Следующий урок
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <p className="text-emerald-600 text-sm font-mono mb-2">
                    Это был последний урок!
                  </p>
                )}

                <button
                  onClick={() =>
                    router.push(
                      `/dashboard?section=courses&course=${data.course.id}`
                    )
                  }
                  className="text-white/40 text-sm font-mono hover:text-white/60 transition-colors"
                >
                  Вернуться к курсу
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
