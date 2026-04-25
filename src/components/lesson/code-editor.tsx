"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Play, RotateCcw, Loader2 } from "lucide-react";
import { onPyodideLoadingStatus, type PyodideLoadingStatus } from "./runners/python-runner";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-[#111113]">
      <Loader2 className="w-5 h-5 text-white/15 animate-spin" />
    </div>
  ),
});

const LANG_FILENAME: Record<string, string> = {
  python: "solution.py",
  javascript: "solution.js",
  typescript: "solution.ts",
};

interface CodeEditorProps {
  code: string;
  language: string;
  onChange: (value: string) => void;
  onRun: () => void;
  onReset: () => void;
  isRunning: boolean;
  readOnly?: boolean;
}

export function CodeEditor({
  code,
  language,
  onChange,
  onRun,
  onReset,
  isRunning,
  readOnly = false,
}: CodeEditorProps) {
  const editorRef = useRef<unknown>(null);
  const [pyodideStatus, setPyodideStatus] = useState<PyodideLoadingStatus | null>(null);

  useEffect(() => {
    if (language === "python") {
      onPyodideLoadingStatus(setPyodideStatus);
    }
  }, [language]);

  const monacoLanguage = language === "python" ? "python" : "javascript";
  const filename = LANG_FILENAME[language] ?? `solution.${language}`;

  const handleEditorMount = useCallback((editor: unknown) => {
    editorRef.current = editor;
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#111113]">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          {/* macOS traffic lights */}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>

          {/* Filename tab */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 border border-white/[0.08] bg-white/[0.03]">
            <span className="font-mono text-[10px] text-white/45">{filename}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-mono
              text-white/30 hover:text-white/55 transition-colors uppercase tracking-[0.1em]"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Сброс</span>
          </button>

          <button
            onClick={onRun}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono font-medium
              bg-[#10B981] text-black border border-black/20 uppercase tracking-[0.08em]
              hover:bg-[#0da876] transition-all
              disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              boxShadow: isRunning ? "none" : "2px 2px 0 0 rgba(16,185,129,0.4)",
            }}
          >
            {isRunning ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Play className="w-3 h-3 fill-black" />
            )}
            {isRunning ? "Выполняю" : "Запустить"}
          </button>
        </div>
      </div>

      {/* Pyodide loading banner */}
      {language === "python" && pyodideStatus === "loading" && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#10B981]/[0.04] border-b border-[#10B981]/10">
          <Loader2 className="w-3 h-3 text-[#10B981] animate-spin" />
          <span className="text-[10px] font-mono text-[#10B981]/70 uppercase tracking-[0.1em]">
            Загрузка Python (~50 MB)...
          </span>
        </div>
      )}

      {/* Editor */}
      <div className="flex-1 min-h-0">
        <MonacoEditor
          height="100%"
          language={monacoLanguage}
          value={code}
          onChange={(v) => onChange(v || "")}
          onMount={handleEditorMount}
          theme="vs-dark"
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: "on",
            renderLineHighlight: "line",
            padding: { top: 12, bottom: 12 },
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            bracketPairColorization: { enabled: true },
            tabSize: 2,
            wordWrap: "on",
            readOnly,
            contextmenu: false,
          }}
        />
      </div>
    </div>
  );
}
