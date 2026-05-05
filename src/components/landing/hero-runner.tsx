"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { Play, Loader2 } from "lucide-react";
import { JsRunner } from "@/components/lesson/runners/js-runner";
import { PythonRunner, onPyodideLoadingStatus, type PyodideLoadingStatus } from "@/components/lesson/runners/python-runner";
import { HtmlRunner } from "@/components/lesson/runners/html-runner";
import { G, GL, EASE } from "./shared";

type Lang = "python" | "javascript" | "html";

interface Snippet {
  code: string;
  filename: string;
  highlight: (code: string) => React.ReactNode;
}

const SNIPPETS: Record<Lang, Snippet> = {
  python: {
    filename: "lesson_01.py",
    code: `def sum_list(nums: list[int]) -> int:
    return sum(nums)

print(sum_list([1, 2, 3, 4]))`,
    highlight: (code) => <CodePython code={code} />,
  },
  javascript: {
    filename: "lesson_01.js",
    code: `function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("MavenCode"));`,
    highlight: (code) => <CodeJs code={code} />,
  },
  html: {
    filename: "lesson_01.html",
    code: `<button class="cta">
  Начать
</button>
<style>
  .cta { color: #10B981; padding: 8px 16px; }
</style>`,
    highlight: (code) => <CodeHtml code={code} />,
  },
};

