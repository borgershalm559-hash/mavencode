"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Play, RotateCcw, Loader2 } from "lucide-react";
import { onPyodideLoadingStatus, type PyodideLoadingStatus } from "./runners/python-runner";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-[#1A1A1F]">
      <Loader2 className="w-5 h-5 text-white/20 animate-spin" />
    </div>
  ),
});

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

  const handleEditorMount = useCallback((editor: unknown) => {
    editorRef.current = editor;
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-surface border-b-2 border-white/[0.07]">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/30 uppercase tracking-widest font-mono">
            {language}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono
              text-white/40 hover:text-white/70 transition-all border-2 border-transparent hover:border-white/[0.07]"
          >
            <RotateCcw className="w-3 h-3" />
            Сброс
          </button>

          <button
            onClick={onRun}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium
              bg-[#10B981] text-black border-2 border-black uppercase tracking-[0.05em]
              hover:bg-[#047857] transition-all
              disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ boxShadow: isRunning ? "none" : "3px 3px 0 0 rgba(16,185,129,0.50)" }}
          >
            {isRunning ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Play className="w-3 h-3" />
            )}
            {isRunning ? "Выполняю..." : "Запустить"}
          </button>
        </div>
      </div>

      {/* Pyodide loading overlay */}
      {language === "python" && pyodideStatus === "loading" && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#10B981]/[0.06] border-b border-[#10B981]/10">
          <Loader2 className="w-3.5 h-3.5 text-[#10B981] animate-spin" />
          <span className="text-xs text-[#10B981]/80">Загрузка Python (~50MB)...</span>
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
