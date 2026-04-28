"use client";

import { useRef } from "react";
import { Bold, Italic, Code, Link as LinkIcon, List, ListOrdered, Image as ImageIcon } from "lucide-react";
import { TheoryMarkdown } from "@/components/lesson/theory-markdown";

interface Props {
  value: string;
  onChange: (next: string) => void;
}

type WrapMode = "wrap" | "lineStart";

interface ToolbarButton {
  icon: React.ReactNode;
  title: string;
  before?: string;
  after?: string;
  placeholder?: string;
  mode?: WrapMode;
  onClick?: () => void;
}

export function MarkdownEditor({ value, onChange }: Props) {
  const taRef = useRef<HTMLTextAreaElement>(null);

  function applyWrap(before: string, after: string, placeholder: string, mode: WrapMode = "wrap") {
    const ta = taRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.slice(start, end);

    if (mode === "lineStart") {
      // Insert at the beginning of each selected line
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const before2 = value.slice(0, lineStart);
      const between = value.slice(lineStart, end);
      const transformed = between
        .split("\n")
        .map((line) => before + line)
        .join("\n");
      const after2 = value.slice(end);
      const next = before2 + transformed + after2;
      onChange(next);
      requestAnimationFrame(() => {
        ta.focus();
        ta.selectionStart = lineStart + before.length;
        ta.selectionEnd = lineStart + transformed.length;
      });
      return;
    }

    const text = selected || placeholder;
    const next = value.slice(0, start) + before + text + after + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.selectionStart = start + before.length;
      ta.selectionEnd = start + before.length + text.length;
    });
  }

  function insertLink() {
    const url = prompt("URL ссылки:", "https://");
    if (!url) return;
    applyWrap("[", `](${url})`, "текст ссылки");
  }

  function insertImage() {
    const url = prompt("URL картинки:", "https://");
    if (!url) return;
    applyWrap(`![`, `](${url})`, "alt-текст");
  }

  function insertCodeBlock() {
    const lang = prompt("Язык (python / html / javascript / css / none):", "python") ?? "";
    const fence = "```";
    applyWrap(`${fence}${lang}\n`, `\n${fence}`, "// код");
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    const meta = e.metaKey || e.ctrlKey;
    if (!meta) return;
    if (e.key === "b") { e.preventDefault(); applyWrap("**", "**", "жирный"); }
    if (e.key === "i") { e.preventDefault(); applyWrap("*", "*", "курсив"); }
    if (e.key === "k") { e.preventDefault(); insertLink(); }
  }

  const buttons: ToolbarButton[] = [
    { icon: <Bold size={14} />, title: "Жирный (Ctrl+B)", before: "**", after: "**", placeholder: "жирный" },
    { icon: <Italic size={14} />, title: "Курсив (Ctrl+I)", before: "*", after: "*", placeholder: "курсив" },
    { icon: <Code size={14} />, title: "Inline-код", before: "`", after: "`", placeholder: "code" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Editor side */}
      <div className="border-2 border-white/[0.07] bg-[#0F1011] flex flex-col min-h-[480px]">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 px-2 py-1.5 border-b border-white/[0.07] bg-black/20">
          {buttons.map((b, i) => (
            <button
              key={i}
              type="button"
              title={b.title}
              onClick={() => applyWrap(b.before!, b.after!, b.placeholder!)}
              className="size-7 grid place-items-center text-white/55 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              {b.icon}
            </button>
          ))}
          <span className="w-px h-5 bg-white/10 mx-1" />
          <button
            type="button"
            title="Заголовок 1"
            onClick={() => applyWrap("# ", "", "Заголовок", "lineStart")}
            className="font-mono text-[10px] px-2 h-7 text-white/55 hover:text-white hover:bg-white/[0.06]"
          >H1</button>
          <button
            type="button"
            title="Заголовок 2"
            onClick={() => applyWrap("## ", "", "Заголовок", "lineStart")}
            className="font-mono text-[10px] px-2 h-7 text-white/55 hover:text-white hover:bg-white/[0.06]"
          >H2</button>
          <button
            type="button"
            title="Заголовок 3"
            onClick={() => applyWrap("### ", "", "Заголовок", "lineStart")}
            className="font-mono text-[10px] px-2 h-7 text-white/55 hover:text-white hover:bg-white/[0.06]"
          >H3</button>
          <span className="w-px h-5 bg-white/10 mx-1" />
          <button
            type="button"
            title="Маркированный список"
            onClick={() => applyWrap("- ", "", "пункт", "lineStart")}
            className="size-7 grid place-items-center text-white/55 hover:text-white hover:bg-white/[0.06]"
          ><List size={14} /></button>
          <button
            type="button"
            title="Нумерованный список"
            onClick={() => applyWrap("1. ", "", "пункт", "lineStart")}
            className="size-7 grid place-items-center text-white/55 hover:text-white hover:bg-white/[0.06]"
          ><ListOrdered size={14} /></button>
          <span className="w-px h-5 bg-white/10 mx-1" />
          <button
            type="button"
            title="Ссылка (Ctrl+K)"
            onClick={insertLink}
            className="size-7 grid place-items-center text-white/55 hover:text-white hover:bg-white/[0.06]"
          ><LinkIcon size={14} /></button>
          <button
            type="button"
            title="Картинка"
            onClick={insertImage}
            className="size-7 grid place-items-center text-white/55 hover:text-white hover:bg-white/[0.06]"
          ><ImageIcon size={14} /></button>
          <button
            type="button"
            title="Блок кода"
            onClick={insertCodeBlock}
            className="font-mono text-[10px] px-2 h-7 text-white/55 hover:text-white hover:bg-white/[0.06]"
          >&lt;/&gt; code</button>
        </div>

        {/* Textarea */}
        <textarea
          ref={taRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="# Заголовок урока&#10;&#10;Текст теории..."
          className="flex-1 px-4 py-3 bg-transparent text-white text-sm font-mono leading-relaxed outline-none resize-none"
          style={{ minHeight: 440 }}
          spellCheck={false}
        />
      </div>

      {/* Preview side */}
      <div className="border-2 border-white/[0.07] bg-[#0B0B0C] overflow-y-auto custom-scrollbar" style={{ maxHeight: 800 }}>
        <div
          className="font-mono px-4 py-2 border-b border-white/[0.07]"
          style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}
        >
          Предпросмотр
        </div>
        <div className="p-6">
          {value.trim() ? (
            <TheoryMarkdown content={value} />
          ) : (
            <p className="text-white/30 text-sm font-mono">Здесь появится отрендеренный markdown…</p>
          )}
        </div>
      </div>
    </div>
  );
}
