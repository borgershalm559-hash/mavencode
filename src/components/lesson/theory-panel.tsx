"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface TheoryPanelProps {
  content: string;
}

export function TheoryPanel({ content }: TheoryPanelProps) {
  return (
    <div className="h-full overflow-y-auto p-6 bg-surface custom-scrollbar">
      <article className="prose-lesson">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="font-mono text-lg font-bold uppercase tracking-[0.2em] text-white mb-4 mt-0">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="font-mono text-base font-bold uppercase tracking-[0.15em] text-white/80 mb-3 mt-6">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="font-mono text-sm font-bold uppercase tracking-[0.1em] text-white/70 mb-2 mt-4">{children}</h3>
            ),
            p: ({ children }) => (
              <p className="text-white/65 text-sm leading-relaxed mb-3">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="text-white/65 text-sm space-y-1 mb-3 ml-4 list-none">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="text-white/65 text-sm space-y-1 mb-3 ml-4 list-decimal">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="text-white/65 text-sm leading-relaxed flex items-start gap-2">
                <span className="mt-[9px] w-1 h-1 bg-[#10B981]/70 shrink-0" />
                <span>{children}</span>
              </li>
            ),
            code: ({ className, children }) => {
              const isBlock = className?.includes("language-");
              if (isBlock) {
                return (
                  <div className="my-3 overflow-hidden border-2 border-white/[0.05]">
                    <div className="bg-white/[0.04] px-3 py-1.5 border-b border-white/[0.07]">
                      <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">
                        {className?.replace("language-", "")}
                      </span>
                    </div>
                    <pre className="p-4 overflow-x-auto bg-[#1A1A1F]">
                      <code className="text-sm text-amber-300/90 font-mono">{children}</code>
                    </pre>
                  </div>
                );
              }
              return (
                <code className="text-[#10B981] bg-[#10B981]/[0.08] px-1.5 py-0.5 text-xs font-mono border border-[#10B981]/15">
                  {children}
                </code>
              );
            },
            pre: ({ children }) => <>{children}</>,
            blockquote: ({ children }) => (
              <blockquote className="border-l-2 border-[#10B981]/50 pl-4 my-3 text-white/50 italic">
                {children}
              </blockquote>
            ),
            strong: ({ children }) => (
              <strong className="text-white/85 font-semibold">{children}</strong>
            ),
            hr: () => <hr className="border-white/[0.07] my-6" />,
            table: ({ children }) => (
              <div className="overflow-x-auto my-3">
                <table className="w-full text-sm text-white/60 border-2 border-white/[0.05] overflow-hidden">
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (
              <th className="bg-white/[0.04] px-3 py-2 text-left text-white/70 font-mono font-medium text-xs border-b border-white/[0.07]">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-3 py-2 border-b border-white/[0.04] text-xs">{children}</td>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
    </div>
  );
}
