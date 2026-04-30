"use client";

import { useCallback, useEffect, useRef } from "react";

interface SplitterProps {
  /** Direction of resize: "vertical" = resize height (handle is horizontal bar); "horizontal" = resize width (handle is vertical bar). */
  direction: "vertical" | "horizontal";
  /** Called on every drag with the delta in pixels. Direction-aware:
   *   - vertical: positive delta = drag down (preview shrinks if it's below).
   *   - horizontal: positive delta = drag right.
   */
  onDelta: (deltaPx: number) => void;
  /** Called when drag ends (so caller can persist the new size). */
  onEnd?: () => void;
}

/**
 * Thin draggable bar used to resize adjacent panels. Hides itself if no
 * pointer events are available (e.g. SSR — but the file is a client comp).
 */
export function Splitter({ direction, onDelta, onEnd }: SplitterProps) {
  const dragStateRef = useRef<{ start: number } | null>(null);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragStateRef.current = {
      start: direction === "vertical" ? e.clientY : e.clientX,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [direction]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragStateRef.current;
    if (!drag) return;
    const cur = direction === "vertical" ? e.clientY : e.clientX;
    const delta = cur - drag.start;
    if (delta !== 0) {
      drag.start = cur;
      onDelta(delta);
    }
  }, [direction, onDelta]);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current) return;
    dragStateRef.current = null;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    onEnd?.();
  }, [onEnd]);

  // Inject a one-time global cursor change while dragging so the cursor
  // doesn't snap back to default when the pointer briefly leaves the handle.
  useEffect(() => {
    const cls = direction === "vertical" ? "row-resize-active" : "col-resize-active";
    return () => {
      document.body.classList.remove(cls);
    };
  }, [direction]);

  const isVertical = direction === "vertical";
  return (
    <div
      role="separator"
      aria-orientation={isVertical ? "horizontal" : "vertical"}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        cursor: isVertical ? "row-resize" : "col-resize",
        background: "rgba(255,255,255,0.07)",
        flexShrink: 0,
        position: "relative",
        width: isVertical ? "100%" : 6,
        height: isVertical ? 6 : "100%",
        transition: "background 120ms",
      }}
      className="hover:bg-[rgba(16,185,129,0.4)]"
    />
  );
}
