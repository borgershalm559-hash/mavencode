"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2, X } from "lucide-react";

interface PreviewPanelProps {
  code: string;
  debounceMs?: number;
}

/**
 * Debounced live preview for HTML lessons. Renders the user's code into a
 * sandboxed iframe (no allow-scripts → no JS execution). Includes a
 * fullscreen toggle that overlays the entire viewport.
 */
export function PreviewPanel({ code, debounceMs = 300 }: PreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const fullscreenIframeRef = useRef<HTMLIFrameElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Push code into both iframes (regular and fullscreen) — debounced.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (iframeRef.current) iframeRef.current.srcdoc = code;
      if (fullscreenIframeRef.current) fullscreenIframeRef.current.srcdoc = code;
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [code, debounceMs]);

  const close = useCallback(() => setIsFullscreen(false), []);
  const open = useCallback(() => setIsFullscreen(true), []);

  // Esc closes fullscreen mode.
  useEffect(() => {
    if (!isFullscreen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isFullscreen, close]);

  return (
    <>
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
            padding: "8px 14px 8px 18px",
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
          <div style={{ flex: 1 }} />
          <button
            type="button"
            onClick={open}
            title="Открыть на весь экран"
            className="font-mono"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 10px",
              border: "2px solid transparent",
              background: "transparent",
              color: "rgba(255,255,255,0.55)",
              fontSize: 10,
              letterSpacing: "0.18em",
              cursor: "pointer",
            }}
          >
            <Maximize2 size={11} />
            Развернуть
          </button>
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

      {/* Fullscreen overlay */}
      {isFullscreen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 80,
            background: "#0A0A0B",
            display: "grid",
            gridTemplateRows: "auto 1fr",
          }}
        >
          <div
            className="font-mono"
            style={{
              padding: "10px 18px",
              borderBottom: "2px solid rgba(255,255,255,0.1)",
              fontSize: 11,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.55)",
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "#0E0E10",
            }}
          >
            <span>§ Предпросмотр — полный экран</span>
            <span style={{ width: 6, height: 6, background: "#10B981", display: "inline-block" }} />
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>Esc — закрыть</span>
            <button
              type="button"
              onClick={close}
              title="Закрыть"
              className="font-mono"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                border: "2px solid rgba(255,255,255,0.1)",
                background: "transparent",
                color: "rgba(255,255,255,0.7)",
                fontSize: 10,
                letterSpacing: "0.18em",
                cursor: "pointer",
              }}
            >
              <X size={11} />
              Свернуть
              <Minimize2 size={11} />
            </button>
          </div>
          <div style={{ background: "#fff", minHeight: 0 }}>
            <iframe
              ref={fullscreenIframeRef}
              sandbox="allow-same-origin"
              style={{ width: "100%", height: "100%", border: 0, display: "block" }}
              title="Предпросмотр (полный экран)"
            />
          </div>
        </div>
      )}
    </>
  );
}
