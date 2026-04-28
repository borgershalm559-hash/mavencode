"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import type { LessonLanguage } from "./types";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-[#0E0E10]">
      <Loader2 size={20} className="animate-spin text-white/15" />
    </div>
  ),
});

interface Props {
  language: LessonLanguage;
  starterCode: string;
  solution: string;
  onChange: (patch: { starterCode?: string; solution?: string }) => void;
}

const monacoLang: Record<LessonLanguage, string> = {
  python: "python",
  html: "html",
  javascript: "javascript",
  typescript: "typescript",
};

const editorOptions = {
  fontSize: 13,
  fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  lineNumbers: "on" as const,
  renderLineHighlight: "line" as const,
  padding: { top: 12, bottom: 12 },
  smoothScrolling: true,
  bracketPairColorization: { enabled: true },
  tabSize: 2,
  wordWrap: "on" as const,
  automaticLayout: true,
};

export function CodePair({ language, starterCode, solution, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Panel
        label="Стартовый код (что увидит студент)"
        sub="Может содержать комментарии-подсказки и плейсхолдеры"
      >
        <MonacoEditor
          height={320}
          language={monacoLang[language]}
          value={starterCode}
          onChange={(v) => onChange({ starterCode: v ?? "" })}
          theme="vs-dark"
          options={editorOptions}
        />
      </Panel>

      <Panel
        label="Решение (приватное)"
        sub="Эталон. Студенты не видят. Используется для self-check."
      >
        <MonacoEditor
          height={320}
          language={monacoLang[language]}
          value={solution}
          onChange={(v) => onChange({ solution: v ?? "" })}
          theme="vs-dark"
          options={editorOptions}
        />
      </Panel>
    </div>
  );
}

function Panel({ label, sub, children }: { label: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="border-2 border-white/[0.07] bg-[#0E0E10]">
      <div className="px-3 py-2 border-b border-white/[0.07]">
        <div
          className="font-mono"
          style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", fontWeight: 700 }}
        >
          {label}
        </div>
        <div className="font-mono text-[10px] text-white/30 mt-0.5">{sub}</div>
      </div>
      {children}
    </div>
  );
}
