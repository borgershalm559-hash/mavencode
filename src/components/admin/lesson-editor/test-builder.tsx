"use client";

import { useState } from "react";
import { ArrowUp, ArrowDown, Trash2, Plus, ChevronDown } from "lucide-react";
import type { IoTestCase, HtmlAssertion, LessonDraft, LessonLanguage, LessonType } from "./types";

type Mode = "io" | "html" | "quiz";

function modeFor(type: LessonType, language: LessonLanguage): Mode {
  if (type === "quiz") return "quiz";
  if (language === "html") return "html";
  return "io";
}

interface Props {
  draft: LessonDraft;
  onChange: (patch: Partial<LessonDraft>) => void;
}

export function TestBuilder({ draft, onChange }: Props) {
  const mode = modeFor(draft.type, draft.language);

  function setTests(next: IoTestCase[] | HtmlAssertion[]) {
    onChange({ tests: next });
  }

  function moveUp(i: number) {
    if (i === 0) return;
    const arr = [...(draft.tests as unknown[])];
    [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
    setTests(arr as IoTestCase[] | HtmlAssertion[]);
  }
  function moveDown(i: number) {
    const arr = [...(draft.tests as unknown[])];
    if (i >= arr.length - 1) return;
    [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]];
    setTests(arr as IoTestCase[] | HtmlAssertion[]);
  }
  function remove(i: number) {
    const arr = [...(draft.tests as unknown[])];
    arr.splice(i, 1);
    setTests(arr as IoTestCase[] | HtmlAssertion[]);
  }
  function update<T>(i: number, patch: Partial<T>) {
    const arr = [...(draft.tests as unknown[])] as T[];
    arr[i] = { ...arr[i], ...patch };
    setTests(arr as unknown as IoTestCase[] | HtmlAssertion[]);
  }

  function addTest() {
    const arr = [...(draft.tests as unknown[])];
    if (mode === "io") {
      arr.push({ input: "", expected: "", description: "" } as IoTestCase);
    } else if (mode === "quiz") {
      // Quiz uses IoTestCase with options encoded in description as "a|b|c"
      arr.push({ input: "", expected: "", description: "" } as IoTestCase);
    } else {
      arr.push({ kind: "exists", selector: "", description: "" } as HtmlAssertion);
    }
    setTests(arr as IoTestCase[] | HtmlAssertion[]);
  }

  return (
    <div className="border-2 border-white/[0.07] bg-[#0F1011] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <div
            className="font-mono"
            style={{ fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", fontWeight: 700 }}
          >
            § Тесты
          </div>
          <div className="font-mono text-[10px] text-white/30 mt-0.5">
            {mode === "io" && "I/O-тесты — выражение → ожидаемое значение"}
            {mode === "html" && "DOM/CSS-проверки через querySelector и getComputedStyle"}
            {mode === "quiz" && "Вопросы с вариантами ответа"}
          </div>
        </div>
        <button
          type="button"
          onClick={addTest}
          className="font-mono text-[11px] inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-[#10B981]/30 bg-[#10B981]/[0.08] text-[#10B981] hover:bg-[#10B981]/[0.15]"
          style={{ letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}
        >
          <Plus size={14} />
          Добавить
        </button>
      </div>

      {(draft.tests as unknown[]).length === 0 && (
        <div className="font-mono text-[11px] text-white/35 py-6 text-center border border-dashed border-white/[0.08]">
          Нет тестов. Минимум 1 тест требуется для публикации.
        </div>
      )}

      <div className="space-y-2">
        {(draft.tests as unknown[]).map((test, i) => {
          const common = {
            i,
            total: (draft.tests as unknown[]).length,
            onUp: () => moveUp(i),
            onDown: () => moveDown(i),
            onRemove: () => remove(i),
          };
          if (mode === "io") {
            return (
              <IoCard
                key={i}
                {...common}
                test={test as IoTestCase}
                onChange={(patch) => update<IoTestCase>(i, patch)}
              />
            );
          }
          if (mode === "quiz") {
            return (
              <QuizCard
                key={i}
                {...common}
                test={test as IoTestCase}
                onChange={(patch) => update<IoTestCase>(i, patch)}
              />
            );
          }
          return (
            <HtmlCard
              key={i}
              {...common}
              test={test as HtmlAssertion}
              onChange={(patch) => update<HtmlAssertion>(i, patch as Partial<HtmlAssertion>)}
            />
          );
        })}
      </div>
    </div>
  );
}

// ── Common card chrome ───────────────────────────────────────────────────
interface CardCommon {
  i: number;
  total: number;
  onUp: () => void;
  onDown: () => void;
  onRemove: () => void;
}

function CardChrome({
  title, i, total, onUp, onDown, onRemove, children,
}: CardCommon & { title: string; children: React.ReactNode }) {
  return (
    <div className="border-2 border-white/[0.07] bg-black/30 p-3">
      <div className="flex items-center justify-between mb-2">
        <div
          className="font-mono"
          style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", fontWeight: 600 }}
        >
          {title} #{i + 1}
        </div>
        <div className="flex gap-1">
          <button type="button" disabled={i === 0} onClick={onUp} className="size-7 grid place-items-center text-white/40 hover:text-white disabled:opacity-30">
            <ArrowUp size={14} />
          </button>
          <button type="button" disabled={i === total - 1} onClick={onDown} className="size-7 grid place-items-center text-white/40 hover:text-white disabled:opacity-30">
            <ArrowDown size={14} />
          </button>
          <button type="button" onClick={onRemove} className="size-7 grid place-items-center text-white/40 hover:text-red-400">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}

const inputCls = "w-full h-8 px-2 bg-[#0B0B0C] border border-white/[0.08] text-xs text-white outline-none focus:border-[#10B981]/40 font-mono";
const labelCls: React.CSSProperties = {
  fontSize: 9,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.4)",
  fontWeight: 600,
  marginBottom: 3,
  display: "block",
};

// ── Shape A: IO test (Python / JS) ───────────────────────────────────────
function IoCard(p: CardCommon & { test: IoTestCase; onChange: (patch: Partial<IoTestCase>) => void }) {
  return (
    <CardChrome title="Тест" {...p}>
      <div className="space-y-2">
        <div>
          <label className="font-mono" style={labelCls}>Описание (видит студент)</label>
          <input value={p.test.description} onChange={(e) => p.onChange({ description: e.target.value })}
            className={inputCls} placeholder="Переменная message содержит правильный текст" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="font-mono" style={labelCls}>Что выполняется (выражение)</label>
            <input value={p.test.input} onChange={(e) => p.onChange({ input: e.target.value })}
              className={inputCls} placeholder="message" />
          </div>
          <div>
            <label className="font-mono" style={labelCls}>Ожидаемый результат</label>
            <input value={p.test.expected} onChange={(e) => p.onChange({ expected: e.target.value })}
              className={inputCls} placeholder="Привет, мир!" />
          </div>
        </div>
      </div>
    </CardChrome>
  );
}

// ── Shape C: Quiz question ───────────────────────────────────────────────
function QuizCard(p: CardCommon & { test: IoTestCase; onChange: (patch: Partial<IoTestCase>) => void }) {
  // description is "opt1|opt2|opt3", expected is the correct option
  const options = (p.test.description ?? "").split("|").map((o) => o.trim());

  function setOptions(next: string[]) {
    p.onChange({ description: next.join(" | ") });
  }

  function addOption() {
    setOptions([...options, ""]);
  }
  function updateOption(idx: number, val: string) {
    const next = [...options];
    next[idx] = val;
    setOptions(next);
  }
  function removeOption(idx: number) {
    const next = [...options];
    const removed = next.splice(idx, 1)[0];
    setOptions(next);
    if (p.test.expected === removed) p.onChange({ expected: "" });
  }
  function setCorrect(opt: string) {
    p.onChange({ expected: opt });
  }

  return (
    <CardChrome title="Вопрос" {...p}>
      <div className="space-y-2">
        <div>
          <label className="font-mono" style={labelCls}>Текст вопроса</label>
          <input value={p.test.input} onChange={(e) => p.onChange({ input: e.target.value })}
            className={inputCls} placeholder="Что отвечает за внешний вид?" />
        </div>
        <div>
          <label className="font-mono" style={labelCls}>Варианты ответа (★ = правильный)</label>
          <div className="space-y-1">
            {options.map((opt, idx) => {
              const isCorrect = p.test.expected.trim() === opt.trim() && opt.trim() !== "";
              return (
                <div key={idx} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCorrect(opt)}
                    title="Сделать правильным"
                    className="size-6 border-2 grid place-items-center font-mono text-[10px]"
                    style={{
                      borderColor: isCorrect ? "#10B981" : "rgba(255,255,255,0.15)",
                      background: isCorrect ? "rgba(16,185,129,0.15)" : "transparent",
                      color: isCorrect ? "#10B981" : "rgba(255,255,255,0.35)",
                    }}
                  >★</button>
                  <input value={opt} onChange={(e) => updateOption(idx, e.target.value)}
                    className={inputCls} placeholder={`Вариант ${idx + 1}`} />
                  <button type="button" onClick={() => removeOption(idx)} className="size-7 grid place-items-center text-white/30 hover:text-red-400">
                    <Trash2 size={13} />
                  </button>
                </div>
              );
            })}
            <button type="button" onClick={addOption}
              className="font-mono text-[10px] inline-flex items-center gap-1 px-2 py-1 border border-white/10 text-white/45 hover:text-white"
            ><Plus size={11} /> Добавить вариант</button>
          </div>
        </div>
      </div>
    </CardChrome>
  );
}

// ── Shape B: HTML/CSS assertion ──────────────────────────────────────────
const KIND_LABELS: Record<HtmlAssertion["kind"], string> = {
  exists: "Существование тега",
  count: "Количество тегов",
  text: "Точный текст",
  textContains: "Содержит текст",
  attr: "Атрибут",
  attrExists: "Атрибут существует",
  style: "CSS-свойство",
  styleContains: "CSS-свойство содержит",
};

function defaultForKind(kind: HtmlAssertion["kind"]): HtmlAssertion {
  switch (kind) {
    case "exists":        return { kind, selector: "", description: "" };
    case "count":         return { kind, selector: "", n: 1, description: "" };
    case "text":          return { kind, selector: "", equals: "", description: "" };
    case "textContains":  return { kind, selector: "", contains: "", description: "" };
    case "attr":          return { kind, selector: "", name: "", equals: "", description: "" };
    case "attrExists":    return { kind, selector: "", name: "", description: "" };
    case "style":         return { kind, selector: "", property: "", equals: "", description: "" };
    case "styleContains": return { kind, selector: "", property: "", contains: "", description: "" };
  }
}

function HtmlCard(p: CardCommon & { test: HtmlAssertion; onChange: (patch: Partial<HtmlAssertion>) => void }) {
  const [openKindMenu, setOpenKindMenu] = useState(false);
  const t = p.test;

  function changeKind(nextKind: HtmlAssertion["kind"]) {
    // Replace whole assertion preserving selector and description
    const seed = defaultForKind(nextKind) as Record<string, unknown>;
    seed.selector = t.selector;
    seed.description = t.description;
    p.onChange(seed as Partial<HtmlAssertion>);
    setOpenKindMenu(false);
  }

  return (
    <CardChrome title="Проверка" {...p}>
      <div className="space-y-2">
        {/* Kind dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenKindMenu(!openKindMenu)}
            className="w-full flex items-center justify-between h-8 px-2 bg-[#0B0B0C] border border-white/[0.08] text-xs text-white font-mono"
          >
            <span>{KIND_LABELS[t.kind]}</span>
            <ChevronDown size={14} />
          </button>
          {openKindMenu && (
            <div className="absolute z-10 mt-1 w-full bg-[#0B0B0C] border border-white/[0.08] shadow-lg max-h-72 overflow-y-auto">
              {(Object.keys(KIND_LABELS) as HtmlAssertion["kind"][]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => changeKind(k)}
                  className="w-full text-left px-3 py-1.5 text-xs text-white/70 hover:bg-white/[0.04] hover:text-white font-mono"
                >
                  <span className="text-white/30 mr-2">{k}</span>{KIND_LABELS[k]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Common: selector */}
        <div>
          <label className="font-mono" style={labelCls}>CSS-селектор</label>
          <input value={t.selector} onChange={(e) => p.onChange({ selector: e.target.value } as Partial<HtmlAssertion>)}
            className={inputCls} placeholder="h1, .button, #title" />
        </div>

        {/* Kind-specific */}
        {t.kind === "count" && (
          <div>
            <label className="font-mono" style={labelCls}>Количество</label>
            <input type="number" value={t.n} onChange={(e) => p.onChange({ n: parseInt(e.target.value) || 0 } as Partial<HtmlAssertion>)}
              className={inputCls} />
          </div>
        )}
        {t.kind === "text" && (
          <div>
            <label className="font-mono" style={labelCls}>Точный текст</label>
            <input value={t.equals} onChange={(e) => p.onChange({ equals: e.target.value } as Partial<HtmlAssertion>)}
              className={inputCls} placeholder="Привет" />
          </div>
        )}
        {t.kind === "textContains" && (
          <div>
            <label className="font-mono" style={labelCls}>Должен содержать</label>
            <input value={t.contains} onChange={(e) => p.onChange({ contains: e.target.value } as Partial<HtmlAssertion>)}
              className={inputCls} placeholder="фрагмент текста" />
          </div>
        )}
        {(t.kind === "attr" || t.kind === "attrExists") && (
          <div>
            <label className="font-mono" style={labelCls}>Имя атрибута</label>
            <input value={t.name} onChange={(e) => p.onChange({ name: e.target.value } as Partial<HtmlAssertion>)}
              className={inputCls} placeholder="href, src, alt" />
          </div>
        )}
        {t.kind === "attr" && (
          <div>
            <label className="font-mono" style={labelCls}>Значение атрибута</label>
            <input value={t.equals} onChange={(e) => p.onChange({ equals: e.target.value } as Partial<HtmlAssertion>)}
              className={inputCls} placeholder="https://..." />
          </div>
        )}
        {(t.kind === "style" || t.kind === "styleContains") && (
          <div>
            <label className="font-mono" style={labelCls}>CSS-свойство</label>
            <input value={t.property} onChange={(e) => p.onChange({ property: e.target.value } as Partial<HtmlAssertion>)}
              className={inputCls} placeholder="color, font-size, padding" />
          </div>
        )}
        {t.kind === "style" && (
          <div>
            <label className="font-mono" style={labelCls}>Значение свойства</label>
            <input value={t.equals} onChange={(e) => p.onChange({ equals: e.target.value } as Partial<HtmlAssertion>)}
              className={inputCls} placeholder="red, 16px, 1.5rem" />
          </div>
        )}
        {t.kind === "styleContains" && (
          <div>
            <label className="font-mono" style={labelCls}>Должно содержать</label>
            <input value={t.contains} onChange={(e) => p.onChange({ contains: e.target.value } as Partial<HtmlAssertion>)}
              className={inputCls} placeholder="Helvetica" />
          </div>
        )}

        <div>
          <label className="font-mono" style={labelCls}>Описание (видит студент)</label>
          <input value={t.description} onChange={(e) => p.onChange({ description: e.target.value } as Partial<HtmlAssertion>)}
            className={inputCls} placeholder="Заголовок h1 содержит «Привет»" />
        </div>
      </div>
    </CardChrome>
  );
}
