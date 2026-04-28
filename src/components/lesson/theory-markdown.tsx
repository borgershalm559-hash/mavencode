"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

/**
 * Shared markdown component map used by both:
 *  - Student-facing theory panel (theory-panel.tsx)
 *  - Admin lesson editor live preview
 *
 * Keep both surfaces visually identical by importing this map.
 */
export const theoryMarkdownComponents: Components = {
  h1: ({ children }) => (
    <h1
      style={{
        fontFamily: "var(--font-fraunces), Georgia, serif",
        fontWeight: 300,
        fontSize: 38,
        lineHeight: 1.05,
        letterSpacing: "-0.02em",
        margin: "0 0 18px",
        color: "#fff",
      }}
    >
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2
      className="font-mono"
      style={{
        fontSize: 11,
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        color: "#10B981",
        margin: "28px 0 12px",
      }}
    >
      § {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3
      style={{
        fontFamily: "var(--font-fraunces), Georgia, serif",
        fontWeight: 400,
        fontSize: 22,
        margin: "20px 0 10px",
        color: "#fff",
      }}
    >
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p
      style={
        {
          margin: "0 0 14px",
          fontSize: 15.5,
          lineHeight: 1.65,
          color: "rgba(255,255,255,0.78)",
          textWrap: "pretty",
        } as React.CSSProperties
      }
    >
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul style={{ margin: "0 0 16px", padding: 0, listStyle: "none", display: "grid", gap: 6 }}>
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol
      style={{
        margin: "0 0 16px 18px",
        padding: 0,
        listStyle: "decimal",
        display: "grid",
        gap: 6,
        color: "rgba(255,255,255,0.78)",
        fontSize: 15.5,
        lineHeight: 1.65,
      }}
    >
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li style={{ display: "flex", gap: 12, fontSize: 15, lineHeight: 1.6, color: "rgba(255,255,255,0.78)" }}>
      <span style={{ marginTop: 9, width: 6, height: 6, background: "#10B981", flexShrink: 0 }} />
      <span>{children}</span>
    </li>
  ),
  code: ({ className, children }) => {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      return (
        <div style={{ margin: "16px 0 18px" }}>
          <div
            className="font-mono"
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "6px 12px",
              background: "rgba(255,255,255,0.025)",
              border: "1.5px solid rgba(255,255,255,0.06)",
              borderBottom: "none",
              fontSize: 10,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            <span>{className?.replace("language-", "")}</span>
          </div>
          <pre
            className="custom-scrollbar"
            style={{
              margin: 0,
              padding: 14,
              background: "#0E0E10",
              border: "1.5px solid rgba(255,255,255,0.06)",
              overflow: "auto",
            }}
          >
            <code className="font-mono" style={{ fontSize: 13, color: "rgba(251,191,36,0.85)" }}>
              {children}
            </code>
          </pre>
        </div>
      );
    }
    return (
      <code
        className="font-mono"
        style={{
          color: "#10B981",
          background: "rgba(16,185,129,0.08)",
          padding: "1px 6px",
          fontSize: "0.9em",
          border: "1px solid rgba(16,185,129,0.15)",
        }}
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => <>{children}</>,
  blockquote: ({ children }) => (
    <blockquote
      style={{
        margin: "16px 0",
        padding: "14px 18px",
        borderLeft: "3px solid #10B981",
        background: "rgba(16,185,129,0.09)",
        fontSize: 15,
        lineHeight: 1.6,
        color: "rgba(255,255,255,0.8)",
        fontStyle: "italic",
      }}
    >
      {children}
    </blockquote>
  ),
  strong: ({ children }) => (
    <strong style={{ color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>{children}</strong>
  ),
  hr: () => <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.07)", margin: "24px 0" }} />,
  table: ({ children }) => (
    <div style={{ overflowX: "auto", margin: "16px 0" }}>
      <table style={{ width: "100%", fontSize: 14, color: "rgba(255,255,255,0.6)", border: "1.5px solid rgba(255,255,255,0.07)" }}>
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th
      className="font-mono"
      style={{
        background: "rgba(255,255,255,0.03)",
        padding: "8px 12px",
        textAlign: "left",
        color: "rgba(255,255,255,0.7)",
        fontWeight: 500,
        fontSize: 10,
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td style={{ padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 13 }}>
      {children}
    </td>
  ),
};

export function TheoryMarkdown({ content }: { content: string }) {
  return (
    <article>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={theoryMarkdownComponents}>
        {content}
      </ReactMarkdown>
    </article>
  );
}
