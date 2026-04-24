"use client";

import { useState, useRef, useCallback, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { motion } from "framer-motion";
import { Trophy, Clock, Loader2, User, Check, X } from "lucide-react";
import { fetcher } from "@/lib/fetcher";
import { CodeEditor } from "@/components/lesson/code-editor";
import type { RunResult, Test } from "@/components/lesson/runners/types";

interface MatchData {
  id: string;
  status: "waiting" | "active" | "completed";
  challenge: {
    id: string;
    title: string;
    description: string;
    starterCode: string;
    language: string;
    timeLimit: number;
    tests: string | null;
  };
  opponent: { id: string; name: string | null } | null;
  mySubmission: { passed: boolean; score: number; timeSpent: number } | null;
  opponentSubmitted: boolean;
  winnerId: string | null;
  startedAt: string;
  endedAt: string | null;
}

export default function PvpMatchPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = use(params);
  const router = useRouter();
  const { data: session } = useSession();
  const { data, isLoading, mutate } = useSWR<MatchData>(
    `/api/pvp/matches/${matchId}`,
    fetcher,
    { refreshInterval: 3000 }
  );

  const [code, setCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const codeInitialized = useRef(false);

  // Init code from starter
  useEffect(() => {
    if (data?.challenge?.starterCode && !codeInitialized.current) {
      setCode(data.challenge.starterCode);
      codeInitialized.current = true;
    }
  }, [data]);

  // Timer
  useEffect(() => {
    if (!data || data.status !== "active" || submitted) return;
    const interval = setInterval(() => {
      const start = new Date(data.startedAt).getTime();
      setTimeElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [data, submitted]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    return `${m}:${String(s % 60).padStart(2, "0")}`;
  };

  const handleRun = useCallback(async () => {
    if (!data || isRunning || submitted) return;
    setIsRunning(true);

    try {
      const { language } = data.challenge;
      let runner;
      if (language === "python") {
        const { PythonRunner } = await import("@/components/lesson/runners/python-runner");
        runner = new PythonRunner();
      } else {
        const { JsRunner } = await import("@/components/lesson/runners/js-runner");
        runner = new JsRunner();
      }

      // Parse tests from challenge data (already loaded with the match)
      let tests: Test[] = [];
      try {
        if (data.challenge.tests) tests = JSON.parse(data.challenge.tests);
      } catch {
        // If tests JSON is malformed, run without validation
      }

      const result: RunResult = await runner.run(code, tests);
      runner.destroy();

      const allPassed = result.tests.length > 0 && result.tests.every((t) => t.passed);
      const score = result.tests.filter((t) => t.passed).length;

      // Submit to API
      const res = await fetch(`/api/pvp/matches/${matchId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          passed: allPassed,
          score,
          timeSpent: timeElapsed,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        mutate();
      }
    } catch (e) {
      console.error("[PVP Run Error]", e);
    } finally {
      setIsRunning(false);
    }
  }, [data, code, isRunning, submitted, timeElapsed, matchId, mutate]);

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
        <p className="text-white/40 font-mono text-sm">Матч не найден</p>
      </div>
    );
  }

  // Waiting for opponent
  if (data.status === "waiting") {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-canvas gap-4">
        <Loader2 className="w-8 h-8 text-[#10B981] animate-spin" />
        <p className="text-white/60 text-sm font-mono">Ожидание оппонента...</p>
        <p className="text-white/25 text-xs font-mono">Матч начнётся автоматически</p>
        <button
          onClick={() => router.push("/dashboard?section=pvp")}
          className="mt-4 text-white/30 text-xs font-mono hover:text-white/60 transition-colors"
        >
          Отменить
        </button>
      </div>
    );
  }

  // Match completed
  if (data.status === "completed") {
    const currentUserId = session?.user?.id;
    const isWinner = !data.winnerId ? null : currentUserId ? data.winnerId === currentUserId : null;
    return (
      <div className="h-screen flex items-center justify-center bg-canvas">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-surface border-2 border-[#10B981]/20 p-8 max-w-sm w-full mx-4 text-center"
          style={{ boxShadow: isWinner === true ? "8px 8px 0 0 rgba(16,185,129,0.5)" : isWinner === false ? "8px 8px 0 0 rgba(239,68,68,0.3)" : "8px 8px 0 0 rgba(16,185,129,0.25)" }}
        >
          <div className={`w-16 h-16 border-2 flex items-center justify-center mx-auto mb-4 ${
            isWinner === true ? "border-[#10B981]/30 bg-[#10B981]/[0.08]" : isWinner === false ? "border-red-400/30 bg-red-50" : "border-white/[0.05] bg-white/[0.03]"
          }`}>
            {isWinner === true ? (
              <Trophy className="w-8 h-8 text-[#10B981]" />
            ) : isWinner === false ? (
              <X className="w-8 h-8 text-red-400" />
            ) : (
              <User className="w-8 h-8 text-white/30" />
            )}
          </div>
          <h2 className="text-lg font-bold font-mono text-white/90 uppercase tracking-[0.1em] mb-1">
            {isWinner === true ? "Победа!" : isWinner === false ? "Поражение" : "Ничья"}
          </h2>
          <p className="text-white/30 text-sm font-mono mb-4">
            vs {data.opponent?.name || "Оппонент"}
          </p>
          <button
            onClick={() => router.push("/dashboard?section=pvp")}
            className="px-5 py-2.5 border-2 border-black text-sm font-mono font-medium
              bg-[#10B981] text-black uppercase tracking-[0.08em]
              hover:bg-[#047857] transition-all"
            style={{ boxShadow: "4px 4px 0 0 rgba(16,185,129,0.50)" }}
          >
            Назад к PVP
          </button>
        </motion.div>
      </div>
    );
  }

  // Active match
  const timeLeft = Math.max(0, data.challenge.timeLimit - timeElapsed);

  return (
    <div className="h-screen flex flex-col bg-canvas overflow-hidden">
      {/* Accent stripe */}
      <div className="h-[3px] bg-[#10B981] shrink-0" />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-surface border-b-2 border-white/[0.07]">
        <div>
          <div className="text-sm font-bold text-white/90">{data.challenge.title}</div>
          <div className="text-xs text-white/30 font-mono">vs {data.opponent?.name || "Оппонент"}</div>
        </div>
        <div className="flex items-center gap-4">
          {data.opponentSubmitted && (
            <span className="flex items-center gap-1 text-xs text-emerald-600 font-mono">
              <Check className="w-3.5 h-3.5" />
              Оппонент сдал
            </span>
          )}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 border-2 ${
            timeLeft < 60 ? "border-red-400/30 bg-red-50 text-red-500" : "border-[#10B981]/30 bg-[#10B981]/[0.06] text-[#10B981]"
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs font-mono font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Description */}
        <div className="lg:w-[35%] w-full h-[30vh] lg:h-auto border-b-2 lg:border-b-0 lg:border-r-2 border-white/[0.07] bg-surface overflow-auto p-5">
          <div className="text-sm text-white/65 whitespace-pre-wrap leading-relaxed">{data.challenge.description}</div>
        </div>

        {/* Editor */}
        <div className="flex-1 min-h-0">
          <CodeEditor
            code={code}
            language={data.challenge.language}
            onChange={setCode}
            onRun={handleRun}
            onReset={() => setCode(data.challenge.starterCode)}
            isRunning={isRunning}
            readOnly={submitted}
          />
        </div>
      </div>

      {submitted && (
        <div className="px-4 py-3 bg-emerald-50 border-t-2 border-emerald-400/30 text-center">
          <span className="text-xs text-emerald-700 font-mono">Решение отправлено. Ожидание оппонента...</span>
        </div>
      )}
    </div>
  );
}
