"use client";

import { useState, useCallback, useRef, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Trophy, Loader2, Lock, Award } from "lucide-react";

import { fetcher } from "@/lib/fetcher";
import { LessonHeader } from "@/components/lesson/lesson-header";
import { LessonHero } from "@/components/lesson/lesson-hero";
import { LessonProgressStrip } from "@/components/lesson/lesson-progress-strip";
import { TheoryPanel } from "@/components/lesson/theory-panel";
import { CodeEditor } from "@/components/lesson/code-editor";
import { ConsoleOutput } from "@/components/lesson/console-output";
import { HintsDrawer } from "@/components/lesson/hints-drawer";
import { QuizTask } from "@/components/lesson/quiz-task";
import type { RunResult, Test } from "@/components/lesson/runners/types";

interface LessonStatus {
  id: string;
  order: number;
  title: string;
  completed: boolean;
  isAvailable: boolean;
}

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
    estimatedMinutes: number;
  };
  course: {
    id: string;
    title: string;
    totalLessons: number;
    lessons: LessonStatus[];
  };
  nextLesson: { id: string; title: string } | null;
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
  const [isSaving, setIsSaving] = useState(false);
  const draftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const draftAbortRef = useRef<AbortController | null>(null);
  const codeInitialized = useRef(false);

  useEffect(() => {
    if (data && !codeInitialized.current) {
      setCode(data.progress?.draft || data.lesson.starterCode || "");
      setHintsUsed(data.progress?.hintsUsed || 0);
      codeInitialized.current = true;
    }
  }, [data]);

  const saveDraft = useCallback(
    (newCode: string) => {
      if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
      setIsSaving(true);
      draftTimerRef.current = setTimeout(() => {
        draftAbortRef.current?.abort();
        draftAbortRef.current = new AbortController();
        fetch(`/api/lessons/${id}/draft`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: newCode }),
          signal: draftAbortRef.current.signal,
        })
          .catch((e) => {
            if (e instanceof DOMException && e.name === "AbortError") return;
          })
          .finally(() => setIsSaving(false));
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

  const handleSubmit = async (_result?: RunResult) => {
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
    } catch {
      // silent
    }
  };

  const handleRun = useCallback(async () => {
    if (!data || isRunning) return;
    setIsRunning(true);
    setRunResult(null);
    setShowSuccess(false);

    try {
      if (data.lesson.type === "quiz") return;

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

      const result = await runner.run(code, data.lesson.tests);
      runner.destroy();
      setRunResult(result);

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

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0B0B0C]">
        <Loader2 className="w-5 h-5 text-[#10B981] animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0B0B0C]">
        <p className="text-white/30 font-mono text-xs uppercase tracking-[0.2em]">
          Урок не найден
        </p>
      </div>
    );
  }

  if (!data.isAvailable) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#0B0B0C] gap-4">
        <Lock className="w-6 h-6 text-white/15" />
        <p className="text-white/30 text-xs font-mono uppercase tracking-[0.15em]">
          Пройдите предыдущий урок
        </p>
        <button
          onClick={() => router.back()}
          className="font-mono text-[11px] text-[#10B981] hover:text-[#0da876] transition-colors uppercase tracking-[0.15em]"
        >
          ← Назад
        </button>
      </div>
    );
  }

  const isQuiz = data.lesson.type === "quiz";
  const nextLessonId = submitResult?.nextLessonId ?? data.nextLesson?.id ?? null;
  const nextLessonTitle = data.nextLesson?.title ?? null;

  return (
    <div className="flex flex-col h-screen bg-[#0B0B0C] overflow-hidden">
      {/* Top 3px accent stripe */}
      <div className="h-[3px] bg-[#10B981] shrink-0" />

      {/* Header */}
      <LessonHeader
        courseId={data.course.id}
        courseTitle={data.course.title}
        lessonOrder={data.lesson.order}
        totalLessons={data.course.totalLessons}
        language={data.lesson.language}
        hintsUsed={hintsUsed}
        totalHints={data.lesson.hints.length}
        onHintRequest={() => setHintsOpen(true)}
        isSaving={isSaving}
      />

      {/* Hero */}
      <LessonHero
        title={data.lesson.title}
        xpReward={data.lesson.xpReward}
        testsCount={data.lesson.tests.length}
        estimatedMinutes={data.lesson.estimatedMinutes}
        completed={data.progress?.completed ?? false}
      />

      {/* Progress strip */}
      <LessonProgressStrip
        lessons={data.course.lessons}
        currentLessonId={id}
        courseTitle={data.course.title}
      />

      {/* Main split */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Theory */}
        <div className="lg:w-[45%] w-full h-[38vh] lg:h-full min-h-0 border-b lg:border-b-0 lg:border-r border-white/[0.06] bg-[#0E0E10]">
          <TheoryPanel content={data.lesson.content} />
        </div>

        {/* Editor + Console */}
        <div className="flex-1 flex flex-col min-h-0">
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
              <div className="h-[180px] lg:h-[200px] shrink-0">
                <ConsoleOutput result={runResult} isRunning={isRunning} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer: next lesson (visible after completion) */}
      <AnimatePresence>
        {submitResult && (
          <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="shrink-0 flex items-center justify-between px-6 py-3 border-t border-white/[0.06] bg-[#0B0B0C]"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#10B981]">
                ✓ Пройден
              </span>
              {submitResult.xpEarned > 0 && (
                <span className="font-mono text-[10px] text-white/30">
                  +{submitResult.xpEarned} XP
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  router.push(
                    `/dashboard?section=courses&course=${data.course.id}`
                  )
                }
                className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/30 hover:text-white/55 transition-colors"
              >
                К курсу
              </button>

              {nextLessonId && (
                <button
                  onClick={() => router.push(`/lesson/${nextLessonId}`)}
                  className="flex items-center gap-1.5 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em]
                    bg-[#10B981] text-black border border-black/20
                    hover:bg-[#0da876] transition-all"
                  style={{ boxShadow: "2px 2px 0 0 rgba(16,185,129,0.35)" }}
                >
                  {nextLessonTitle ?? "Следующий урок"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </motion.footer>
        )}
      </AnimatePresence>

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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setShowSuccess(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
              className="bg-[#0E0E10] border border-white/[0.09] p-8 max-w-sm w-full mx-4 text-center"
              style={{ boxShadow: "8px 8px 0 0 rgba(16,185,129,0.35)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-14 h-14 border border-[#10B981]/20 bg-[#10B981]/[0.06] flex items-center justify-center mx-auto mb-5">
                <Trophy className="w-7 h-7 text-[#10B981]" />
              </div>

              <h2
                className="text-[28px] font-light text-white/85 mb-1 leading-tight"
                style={{ fontFamily: "var(--font-fraunces)", fontWeight: 300 }}
              >
                Урок пройден
              </h2>

              {submitResult.xpEarned > 0 && (
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#10B981] mb-5">
                  +{submitResult.xpEarned} XP
                </p>
              )}
              {submitResult.xpEarned === 0 && (
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/20 mb-5">
                  Уже пройден ранее
                </p>
              )}

              {submitResult.unlockedAchievements &&
                submitResult.unlockedAchievements.length > 0 && (
                  <div className="mb-5 space-y-2">
                    {submitResult.unlockedAchievements.map((a) => (
                      <motion.div
                        key={a.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="flex items-center gap-2 px-3 py-2 border border-[#10B981]/15 bg-[#10B981]/[0.05]"
                      >
                        <Award className="w-4 h-4 text-[#10B981] shrink-0" />
                        <div className="text-left">
                          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#10B981]">
                            {a.title}
                          </div>
                          <div className="text-[10px] text-white/30">{a.description}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

              <div className="flex flex-col gap-2">
                {nextLessonId ? (
                  <button
                    onClick={() => router.push(`/lesson/${nextLessonId}`)}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.1em]
                      bg-[#10B981] text-black border border-black/20
                      hover:bg-[#0da876] transition-all"
                    style={{ boxShadow: "3px 3px 0 0 rgba(16,185,129,0.4)" }}
                  >
                    {nextLessonTitle ?? "Следующий урок"}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#10B981]/60">
                    Курс завершён!
                  </p>
                )}

                <button
                  onClick={() =>
                    router.push(
                      `/dashboard?section=courses&course=${data.course.id}`
                    )
                  }
                  className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/25 hover:text-white/50 transition-colors"
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
