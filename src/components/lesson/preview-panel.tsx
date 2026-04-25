"use client";

import { useEffect, useRef } from "react";

interface PreviewPanelProps {
  code: string;
  debounceMs?: number;
}

/**
 * Debounced live preview for HTML lessons. Renders the user's code into a
 * sandboxed iframe (no allow-scripts → no JS execution).
 */
export function PreviewPanel({ code, debounceMs = 300 }: PreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const timer = setTimeout(() => {
      iframe.srcdoc = code;
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [code, debounceMs]);

  return (
    <div
      className="h-full flex flex-col"
      style={{
        background: "#0E0E10",
        borderTop: "2px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Header */}
      <div
        className="font-mono shrink-0"
        style={{
          padding: "10px 18px",
          borderBottom: "2px solid rgba(255,255,255,0.07)",
          fontSize: 11,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.45)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span>§ Предпросмотр</span>
        <span style={{ width: 6, height: 6, background: "#10B981", display: "inline-block" }} />
      </div>

      {/* Iframe */}
      <div className="flex-1 min-h-0" style={{ background: "#fff" }}>
        <iframe
          ref={iframeRef}
          sandbox="allow-same-origin"
          style={{ width: "100%", height: "100%", border: 0, display: "block" }}
          title="Предпросмотр"
        />
      </div>
    </div>
  );
}
