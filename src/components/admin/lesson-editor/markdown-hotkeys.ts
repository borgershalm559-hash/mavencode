import type { EditorView, KeyBinding } from "@codemirror/view";
import type { ChangeSpec } from "@codemirror/state";

type Wrap = { before: string; after: string; placeholder: string };

function applyWrap(view: EditorView, wrap: Wrap): boolean {
  const { state } = view;
  const changes: ChangeSpec[] = [];
  const newSelections: { anchor: number; head: number }[] = [];

  state.selection.ranges.forEach((range) => {
    const empty = range.empty;
    const selected = empty ? wrap.placeholder : state.sliceDoc(range.from, range.to);

    // Toggle off: if surrounding chars already match wrap.before/after, strip them
    const beforeStart = range.from - wrap.before.length;
    const afterEnd = range.to + wrap.after.length;
    const hasBefore = beforeStart >= 0 && state.sliceDoc(beforeStart, range.from) === wrap.before;
    const hasAfter = afterEnd <= state.doc.length && state.sliceDoc(range.to, afterEnd) === wrap.after;

    if (!empty && hasBefore && hasAfter) {
      changes.push({ from: beforeStart, to: range.from, insert: "" });
      changes.push({ from: range.to, to: afterEnd, insert: "" });
      newSelections.push({
        anchor: beforeStart,
        head: range.to - wrap.before.length,
      });
      return;
    }

    const insertText = wrap.before + selected + wrap.after;
    changes.push({ from: range.from, to: range.to, insert: insertText });
    const start = range.from + wrap.before.length;
    newSelections.push({ anchor: start, head: start + selected.length });
  });

  view.dispatch({
    changes,
    selection: { ranges: newSelections.map((r) => ({ anchor: r.anchor, head: r.head })) } as never,
    scrollIntoView: true,
  });
  view.focus();
  return true;
}

function toggleHeading(level: 1 | 2 | 3) {
  return (view: EditorView): boolean => {
    const { state } = view;
    const prefix = "#".repeat(level) + " ";
    const changes: ChangeSpec[] = [];

    state.selection.ranges.forEach((range) => {
      const line = state.doc.lineAt(range.from);
      const text = line.text;
      // strip any existing leading "# ", "## ", "### "
      const stripMatch = text.match(/^(#{1,6})\s+/);
      if (stripMatch && stripMatch[1].length === level) {
        // toggle off
        changes.push({ from: line.from, to: line.from + stripMatch[0].length, insert: "" });
      } else if (stripMatch) {
        // replace existing heading marker with new level
        changes.push({ from: line.from, to: line.from + stripMatch[0].length, insert: prefix });
      } else {
        changes.push({ from: line.from, insert: prefix });
      }
    });

    view.dispatch({ changes, scrollIntoView: true });
    view.focus();
    return true;
  };
}

function insertCodeBlock(view: EditorView): boolean {
  const { state } = view;
  const range = state.selection.main;
  const selected = state.sliceDoc(range.from, range.to);
  const text = selected || "// код";
  const block = "```\n" + text + "\n```\n";
  const langPos = range.from + 3; // caret after opening fence to type lang
  view.dispatch({
    changes: { from: range.from, to: range.to, insert: block },
    selection: { anchor: langPos } as never,
    scrollIntoView: true,
  });
  view.focus();
  return true;
}

function insertLink(view: EditorView): boolean {
  const { state } = view;
  const range = state.selection.main;
  const selected = state.sliceDoc(range.from, range.to);
  const label = selected || "текст ссылки";
  const inserted = `[${label}](url)`;
  view.dispatch({
    changes: { from: range.from, to: range.to, insert: inserted },
    // place caret at "url" so the user can paste
    selection: { anchor: range.from + label.length + 3, head: range.from + label.length + 6 } as never,
    scrollIntoView: true,
  });
  view.focus();
  return true;
}

export interface HotkeyOptions {
  onSave?: () => void;
}

export function markdownHotkeys(opts: HotkeyOptions = {}): KeyBinding[] {
  const bindings: KeyBinding[] = [
    { key: "Mod-b", run: (v) => applyWrap(v, { before: "**", after: "**", placeholder: "жирный" }) },
    { key: "Mod-i", run: (v) => applyWrap(v, { before: "*", after: "*", placeholder: "курсив" }) },
    { key: "Mod-k", run: insertLink },
    { key: "Mod-Shift-c", run: insertCodeBlock },
    { key: "Mod-1", run: toggleHeading(1) },
    { key: "Mod-2", run: toggleHeading(2) },
    { key: "Mod-3", run: toggleHeading(3) },
  ];
  if (opts.onSave) {
    bindings.push({ key: "Mod-s", preventDefault: true, run: () => { opts.onSave!(); return true; } });
  }
  return bindings;
}

// Re-export wrappers as standalone command builders so toolbar can call them
export const cmdBold = (view: EditorView) =>
  applyWrap(view, { before: "**", after: "**", placeholder: "жирный" });
export const cmdItalic = (view: EditorView) =>
  applyWrap(view, { before: "*", after: "*", placeholder: "курсив" });
export const cmdInlineCode = (view: EditorView) =>
  applyWrap(view, { before: "`", after: "`", placeholder: "code" });
export const cmdLink = insertLink;
export const cmdCodeBlock = insertCodeBlock;
export const cmdH1 = toggleHeading(1);
export const cmdH2 = toggleHeading(2);
export const cmdH3 = toggleHeading(3);

export function cmdLineStart(prefix: string) {
  return (view: EditorView): boolean => {
    const { state } = view;
    const changes: ChangeSpec[] = [];
    state.selection.ranges.forEach((range) => {
      const startLine = state.doc.lineAt(range.from).number;
      const endLine = state.doc.lineAt(range.to).number;
      for (let n = startLine; n <= endLine; n++) {
        const line = state.doc.line(n);
        if (!line.text.startsWith(prefix)) {
          changes.push({ from: line.from, insert: prefix });
        }
      }
    });
    view.dispatch({ changes, scrollIntoView: true });
    view.focus();
    return true;
  };
}
