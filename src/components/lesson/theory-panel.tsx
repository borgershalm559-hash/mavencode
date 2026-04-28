"use client";

import { TheoryMarkdown } from "./theory-markdown";

interface TheoryPanelProps {
  content: string;
}

export function TheoryPanel({ content }: TheoryPanelProps) {
  return (
    <div style={{ padding: "32px 40px 40px" }}>
      <div
        className="font-mono"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 22,
          fontSize: 11,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.45)",
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
        § Теория
      </div>
      <TheoryMarkdown content={content} />
    </div>
  );
}
