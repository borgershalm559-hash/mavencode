"use client";

interface Props {
  hints: string[];
  onChange: (next: string[]) => void;
}

const HINT_LABELS = [
  { title: "Подсказка 1 — мягкий намёк", subtitle: "Без решения. Направление мысли.", penalty: "−5% XP" },
  { title: "Подсказка 2 — конкретная", subtitle: "Часть решения, имена переменных.", penalty: "−25% XP" },
  { title: "Подсказка 3 — полное решение", subtitle: "Готовый код с пояснениями.", penalty: "−50% XP" },
];

export function HintsBlock({ hints, onChange }: Props) {
  const safe = [hints[0] ?? "", hints[1] ?? "", hints[2] ?? ""];

  function update(idx: number, val: string) {
    const next = [...safe];
    next[idx] = val;
    onChange(next);
  }

  return (
    <div className="border-2 border-white/[0.07] bg-[#0F1011] p-4 space-y-4">
      <div>
        <div
          className="font-mono"
          style={{ fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", fontWeight: 700 }}
        >
          § Подсказки
        </div>
        <div className="font-mono text-[10px] text-white/30 mt-0.5">
          Все три обязательны для публикации. Markdown поддерживается.
        </div>
      </div>

      {HINT_LABELS.map((meta, i) => (
        <div key={i} className="space-y-1.5">
          <div className="flex items-baseline justify-between">
            <span
              className="font-mono"
              style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", fontWeight: 600 }}
            >
              {meta.title}
            </span>
            <span className="font-mono text-[9px] text-[#10B981]/70">{meta.penalty}</span>
          </div>
          <div className="font-mono text-[10px] text-white/30">{meta.subtitle}</div>
          <textarea
            value={safe[i]}
            onChange={(e) => update(i, e.target.value)}
            placeholder={i === 0 ? "Какая функция выводит текст?" :
                         i === 1 ? "Используй print(...) и переменную message" :
                         "```python\nmessage = \"Привет\"\nprint(message)\n```"}
            className="w-full bg-[#0B0B0C] border border-white/[0.08] text-white text-sm px-3 py-2 outline-none focus:border-[#10B981]/40 font-mono leading-relaxed resize-y"
            style={{ minHeight: 80 }}
          />
        </div>
      ))}
    </div>
  );
}