export function HeroRunner() {
  const [lang, setLang] = useState<Lang>("python");
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [pyStatus, setPyStatus] = useState<PyodideLoadingStatus | null>(null);
  const runControls = useAnimation();

  // Subscribe once for Pyodide loading banner.
  useEffect(() => {
    onPyodideLoadingStatus(setPyStatus);
    return () => {
      // Module-singleton subscription — overwrite with no-op so stale setter is never called.
      onPyodideLoadingStatus(() => {});
    };
  }, []);

  const pyRunnerRef = useRef<PythonRunner | null>(null);
  const jsRunnerRef = useRef<JsRunner | null>(null);
  const htmlRunnerRef = useRef<HtmlRunner | null>(null);

  useEffect(() => {
    return () => {
      pyRunnerRef.current?.destroy();
      jsRunnerRef.current?.destroy();
      htmlRunnerRef.current?.destroy();
    };
  }, []);

  async function handleRun() {
    runControls.start({
      boxShadow: [`3px 3px 0 0 ${GL}`, `0 0 24px ${G}`, `3px 3px 0 0 ${GL}`],
      transition: { duration: 0.45 },
    });
    setRunning(true);
    setOutput(null);
    setError(null);
    try {
      const snippet = SNIPPETS[lang].code;
      let result;
      if (lang === "python") {
        pyRunnerRef.current ??= new PythonRunner();
        result = await pyRunnerRef.current.run(snippet, []);
      } else if (lang === "javascript") {
        jsRunnerRef.current ??= new JsRunner();
        result = await jsRunnerRef.current.run(snippet, []);
      } else {
        htmlRunnerRef.current ??= new HtmlRunner();
        result = await htmlRunnerRef.current.run(snippet, []);
      }
      setOutput(result.output || "✓ выполнено без вывода");
      setError(result.error);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setRunning(false);
    }
  }

  const snippet = SNIPPETS[lang];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.15, ease: EASE }}
      className="relative bg-[#0F1011] border-2 border-white/[0.07]"
      style={{ boxShadow: `6px 6px 0 0 ${GL}` }}
    >
      {/* Terminal chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b-2 border-white/[0.07]">
        <div className="size-2.5 rounded-full bg-red-500/70" />
        <div className="size-2.5 rounded-full bg-yellow-500/70" />
        <div className="size-2.5 rounded-full" style={{ background: G + "aa" }} />
        <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
          {snippet.filename}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex border-b-2 border-white/[0.07]">
        {(["python", "javascript", "html"] as Lang[]).map((l) => {
          const active = lang === l;
          return (
            <button
              key={l}
              onClick={() => { setLang(l); setOutput(null); setError(null); }}
              className={`relative flex-1 py-2 font-mono text-[10px] uppercase tracking-[0.2em] font-bold transition-colors ${
                active
                  ? "bg-[rgba(16,185,129,0.08)] text-[#10B981]"
                  : "text-white/40 hover:bg-[rgba(16,185,129,0.04)] hover:text-white/60"
              }`}
            >
              {l}
              {active && (
                <motion.div
                  layoutId="hero-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ background: G }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Code body */}
      <pre className="px-5 py-4 font-mono text-[12px] leading-relaxed text-white/85 overflow-x-auto">
        {snippet.highlight(snippet.code)}
      </pre>

      {/* Run + output */}
      <div className="px-5 pb-5 pt-2 border-t-2 border-white/[0.07] space-y-3">
        <motion.button
          onClick={handleRun}
          disabled={running}
          whileHover={running ? undefined : { scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          animate={runControls}
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] font-black px-4 py-2 border-2 transition-colors disabled:opacity-50"
          style={{ background: G, borderColor: G, color: "#000", boxShadow: `3px 3px 0 0 ${GL}` }}
        >
          {running ? <Loader2 className="size-3 animate-spin" /> : <Play className="size-3" />}
          Запустить
        </motion.button>

        {pyStatus === "loading" && lang === "python" && (
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
            // загрузка python (~50 mb, один раз)…
          </div>
        )}

        {pyStatus === "error" && lang === "python" && (
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-red-400/70">
            // python недоступен — попробуйте JS или HTML
          </div>
        )}

        {output && (
          <div className="font-mono text-[11px] text-white/70 whitespace-pre-wrap">{output}</div>
        )}
        {error && (
          <div className="font-mono text-[11px] text-red-400 whitespace-pre-wrap">{error}</div>
        )}
        {!output && !error && !running && (
          <div className="inline-flex items-center gap-2">
            <span
              className="px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-[0.1em] border-2"
              style={{ color: G, borderColor: GL, background: "rgba(16,185,129,0.06)" }}
            >
              ✓ готов к запуску
            </span>
            <span className="text-white/30 text-[11px] font-mono">+50 XP</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Inline syntax-highlight helpers ─────────────────────────────────────────
// Minimal coloring — keyword / string / comment / function. Good enough for
// landing snippets; full highlighting lives in the lesson editor's CodeMirror.

function CodePython({ code }: { code: string }) {
  const KEYWORDS = /\b(def|return|print|list|int|for|in|if|else|elif|class|import|from|as)\b/g;
  return <Highlighted code={code} kwRe={KEYWORDS} stringRe={/(\"[^\"]*\"|'[^']*')/g} commentRe={/(#.*$)/gm} />;
}
function CodeJs({ code }: { code: string }) {
  const KEYWORDS = /\b(function|return|const|let|var|if|else|for|while|class|import|from|export|console)\b/g;
  return <Highlighted code={code} kwRe={KEYWORDS} stringRe={/(\"[^\"]*\"|'[^']*'|`[^`]*`)/g} commentRe={/(\/\/.*$)/gm} />;
}
function CodeHtml({ code }: { code: string }) {
  const tagRe = /(&lt;\/?[a-zA-Z][^&]*?&gt;|<\/?[a-zA-Z][^>]*?>)/g;
  return <Highlighted code={code} kwRe={tagRe} stringRe={/("[^"]*")/g} commentRe={/(<!--[\s\S]*?-->)/g} />;
}

function Highlighted({ code, kwRe, stringRe, commentRe }: { code: string; kwRe: RegExp; stringRe: RegExp; commentRe: RegExp }) {
  let html = code
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(commentRe, (m) => `COMMENT${m}/COMMENT`)
    .replace(stringRe, (m) => `STRING${m}/STRING`)
    .replace(kwRe, (m) => `KW${m}/KW`);

  const parts: React.ReactNode[] = [];
  const re = /(COMMENT|STRING|KW)([\s\S]*?)\/(?:COMMENT|STRING|KW)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = re.exec(html)) !== null) {
    if (match.index > lastIndex) parts.push(<span key={key++}>{html.slice(lastIndex, match.index)}</span>);
    const color = match[1] === "COMMENT" ? "rgba(255,255,255,0.3)" : match[1] === "STRING" ? "#A3E635" : "#10B981";
    parts.push(<span key={key++} style={{ color }}>{match[2]}</span>);
    lastIndex = re.lastIndex;
  }
  if (lastIndex < html.length) parts.push(<span key={key++}>{html.slice(lastIndex)}</span>);
  return <>{parts}</>;
}
