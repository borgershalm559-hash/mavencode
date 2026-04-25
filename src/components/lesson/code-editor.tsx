"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { RotateCcw, Loader2 } from "lucide-react";
import { onPyodideLoadingStatus, type PyodideLoadingStatus } from "./runners/python-runner";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full" style={{ background: "#0E0E10" }}>
      <Loader2 className="w-5 h-5 text-white/15 animate-spin" />
    </div>
  ),
});

const LANG_FILENAME: Record<string, string> = {
  python:     "solution.py",
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
    <div className="flex flex-col h-full" style={{ background: "#0E0E10" }}>
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 24px",
          background: "#101013",
          borderBottom: "2px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Left: traffic lights + filename */}
        <div
          className="font-mono"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 10,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          {/* macOS squares — no border-radius */}
          <span style={{ width: 8, height: 8, background: "#FF5F56", display: "inline-block" }} />
          <span style={{ width: 8, height: 8, background: "#FFBD2E", display: "inline-block" }} />
          <span style={{ width: 8, height: 8, background: "#27C93F", display: "inline-block" }} />
          <span style={{ marginLeft: 14 }}>{filename}</span>
        </div>

        {/* Right: reset + run */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={onReset}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 12px",
              border: "2px solid transparent",
              background: "transparent",
              color: "rgba(255,255,255,0.45)",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 11,
              letterSpacing: "0.1em",
              cursor: "pointer",
            }}
          >
            <RotateCcw size={13} /> Сброс
          </button>

          <button
            onClick={onRun}
            disabled={isRunning}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              border: "2px solid #0B0B0C",
              background: "#10B981",
              color: "#0B0B0C",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              boxShadow: isRunning ? "none" : "3px 3px 0 0 rgba(16,185,129,0.67)",
              opacity: isRunning ? 0.6 : 1,
              cursor: isRunning ? "not-allowed" : "pointer",
            }}
          >
            {isRunning ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#0B0B0C">
                <polygon points="5,3 19,12 5,21"/>
              </svg>
            )}
            {isRunning ? "Выполняю..." : "Запустить"}
          </button>
        </div>
      </div>

      {/* Pyodide loading banner */}
      {language === "python" && pyodideStatus === "loading" && (
        <div
          className="font-mono"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 24px",
            background: "rgba(16,185,129,0.04)",
            borderBottom: "1px solid rgba(16,185,129,0.1)",
            fontSize: 10,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(16,185,129,0.7)",
          }}
        >
          <Loader2 size={12} className="animate-spin" />
          Загрузка Python (~50 MB)...
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
            fontSize: 13.5,
            fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: "on",
            renderLineHighlight: "line",
            padding: { top: 20, bottom: 20 },
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
