"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Global Error]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D1117] px-4">
      <div className="max-w-sm w-full text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7 text-red-400" />
        </div>
        <h2 className="text-lg font-bold text-white/90 mb-1">Что-то пошло не так</h2>
        <p className="text-sm text-white/40 mb-6">
          Произошла непредвиденная ошибка. Попробуйте перезагрузить страницу.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
            bg-gradient-to-r from-[#10B981] to-[#047857] text-white
            hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Попробовать снова
        </button>
      </div>
    </div>
  );
}
