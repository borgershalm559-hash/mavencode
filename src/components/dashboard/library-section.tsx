import { ArrowLeft } from "lucide-react";
import { LibrarySkeleton } from "./loading-skeleton";
import type { LibraryItem } from "@/types/dashboard";

interface LibrarySectionProps {
  library: LibraryItem[] | undefined;
  loading: boolean;
  selectedLibrary: LibraryItem | null;
  onSelectLibrary: (item: LibraryItem) => void;
  onBack: () => void;
}

export function LibrarySection({ library, loading, selectedLibrary, onSelectLibrary, onBack }: LibrarySectionProps) {
  if (selectedLibrary) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="size-9 flex items-center justify-center border-2 border-white/[0.07] text-white/40 hover:border-white/[0.15] hover:text-white/70 transition-all"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div>
            <h2 className="font-mono text-base font-bold uppercase tracking-[0.3em] text-white">
              {selectedLibrary.title}
            </h2>
            <div className="font-mono text-white/30 text-xs uppercase tracking-[0.2em] mt-0.5">
              Ресурс библиотеки
            </div>
          </div>
        </div>

        <div className="bg-surface border-2 border-[#10B981]/20" style={{ boxShadow: "4px 4px 0 0 rgba(16,185,129,0.55)" }}>
          <div className="px-5 pt-4 pb-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.15em] px-2 py-1 bg-[#10B981]/15 text-[#10B981] border-2 border-[#10B981]/30">
                {selectedLibrary.kind}
              </span>
              <div className="font-mono text-white/40 text-xs uppercase tracking-[0.2em]">{selectedLibrary.size}</div>
            </div>
            <div className="font-mono text-base font-bold uppercase tracking-[0.2em] mt-3 text-white">{selectedLibrary.title}</div>
          </div>
          <div className="px-5 pb-5 text-white/70 text-sm leading-relaxed space-y-4">
            <p>{selectedLibrary.body}</p>
            <div className="flex gap-3">
              <button
                className="h-10 px-5 bg-[#10B981] text-black border-2 border-black text-xs font-mono uppercase tracking-[0.2em] font-bold transition-all"
                style={{ boxShadow: "3px 3px 0 0 rgba(16,185,129,0.8)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translate(2px,2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "1px 1px 0 0 rgba(16,185,129,0.8)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = ""; (e.currentTarget as HTMLButtonElement).style.boxShadow = "3px 3px 0 0 rgba(16,185,129,0.8)"; }}
              >
                Открыть
              </button>
              <button className="h-10 px-5 bg-surface text-white border-2 border-white/[0.15] text-xs font-mono uppercase tracking-[0.2em] hover:bg-white/[0.04] transition-all">
                Скачать
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !library) return <LibrarySkeleton />;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {["Все", "PDF", "Видео", "Шпаргалки", "Проекты"].map((label, i) => (
          <button
            key={label}
            className={`h-8 px-3 border-2 text-xs font-mono uppercase tracking-[0.15em] transition-all duration-200 ${
              i === 0
                ? "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/40"
                : "bg-surface text-white/50 border-white/[0.07] hover:border-white/[0.15] hover:text-white/70"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {library.map((r) => (
          <div
            key={r.id}
            onClick={() => onSelectLibrary(r)}
            className="bg-surface border-2 border-[#10B981]/20 cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
            style={{ boxShadow: "4px 4px 0 0 rgba(16,185,129,0.55)" }}
          >
            <div className="px-5 pt-4 pb-2">
              <div className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-white">
                {r.title}
              </div>
              <div className="font-mono text-white/40 text-xs uppercase tracking-[0.15em] mt-1">
                {r.kind}
              </div>
            </div>
            <div className="px-5 pb-4 space-y-3">
              <div className="text-white/70 text-sm leading-relaxed">
                {r.body}
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase tracking-[0.1em] px-2 py-0.5 bg-white/[0.06] border border-white/[0.07] text-white/50">
                  {r.kind}
                </span>
                <div className="font-mono text-white/30 text-xs uppercase tracking-[0.15em]">{r.size}</div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onSelectLibrary(r); }}
                className="w-full h-8 bg-[#10B981] text-black border-2 border-black text-xs font-mono font-bold uppercase tracking-[0.2em] hover:bg-[#047857] transition-colors"
              >
                Открыть
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
