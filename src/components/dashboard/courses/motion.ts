// Motion foundation for /dashboard?section=courses page.
// One source of truth for easing & duration. Edit here and all animations
// on the courses page retune together.

export const EASE = [0.22, 0.61, 0.36, 1] as const; // easeOutCubic-like, no overshoot

export const DUR = {
  fast:   0.18,  // hover, focus, active indicator slide
  normal: 0.28,  // mount, panel swap
  slow:   0.42,  // count-up + progress bar fill
} as const;

export const variants = {
  fadeUp:     { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } },
  fadeIn:     { hidden: { opacity: 0 },         show: { opacity: 1 } },
  slideRight: { hidden: { opacity: 0, x: -8 },  show: { opacity: 1, x: 0 } },
};

// When prefers-reduced-motion is set, replace any of the above with this
// (visible & in place; transform/opacity changes off).
export const variantsStill = {
  hidden: { opacity: 1 },
  show:   { opacity: 1 },
};

export const stagger = {
  page: { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } },
  list: { hidden: {}, show: { transition: { staggerChildren: 0.04 } } },
};

export const tx = (dur: number = DUR.normal, delay = 0) =>
  ({ duration: dur, ease: EASE, ...(delay ? { delay } : {}) });
