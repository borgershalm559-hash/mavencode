"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { AuthTabs } from "@/components/auth/auth-tabs";
import { AuthForm } from "@/components/auth/auth-form";
import { SocialLogin } from "@/components/auth/social-login";

interface PublicStats {
  students: number;
  solvedToday: number;
  activeMatches: number;
}

function formatNum(n: number): string {
  return n.toLocaleString("ru-RU");
}

const ACCENT = "#10B981";

const AUTH_ERRORS: Record<string, string> = {
  OAuthAccountNotLinked: "Этот email уже зарегистрирован. Войдите через email и пароль.",
  OAuthCallbackError: "Ошибка входа через OAuth. Попробуйте ещё раз.",
  AccessDenied: "Доступ запрещён.",
  Default: "Произошла ошибка входа. Попробуйте ещё раз.",
};

function OAuthError({ onError }: { onError: (msg: string) => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      onError(AUTH_ERRORS[error] ?? AUTH_ERRORS.Default);
      window.history.replaceState({}, "", "/");
    }
  }, [searchParams, onError]);
  return null;
}

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [oauthError, setOauthError] = useState("");
  const isSignin = activeTab === "login";

  const { data: stats } = useSWR<PublicStats>("/api/public/stats", fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: false,
  });

  return (
    <div
      className="relative min-h-screen flex items-center justify-center p-4 lg:p-10 overflow-hidden font-sans antialiased selection:bg-[#10B981] selection:text-black"
      style={{ background: "#0A0A0B" }}
    >
      {/* ── Grid background ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <Suspense fallback={null}>
        <OAuthError onError={setOauthError} />
      </Suspense>

      {/* ── Two-column panel ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[960px] grid grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)] z-20"
      >
        {/* ── LEFT: black info panel ── */}
        <div className="relative bg-black border-2 border-[#10B981]/60 p-7 flex-col justify-between min-h-[560px] hidden lg:flex">
          {/* Logo */}
          <div>
            <div className="flex items-center gap-3">
              <img
                src="/logo.svg"
                alt="MavenCode"
                width={64}
                height={50}
                className="flex-shrink-0"
              />
              <span className="font-mono text-[20px] font-bold tracking-tight text-white leading-none">
                maven<span style={{ color: ACCENT }}>code</span>
              </span>
            </div>

            <div className="mt-10">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                /{isSignin ? "вход" : "регистрация"}
              </div>
              <AnimatePresence mode="wait">
                <motion.h1
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-3 font-mono text-[38px] leading-[0.98] font-bold uppercase text-white"
                >
                  {isSignin ? (
                    <>
                      Войди.<br />
                      Продолжи.<br />
                      <span style={{ color: ACCENT }}>Реши.</span>
                    </>
                  ) : (
                    <>
                      Создай.<br />
                      Сломай.<br />
                      <span style={{ color: ACCENT }}>Построй.</span>
                    </>
                  )}
                </motion.h1>
              </AnimatePresence>

              <div className="mt-5 font-mono text-[12px] leading-relaxed text-white/55 max-w-[280px] space-y-0.5">
                {isSignin ? (
                  <>
                    <div>// продолжи курс,</div>
                    <div>// прими вызов,</div>
                    <div>// защити стрик.</div>
                  </>
                ) : (
                  <>
                    <div>// 14 дней бесплатно,</div>
                    <div>// без карты,</div>
                    <div>// отмена в один клик.</div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-10 space-y-3">
            <div className="flex items-baseline justify-between border-t-2 border-white/10 pt-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">студентов</span>
              <span className="font-mono text-[20px] font-bold text-white tabular-nums">
                {stats ? formatNum(stats.students) : "—"}
              </span>
            </div>
            <div className="flex items-baseline justify-between border-t-2 border-white/10 pt-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">решено сегодня</span>
              <span className="font-mono text-[20px] font-bold text-white tabular-nums">
                {stats ? formatNum(stats.solvedToday) : "—"}
              </span>
            </div>
            <div className="flex items-baseline justify-between border-t-2 border-white/10 pt-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">pvp в эфире</span>
              <span className="font-mono text-[20px] font-bold tabular-nums" style={{ color: ACCENT }}>
                {stats ? `${formatNum(stats.activeMatches)}${stats.activeMatches > 0 ? " ↑" : ""}` : "—"}
              </span>
            </div>
          </div>

          {/* Sticker */}
          <div
            className="absolute -bottom-4 -right-2 rotate-[-6deg] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] font-bold border-2 border-black select-none"
            style={{ background: ACCENT, color: "#000", boxShadow: "3px 3px 0 0 #fff" }}
          >
            без воды
          </div>
        </div>

        {/* ── RIGHT: dark form panel ── */}
        <div
          className="relative bg-[#0F1011] text-white border-2 border-white/[0.07] p-6 lg:p-10"
          style={{ boxShadow: `6px 6px 0 0 ${ACCENT}` }}
        >
          {/* Tabs */}
          <AuthTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Heading */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + "-heading"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              className="mb-5 flex items-end justify-between"
            >
              <h2 className="font-mono text-[22px] font-bold uppercase text-white/90">
                {isSignin ? ">>> Данные входа" : ">>> Новый пользователь"}
              </h2>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                {isSignin ? "вход.sh" : "создание.sh"}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* OAuth error */}
          {oauthError && (
            <div className="mb-4 border-2 border-red-500/50 bg-red-500/[0.06] px-4 py-3">
              <p className="text-sm text-red-400 font-mono">{oauthError}</p>
            </div>
          )}

          {/* Form */}
          <AuthForm activeTab={activeTab} />

          {/* OAuth */}
          <SocialLogin />

          {/* Footer */}
          <div className="mt-6 pt-3 border-t-2 border-white/[0.06]">
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/20 text-center">
              MAVENCODE — 2026&nbsp;·&nbsp;
              <a href="/legal/terms" className="hover:text-[#10B981] transition-colors">УСЛОВИЯ</a>
              &nbsp;·&nbsp;
              <a href="/legal/privacy" className="hover:text-[#10B981] transition-colors">КОНФИДЕНЦИАЛЬНОСТЬ</a>
            </p>
          </div>
        </div>
      </motion.div>

      <style jsx global>{`
        @keyframes rise {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%, 100% { transform: translateX(-100%); opacity: 0; }
          50% { transform: translateX(100%); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
