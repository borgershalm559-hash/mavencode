"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface TheoryPanelProps {
  content: string;
}

export function TheoryPanel({ content }: TheoryPanelProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Panel label */}
      <div className="px-5 py-2.5 border-b border-white/[0.06] shrink-0">
        <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/25">
          § Теория
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 custom-scrollbar">
        <article>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1
                  className="text-[38px] font-light leading-[1.1] text-white/85 mb-5 mt-0"
                  style={{ fontFamily: "var(--font-fraunces)", fontWeight: 300 }}
                >
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white/55 mb-3 mt-7 flex items-center gap-2">
                  <span className="text-[#10B981]/50">§</span>
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-white/40 mb-2 mt-5">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-white/60 text-sm leading-relaxed mb-3">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="text-white/60 text-sm space-y-1.5 mb-3 ml-4 list-none">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="text-white/60 text-sm space-y-1.5 mb-3 ml-4 list-decimal">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-white/60 text-sm leading-relaxed flex items-start gap-2">
                  <span className="mt-[9px] w-1 h-1 bg-[#10B981]/60 shrink-0" />
                  <span>{children}</span>
                </li>
              ),
              code: ({ className, children }) => {
                const isBlock = className?.includes("language-");
                if (isBlock) {
                  return (
                    <div className="my-4 overflow-hidden border border-white/[0.07]">
                      <div className="bg-white/[0.03] px-3 py-1.5 border-b border-white/[0.06]">
                        <span className="font-mono text-[9px] text-white/25 uppercase tracking-[0.3em]">
                          {className?.replace("language-", "")}
                        </span>
                      </div>
                      <pre className="p-4 overflow-x-auto bg-[#111113]">
                        <code className="text-sm text-amber-300/85 font-mono">
                          {children}
                        </code>
                      </pre>
                    </div>
                  );
                }
                return (
                  <code className="text-[#10B981] bg-[#10B981]/[0.07] px-1.5 py-0.5 text-xs font-mono border border-[#10B981]/10">
                    {children}
                  </code>
                );
              },
              pre: ({ children }) => <>{children}</>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-[#10B981]/40 pl-4 my-3 text-white/45 italic text-sm">
                  {children}
                </blockquote>
              ),
              strong: ({ children }) => (
                <strong className="text-white/80 font-semibold">{children}</strong>
              ),
              hr: () => <hr className="border-white/[0.06] my-6" />,
              table: ({ children }) => (
                <div className="overflow-x-auto my-4">
                  <table className="w-full text-sm text-white/55 border border-white/[0.07] overflow-hidden">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="bg-white/[0.03] px-3 py-2 text-left text-white/60 font-mono font-medium text-[10px] border-b border-white/[0.06] uppercase tracking-[0.1em]">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-3 py-2 border-b border-white/[0.04] text-xs">
                  {children}
                </td>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
