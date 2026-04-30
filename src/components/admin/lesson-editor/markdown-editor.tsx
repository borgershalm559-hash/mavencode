"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CodeMirror, { type ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { EditorView, keymap } from "@codemirror/view";
import { Prec } from "@codemirror/state";
import { markdown } from "@codemirror/lang-markdown";
import {
  Bold, Italic, Code, Link as LinkIcon, List, ListOrdered, Image as ImageIcon, Heading1, Heading2, Heading3, Quote,
} from "lucide-react";
import { TheoryMarkdown } from "@/components/lesson/theory-markdown";
import {
  markdownHotkeys,
  cmdBold, cmdItalic, cmdInlineCode, cmdLink, cmdCodeBlock,
  cmdH1, cmdH2, cmdH3, cmdLineStart,
} from "./markdown-hotkeys";
import { insertImageWithUpload, type EditorContext } from "./image-upload";
import { SlashMenu } from "./slash-menu";
import { getSlashItemsForContext, filterSlashItems, type SlashItem } from "./slash-items";

interface Props {
  value: string;
  onChange: (next: string) => void;
  context?: EditorContext;
  onSave?: () => void;
}

interface SlashState {
  triggerFrom: number;
  triggerTo: number;
  query: string;
}

export function MarkdownEditor({ value, onChange, context = "lesson", onSave }: Props) {
  const cmRef = useRef<ReactCodeMirrorRef>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [view, setView] = useState<EditorView | null>(null);
  const [slash, setSlash] = useState<SlashState | null>(null);

  const closeSlash = useCallback(() => setSlash(null), []);

  const handleFilePicked = useCallback((file: File) => {
    if (!view) return;
    const pos = view.state.selection.main.head;
    insertImageWithUpload(view, pos, file);
  }, [view]);

  const pickImage = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handlePickItem = useCallback((item: SlashItem) => {
    if (!view || !slash) return;
    item.insert(view, slash.triggerFrom, slash.triggerTo, { pickImage });
    setSlash(null);
  }, [view, slash, pickImage]);

  // Detect "/" at start of empty line and update query as user types after it
  const slashDetector = useMemo(() => EditorView.updateListener.of((update) => {
    if (!update.docChanged && !update.selectionSet) return;
    const view = update.view;
    const { state } = view;
    const range = state.selection.main;
    if (!range.empty) { setSlash(null); return; }

    const head = range.head;
    const line = state.doc.lineAt(head);
    const beforeCaret = state.sliceDoc(line.from, head);

    // active slash trigger = line starts with "/" optionally followed by a-z chars
    const m = beforeCaret.match(/^\/([\p{L}\p{N}\-_]*)$/u);
    if (m) {
      setSlash({
        triggerFrom: line.from,
        triggerTo: head,
        query: m[1],
      });
    } else {
      setSlash(null);
    }
  }), []);

  // Drag&drop / paste image handling at view level
  const dropPasteHandlers = useMemo(() => EditorView.domEventHandlers({
    paste(event, view) {
      const items = event.clipboardData?.items;
      if (!items) return false;
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        if (it.kind === "file" && it.type.startsWith("image/")) {
          const file = it.getAsFile();
          if (file) {
            event.preventDefault();
            const pos = view.state.selection.main.head;
            insertImageWithUpload(view, pos, file);
            return true;
          }
        }
      }
      return false;
    },
    drop(event, view) {
      const files = event.dataTransfer?.files;
      if (!files || files.length === 0) return false;
      const images = Array.from(files).filter((f) => f.type.startsWith("image/"));
      if (images.length === 0) return false;
      event.preventDefault();
      const pos = view.posAtCoords({ x: event.clientX, y: event.clientY }) ?? view.state.selection.main.head;
      images.forEach((f) => insertImageWithUpload(view, pos, f));
      return true;
    },
  }), []);

  const extensions = useMemo(() => [
    markdown(),
    Prec.highest(keymap.of(markdownHotkeys({ onSave }))),
    slashDetector,
    dropPasteHandlers,
    EditorView.lineWrapping,
    EditorView.theme({
      "&": { fontSize: "13.5px", height: "100%", backgroundColor: "transparent" },
      ".cm-content": {
        fontFamily: "var(--font-mono, ui-monospace, SFMono-Regular, monospace)",
        padding: "12px 16px",
        caretColor: "#10B981",
        color: "rgba(255,255,255,0.92)",
      },
      ".cm-scroller": { overflow: "auto" },
      ".cm-cursor": { borderLeftColor: "#10B981", borderLeftWidth: "2px" },
      ".cm-selectionBackground, ::selection": { backgroundColor: "rgba(16,185,129,0.20)" },
      "&.cm-focused .cm-selectionBackground": { backgroundColor: "rgba(16,185,129,0.25)" },
      ".cm-line": { padding: "0" },
      ".cm-activeLine": { backgroundColor: "transparent" },
      ".cm-gutters": { display: "none" },
      ".cm-header-1, .cm-header1": { color: "#fff", fontWeight: "700" },
      ".cm-header-2, .cm-header2": { color: "#10B981" },
      ".cm-link, .cm-url": { color: "#60a5fa" },
      ".cm-quote": { color: "rgba(255,255,255,0.7)", fontStyle: "italic" },
      ".cm-strong": { color: "#fff", fontWeight: "700" },
      ".cm-emphasis": { color: "rgba(255,255,255,0.95)", fontStyle: "italic" },
      ".cm-monospace, .cm-inline-code": { color: "#fbbf24" },
      ".tok-meta": { color: "rgba(16,185,129,0.7)" },
    }, { dark: true }),
  ], [onSave, slashDetector, dropPasteHandlers]);

  // The list of slash items, filtered by both context and current query.
  const slashItems = useMemo(() => {
    if (!slash) return [] as SlashItem[];
    return filterSlashItems(getSlashItemsForContext(context), slash.query);
  }, [slash, context]);

  // Close slash menu on click outside CodeMirror
  useEffect(() => {
    if (!slash || !view) return;
    function onPointerDown(e: PointerEvent) {
      const dom = view!.dom;
      if (e.target instanceof Node && !dom.contains(e.target)) {
        const t = e.target as Element;
        if (!t.closest("[data-slash-menu]")) closeSlash();
      }
    }
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [slash, view, closeSlash]);

  function tbCmd(fn: (v: EditorView) => boolean) {
    return () => {
      if (view) fn(view);
    };
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Editor side */}
      <div className="border-2 border-white/[0.07] bg-[#0F1011] flex flex-col min-h-[480px] relative">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 px-2 py-1.5 border-b border-white/[0.07] bg-black/20">
          <ToolbarBtn title="Жирный (Ctrl+B)" onClick={tbCmd(cmdBold)}><Bold size={14} /></ToolbarBtn>
          <ToolbarBtn title="Курсив (Ctrl+I)" onClick={tbCmd(cmdItalic)}><Italic size={14} /></ToolbarBtn>
          <ToolbarBtn title="Inline-код" onClick={tbCmd(cmdInlineCode)}><Code size={14} /></ToolbarBtn>
          <Sep />
          <ToolbarBtn title="Заголовок 1 (Ctrl+1)" onClick={tbCmd(cmdH1)}><Heading1 size={14} /></ToolbarBtn>
          <ToolbarBtn title="Заголовок 2 (Ctrl+2)" onClick={tbCmd(cmdH2)}><Heading2 size={14} /></ToolbarBtn>
          <ToolbarBtn title="Заголовок 3 (Ctrl+3)" onClick={tbCmd(cmdH3)}><Heading3 size={14} /></ToolbarBtn>
          <Sep />
          <ToolbarBtn title="Цитата" onClick={tbCmd(cmdLineStart("> "))}><Quote size={14} /></ToolbarBtn>
          <ToolbarBtn title="Список" onClick={tbCmd(cmdLineStart("- "))}><List size={14} /></ToolbarBtn>
          <ToolbarBtn title="Нумерованный список" onClick={tbCmd(cmdLineStart("1. "))}><ListOrdered size={14} /></ToolbarBtn>
          <Sep />
          <ToolbarBtn title="Ссылка (Ctrl+K)" onClick={tbCmd(cmdLink)}><LinkIcon size={14} /></ToolbarBtn>
          <ToolbarBtn title="Картинка — drag&drop, paste или нажми" onClick={pickImage}><ImageIcon size={14} /></ToolbarBtn>
          <button
            type="button"
            title="Блок кода (Ctrl+Shift+C)"
            onClick={tbCmd(cmdCodeBlock)}
            className="font-mono text-[10px] px-2 h-7 text-white/55 hover:text-white hover:bg-white/[0.06]"
          >&lt;/&gt; code</button>
          <div className="flex-1" />
          <span className="font-mono text-[10px] text-white/30 px-2 hidden md:inline">/  для меню</span>
        </div>

        {/* CodeMirror */}
        <div className="flex-1 min-h-[440px] overflow-hidden">
          <CodeMirror
            ref={cmRef}
            value={value}
            onChange={onChange}
            onCreateEditor={(v) => setView(v)}
            extensions={extensions}
            theme="dark"
            basicSetup={{
              lineNumbers: false,
              foldGutter: false,
              highlightActiveLine: false,
              highlightActiveLineGutter: false,
              autocompletion: false,
              dropCursor: true,
              indentOnInput: true,
            }}
            placeholder="# Заголовок\n\nТекст… Нажми «/» чтобы открыть меню блоков и шаблонов."
            spellCheck={false}
            style={{ height: "100%" }}
          />
        </div>

        {/* Slash menu overlay */}
        {slash && view && (
          <div data-slash-menu>
            <SlashMenu
              view={view}
              items={slashItems}
              triggerFrom={slash.triggerFrom}
              triggerTo={slash.triggerTo}
              onClose={closeSlash}
              onPick={handlePickItem}
            />
          </div>
        )}

        {/* Hidden file input for image button */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFilePicked(f);
            e.target.value = "";
          }}
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

interface ToolbarBtnProps {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}

function ToolbarBtn({ title, onClick, children }: ToolbarBtnProps) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="size-7 grid place-items-center text-white/55 hover:text-white hover:bg-white/[0.06] transition-colors"
    >
      {children}
    </button>
  );
}

function Sep() {
  return <span className="w-px h-5 bg-white/10 mx-1" />;
}
