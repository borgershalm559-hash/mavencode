"use client";

import { useEffect, useRef, useState } from "react";
import type { EditorView } from "@codemirror/view";
import type { SlashItem } from "./slash-items";

interface Props {
  view: EditorView;
  items: SlashItem[];
  triggerFrom: number;
  /** End of the slash trigger (caret position). Currently unused for layout but kept for future range-aware operations. */
  triggerTo: number;
  onClose: () => void;
  onPick: (item: SlashItem) => void;
}

export function SlashMenu({ view, items, triggerFrom, onClose, onPick }: Props) {
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Clamp active to a valid range during render — avoids a setState cascade.
  const safeActive = items.length === 0 ? 0 : Math.min(active, items.length - 1);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => (items.length === 0 ? 0 : (a + 1) % items.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => (items.length === 0 ? 0 : (a - 1 + items.length) % items.length));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = items[safeActive];
        if (item) onPick(item);
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "Tab") {
        e.preventDefault();
        const item = items[safeActive];
        if (item) onPick(item);
      }
    }
    window.addEventListener("keydown", handleKey, { capture: true });
    return () => window.removeEventListener("keydown", handleKey, { capture: true });
  }, [items, safeActive, onPick, onClose]);

  useEffect(() => {
    itemRefs.current[safeActive]?.scrollIntoView({ block: "nearest" });
  }, [safeActive]);

  // Position
  const coords = view.coordsAtPos(triggerFrom);
  const editorRect = view.dom.getBoundingClientRect();
  const top = coords ? coords.bottom - editorRect.top + 4 : 0;
  const left = coords ? coords.left - editorRect.left : 0;

  if (items.length === 0) return null;

  const blocks: { item: SlashItem; idx: number }[] = [];
  const templates: { item: SlashItem; idx: number }[] = [];
  items.forEach((item, idx) => {
    if (item.section === "block") blocks.push({ item, idx });
    else templates.push({ item, idx });
  });

  function renderItem({ item, idx }: { item: SlashItem; idx: number }) {
    const isActive = idx === safeActive;
    const Icon = item.icon;
    return (
      <button
        key={item.id}
        ref={(el) => { itemRefs.current[idx] = el; }}
        type="button"
        className="w-full flex items-center gap-2 px-2 py-1.5 text-left transition-colors"
        style={{
          background: isActive ? "rgba(16,185,129,0.12)" : "transparent",
          color: isActive ? "#10B981" : "rgba(255,255,255,0.85)",
        }}
        onMouseEnter={() => setActive(idx)}
        onMouseDown={(e) => { e.preventDefault(); onPick(item); }}
      >
        <Icon size={14} className={isActive ? "text-[#10B981]" : "text-white/55"} />
        <span className="flex-1 min-w-0">
          <span className="block text-[12px] truncate">{item.title}</span>
          <span className="block text-[10px] text-white/35 font-mono truncate">{item.description}</span>
        </span>
      </button>
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute z-40 bg-[#0F1011] border-2 border-white/[0.10] shadow-lg overflow-y-auto custom-scrollbar"
      style={{ top, left, width: 280, maxHeight: 320 }}
      // Prevent the menu from stealing focus from CodeMirror (we listen on window)
      tabIndex={-1}
    >
      {blocks.length > 0 && (
        <>
          <div
            className="font-mono px-2 py-1 border-b border-white/[0.05]"
            style={{ fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", fontWeight: 700 }}
          >
            Блоки
          </div>
          {blocks.map(renderItem)}
        </>
      )}
      {templates.length > 0 && (
        <>
          <div
            className="font-mono px-2 py-1 border-b border-t border-white/[0.05]"
            style={{ fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", fontWeight: 700 }}
          >
            Шаблоны
          </div>
          {templates.map(renderItem)}
        </>
      )}
      <div className="px-2 py-1 border-t border-white/[0.05] font-mono text-[9px] text-white/30" style={{ letterSpacing: "0.18em" }}>
        ↑↓ выбор · Enter вставить · Esc закрыть
      </div>
    </div>
  );
}

// Reference a prop so eslint stops complaining about unused triggerTo
export type _SlashMenuTriggerRange = { from: number; to: number };
