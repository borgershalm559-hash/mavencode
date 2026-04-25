# Courses Page Animations — Design Spec

**Date:** 2026-04-25
**Surface:** `/dashboard` → secton `courses`
**Files affected:** `src/components/dashboard/courses-section.tsx`, `src/components/dashboard/course-spread.tsx` (and helpers as listed below)

## 1. Goal

Add motion to the courses page that matches the V1 Dossier visual language already used elsewhere on the site (Fraunces serif titles, monospace overlines, brutal `4px 4px` drop shadows, dark `#0A0A0B` surfaces, accent `#10B981`).

The motion must feel like a serious "document being filed" — sober, technical, easeOut, without spring overshoot. No bounce, no playful timings.

## 2. Scope

In scope (7 surfaces):

1. Page mount sequence (header + 3 columns appear in cascade)
2. Track switching (`trackId` change → station list & spread swap)
3. Hover & active state on tracks rail and station rows
4. Hover, active and tap on Course Spread buttons (brutal shadow play)
5. Count-up on the 3 stat numbers in the header
6. Progress bars filling from 0 to current value
7. `prefers-reduced-motion` honoring

Out of scope:

- Loading skeleton — already has `animate-pulse`, untouched
- Sidebar — has its own animation already
- Other dashboard sections (news/library/profile)

## 3. Foundation — `motion.ts`

New file: `src/components/dashboard/courses/motion.ts`.

```ts
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

export const stagger = {
  page: { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } },
  list: { hidden: {}, show: { transition: { staggerChildren: 0.04 } } },
};

export const tx = (dur: number = DUR.normal, delay = 0) =>
  ({ duration: dur, ease: EASE, ...(delay ? { delay } : {}) });
```

Single source of truth. Editing `DUR.normal` retunes the whole page.

## 4. Page mount cascade

Top-level `motion.div` on `<CoursesSection>` root, `variants={stagger.page}`, `initial="hidden"`, `animate="show"`.

Children (in DOM order, each gets `variants={…}` + `transition={tx()}`):

1. **Header block** — `fadeUp`
2. **Tracks rail Card** — `slideRight`
3. **Track stations Card** — `fadeUp`
4. **Course Spread wrapper** — `fadeUp`, `transition={tx(DUR.normal, 0.15)}`

Inside the tracks rail Card: a nested `motion.div variants={stagger.list}`, each `<TrackRailItem>` wrapped in `motion.div variants={variants.fadeUp}` with `transition={tx(DUR.fast)}`.

Inside the stations Card: same pattern for `<StationRow>`.

This runs **once on mount**. To prevent re-trigger on HMR or remount, use a `useRef(false)` guard (`hasMountedRef`) and short-circuit to `animate={hasMounted ? false : "show"}`.

## 5. Track switching

When `trackId` changes:

- **Track header** (`px-5 py-4 border-b-2`): wrap in `<AnimatePresence mode="wait">` with `key={trackId}`, child variants `fadeIn`, transition `tx(DUR.fast)`. Title/progress/counts cross-fade.
- **Station list** (`<div className="px-4 py-2 max-h-[700px] overflow-auto">`): same `<AnimatePresence mode="wait">`, `key={trackId}`. Child is the `motion.div variants={stagger.list}` — stations re-stagger in.
- **Course Spread** (right column): independent `<AnimatePresence mode="wait">` with `key={effectiveSelected}`, child `fadeUp`, `tx(DUR.normal)`.

`mode="wait"` so old content fully exits before new enters → no overlap flash.

## 6. Hover / Active

### TrackRailItem

- `whileHover={{ x: 2 }}`, `transition={tx(DUR.fast)}`.
- Border color tween: when not selected, hovering tweens border-color from `rgba(255,255,255,0.08)` → `track.color + "40"` over 180ms (use `motion.div` with `animate` driven by hover state via `useState` + `onHoverStart/End`, or simpler: `whileHover={{ borderColor: ... }}`).
- Active vertical line on the left (`border-l-2`) → replaced by a sibling `motion.div` with `layoutId="track-active"`. When `selected` flips to a new item, framer-motion physically slides the green bar between items.

### StationRow

- `whileHover`: `boxShadow: "4px 4px 0 0 rgba(255,255,255,0.12)"` (currently `0.04`), `backgroundColor: "rgba(255,255,255,0.04)"`.
- Station number (`01 02 03…`) opacity transitions from `0.3` → `0.6` on hover via plain CSS `transition: opacity 180ms`.

### Course Spread "Начать урок" / lesson row buttons (already brutal-styled)

- `whileHover={{ x: -2, y: -2, boxShadow: "6px 6px 0 0 rgba(16,185,129,0.55)" }}` — brutal shadow grows, button "lifts".
- `whileTap={{ x: 0, y: 0, boxShadow: "1px 1px 0 0 rgba(16,185,129,0.55)" }}` — pressed.
- All `tx(DUR.fast)`.

## 7. Count-up

New hook: `src/components/dashboard/courses/use-count-up.ts`.

```ts
export function useCountUp(target: number, duration = DUR.slow): number {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const from = v; // continue from current value if target changes mid-animation
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setV(Math.round(from + (target - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return v;
}
```

Applied to the 3 stat numbers in the header (`TRACKS.length - 1`, `courses.length`, `courses.filter(...progress === 100).length`).

Numbers stay wrapped in `tabular-nums` (already present) so width does not jitter.

## 8. Progress bars

Two places: `<TrackRailItem>` (small bar inside) and `<CourseSpread>` (likely a larger bar).

For each bar: replace the static `<div style={{ width: '${pct}%' }}>` with:

```tsx
<motion.div
  initial={{ width: 0 }}
  animate={{ width: `${pct}%` }}
  transition={tx(DUR.slow)}
  style={{ background: '#10B981' }}
  className="h-full"
/>
```

The percentage label above the bar uses `useCountUp(pct)`.

## 9. Reduced motion

Top of `courses-section.tsx`:

```ts
const reduced = useReducedMotion();
```

When `reduced === true`:

- Replace all `variants` with `{ hidden: { opacity: 1 }, show: { opacity: 1 } }` (single helper at top).
- `useCountUp` short-circuits and returns `target` immediately.
- Progress bars render with final width, no animation (use `initial={false}` when reduced).
- Hover effects on color/border are kept (these are not motion). Hover translate / shadow grow disabled.

## 10. Testing

- Manual smoke: cold load page, confirm cascade plays once. Switch tracks 5×, confirm no jank, no double-stagger. Toggle reduced-motion in OS, reload, confirm everything renders instantly with full opacity.
- No automated motion tests (DOM-level testing of animations is brittle and high-cost). Component logic is unchanged, existing unit/render tests stay green.

## 11. File map

| File | Change |
|------|--------|
| `src/components/dashboard/courses/motion.ts` | NEW — variants, EASE, DUR |
| `src/components/dashboard/courses/use-count-up.ts` | NEW — hook |
| `src/components/dashboard/courses-section.tsx` | EDIT — wrap with motion containers, swap track/list with AnimatePresence, count-up on stats. Note: `CourseSpread` lives inside this same file (function declared at line 281), so all spread-related edits land here too. |

No new dependencies — `framer-motion` already in `package.json`.
