"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { DUR } from "./motion";

/**
 * Animate a number from its previous value to `target` using easeOutCubic.
 * Honors `prefers-reduced-motion`: returns the target instantly.
 */
export function useCountUp(target: number, duration: number = DUR.slow): number {
  const reduced = useReducedMotion();
  const [value, setValue] = useState<number>(reduced ? target : 0);
  const fromRef = useRef<number>(reduced ? target : 0);

  useEffect(() => {
    if (reduced) {
      setValue(target);
      fromRef.current = target;
      return;
    }

    const start = performance.now();
    const from = fromRef.current;
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const v = Math.round(from + (target - from) * eased);
      setValue(v);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, reduced]);

  return value;
}
