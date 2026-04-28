# Admin — Lesson Editor (block 1 of full admin panel)

**Date:** 2026-04-26
**Surface:** `/admin/courses/[id]/lessons/[lessonId]` — new full-screen editor for individual lessons; companion edits to `/admin/courses/[id]` for drag-drop reordering.
**Status:** spec ready, awaiting user review.

## 0. Goal

Today the admin panel can create a lesson with a `title` and nothing else. Everything that makes a lesson actually work — `content` (markdown body), `starterCode`, `solution`, `tests`, `hints`, `type`, `language`, `xpReward` — is hand-written in `prisma/content/<course>/lessons/*.ts` and seeded.

This spec adds a real lesson editor. After it ships, an admin can author every existing lesson type (code / fix-bug / quiz / fill-blanks across python / html / javascript / typescript) entirely through the UI.

This is **block 1 of 6** in the broader full-admin-panel roadmap (lesson editor → course editor → news → library → users → analytics). Each block is its own spec/implementation cycle.

## 1. Architecture

### 1.1 Routing

```
/admin/courses/[id]                              ← existing — course editor + lesson list
/admin/courses/[id]/lessons/[lessonId]           ← NEW — full-screen lesson editor
```

Clicking a lesson row in the course page navigates to the new editor. A back link returns to the course.

### 1.2 Page layout (1440px reference)

Top to bottom, vertical scroll, no tabs:

1. **Sticky header bar** — back link, three actions (`Save draft` / `Publish` / `Delete`), publish status pill.
2. **Metadata strip** — title / type radio / language select / xpReward / order / `isAvailable` toggle.
3. **Theory editor + live preview** — left textarea with toolbar, right rendered preview.
4. **Code pair** — starter (left) and solution (right) Monaco editors. Hidden for quiz lessons.
5. **Test builder** — list of test cards, shape switches by `type` and `language`.
6. **Hints block** — three textareas (soft / concrete / full).
7. **Danger zone** — delete-lesson button at the very bottom.

A single long page beats tabs for content authoring: scrolling beats clicking when iterating.

### 1.3 New schema field

```prisma
model Lesson {
  ...
  isPublished Boolean @default(true)
  ...
}
```

`@default(true)` so every existing lesson stays visible after `prisma db push`. Students see only `isPublished: true`. Admin sees everything. Existing computed `isAvailable` (lesson-unlocked-by-prerequisites logic) is unchanged.

## 2. Metadata strip

Single row of inputs in a panel under the sticky header.

| Field | Control | Notes |
|-------|---------|-------|
| `title` | text input | required, ≥ 3 chars before publish |
| `type` | radio: `code` / `quiz` / `fix-bug` / `fill-blanks` | switching this changes which sections render below |
| `language` | select: `python` / `html` / `javascript` / `typescript` | switching changes Monaco mode and test-builder shape |
| `xpReward` | number 0–500 | |
| `order` | number, read-only here | actual reordering happens via drag-drop on course page (§6) |
| `isAvailable` | checkbox | as today, unrelated to publish state |

The metadata strip stays visible while scrolling because the sticky header sits above it.

## 3. Markdown editor for `content`

Two-column layout: left = textarea + toolbar, right = live preview.

### 3.1 Toolbar

A single row above the textarea:

```
[B] [I] [`code`] │ [H1] [H2] [H3] │ [• list] [1. list] │ [link] [image] │ [</> code block]
```

Each button operates on the current selection. With nothing selected the marker is inserted around a placeholder and the cursor lands inside the placeholder. Standard Stack-Overflow editor behaviour.

Code-block button opens a tiny popover asking which language (`python` / `html` / `javascript` / `typescript` / `css` / `none`) and inserts ` ```lang\n…\n``` `.

Image button opens a one-input popover for an image URL — there is no upload pipeline in this block. Image upload (Vercel Blob or Supabase Storage) lands in admin-block 2 (course editor).

### 3.2 Keyboard shortcuts

- `Cmd/Ctrl + B` → bold
- `Cmd/Ctrl + I` → italic
- `Cmd/Ctrl + K` → link
- `Tab` at start of line → indent (for nested lists)

### 3.3 Live preview

Renders right-side using the **same** markdown components as the student-facing `theory-panel.tsx`. To keep them identical we extract the components map into `src/components/lesson/theory-markdown.tsx` and import from both places.

Preview pane is a fixed-height scrollable column so the admin can compare top-of-textarea with the rendered top simultaneously.

## 4. Code pair (starter + solution)

Two Monaco editors side by side, each ~320px tall with a resize-handle on the bottom edge.

| Field | Visible to student? | Notes |
|-------|--------------------|-------|
| `starterCode` | yes | comments may steer the student |
| `solution` | no | reference; never sent to the client |

For `type: "quiz"` this whole section is hidden — quizzes have no code.

Header inside each panel: small monospace label, language indicator (mirrors metadata `language`), copy-to-clipboard button.

A `Run solution through tests` button runs the **client-side** `HtmlRunner`/`PythonRunner` against `solution` and reports pass/fail per assertion. It is the admin's self-check that the lesson is internally consistent before publish (§7.3).

## 5. Test builder — three shapes

The builder is a list of test cards plus an "Add test" button. The card shape is decided by `(type, language)`:

### Shape A — IO tests for Python / JavaScript code lessons

Used when `type ∈ {code, fix-bug}` and `language ∈ {python, javascript, typescript}`.

Storage: `tests: IoTestCase[]` where `{ input, expected, description }`.

Card UI:

```
┌─ Test 1 ────────────────────── [↑] [↓] [✕] ─┐
│ Description (shown to student)              │
│ [Variable message contains correct text  ]   │
│ Expression to evaluate                       │
│ [message                                  ]  │
│ Expected result                              │
│ [Hello, world!                            ]  │
└─────────────────────────────────────────────┘
```

### Shape B — DOM/CSS assertions for HTML / CSS lessons

Used when `type ∈ {code, fix-bug}` and `language === "html"`.

Storage: `tests: HtmlAssertion[]` — discriminated union over eight `kind` values.

`+ Add assertion` opens a dropdown of all eight kinds with Russian labels:

| Russian label | `kind` |
|---------------|--------|
| Существование тега | `exists` |
| Количество тегов | `count` |
| Точный текст | `text` |
| Содержит текст | `textContains` |
| Атрибут | `attr` |
| Атрибут существует | `attrExists` |
| CSS-свойство | `style` |
| CSS-свойство содержит | `styleContains` |

Each kind renders its own field set inside a generic `<AssertionCard>`.

Auto-fill rule for `description`: if left empty when saving, a human-readable Russian string is generated from the kind (e.g. "Селектор `h1` существует"). This keeps test creation fast without leaving descriptions blank.

### Shape C — Quiz questions

Used when `type === "quiz"`. Storage convention is unchanged: `IoTestCase[]` where `input` = question text, `description` = options joined by `|`, `expected` = the correct option.

The UI presents each as a question card with options:

```
┌─ Question 1 ──────────────────── [↑↓✕] ──┐
│ Question text                            │
│ [What styles a webpage?              ]   │
│                                          │
│ Options (★ marks the correct one)       │
│ [ ] HTML                          [✕]   │
│ [★] CSS                           [✕]   │
│ [ ] JavaScript                    [✕]   │
│ [ ] Browser                       [✕]   │
│ [+ Add option]                           │
└──────────────────────────────────────────┘
```

On save the UI converts to the storage format — no DB changes needed.

### 5.1 Cross-cutting test features

- Reorder via `↑` / `↓` buttons (drag-drop is overkill for v1)
- Per-test "Run this test" button executes only that one assertion against `solution` and shows a green/red pill
- Minimum one test is required to publish
- "Show JSON" toggle reveals an editable raw JSON pane for power users; only admins (already the case for the whole panel)

## 6. Hints

Three fixed textareas, ordered by strength:

| # | Label | XP penalty | Notes |
|---|-------|------------|-------|
| 1 | Soft hint — direction without solution | -5 % | textarea, no preview |
| 2 | Concrete — partial answer | -25 % | textarea, no preview |
| 3 | Full — complete solution with explanation | -50 % | textarea, no preview |

Stored as `hints: string[]` with exactly three non-empty entries (validated on publish).

The XP-penalty figures are documentation only here — penalty logic already lives in the runtime and matches these defaults.

## 7. Save / Publish flow

### 7.1 Three actions in the sticky header

| Action | Effect | Visible to students |
|--------|--------|---------------------|
| **Save draft** | `PATCH` saves all fields. `isPublished` untouched. | If lesson was already published, edits go live immediately (this is fine — admin chose to save) |
| **Publish** | Saves + sets `isPublished: true` after running the validators in §7.3 | Yes |
| **Unpublish** | Replaces "Publish" once `isPublished: true`. Sets it back to `false` | Removed from student dashboards |

### 7.2 Auto-save in localStorage

Every 5 seconds, while there are unsaved changes, the editor writes the current draft to `localStorage` under `lesson-draft-${lessonId}`. On reopening the page, if the localStorage draft differs from the server value, a banner offers `Restore draft` / `Discard`. After a successful explicit save the localStorage entry is cleared.

### 7.3 Pre-publish validators

The `Publish` button is disabled until **all** of these pass; failing checks are listed inline:

- `title` non-empty, ≥ 3 chars
- `content` ≥ 100 chars
- `starterCode` non-empty (skip for quiz)
- `solution` non-empty (skip for quiz)
- ≥ 1 test
- All three hints non-empty
- Self-check passed: the solution clears every test in the test list (admin clicks "Run all" once, result cached until any test or solution edit invalidates it)

For quiz lessons the self-check is server-side: for each question, `expected` must be one of the options in `description.split("|")`.

### 7.4 Danger zone

A red-bordered block at the page bottom with a single `Delete lesson permanently` button. Click opens a confirmation modal that requires typing the lesson title. On confirm: `DELETE` API + redirect to the course page.

## 8. Lesson reordering on course page

Lives on `/admin/courses/[id]`, not in the lesson editor itself.

Each row in the lesson list grows a left-side drag handle (`⋮⋮`). Drag library: `@dnd-kit/core` + `@dnd-kit/sortable`. After a drop, the client recomputes `order` for every affected row and fires one batch request to `PATCH /api/admin/courses/[id]/reorder` with `[{ id, order }, …]`.

Optimistic UI: the row reorders before the server confirms; a failure rolls back and shows a toast.

## 9. API surface (new and changed)

```
GET    /api/admin/courses/[id]/lessons/[lessonId]      ← full editor payload
PATCH  /api/admin/courses/[id]/lessons/[lessonId]      ← partial update of any subset of fields
DELETE /api/admin/courses/[id]/lessons/[lessonId]      ← already exists; now also clears progress rows via cascade
POST   /api/admin/courses/[id]/lessons                 ← already exists; extend body to accept the full lesson on creation if provided
PATCH  /api/admin/courses/[id]/reorder                 ← NEW — body: [{ id, order }, …]
POST   /api/admin/lessons/[id]/self-check              ← NEW — quiz only; html/python self-check is run client-side via existing runners
```

All endpoints sit behind `getAdminUserId()` (already enforced by `src/lib/api-auth.ts`).

Body shapes follow the existing `LessonContent` interface from `prisma/content/types.ts` — `title`, `order`, `type`, `language`, `xpReward`, `content`, `starterCode`, `solution`, `tests` (JSON), `hints` (JSON), plus the new `isPublished`.

## 10. Existing lesson content

Existing lessons in `prisma/content/<course>/lessons/*.ts` were already seeded into the DB. The editor reads from the DB exclusively — the `.ts` files become historical snapshots used only by `npm run seed:*` scripts on a fresh database.

We are not building a "sync edits back to `.ts` files" pipeline. Vercel's filesystem is read-only at runtime, so it cannot work in production. Edits in the admin live in the database; that database is the source of truth from this point forward.

## 11. File map

| File | Action |
|------|--------|
| `prisma/schema.prisma` | EDIT — add `isPublished` to Lesson, run `prisma db push` |
| `src/app/admin/courses/[id]/lessons/[lessonId]/page.tsx` | NEW — the editor page entry |
| `src/components/admin/lesson-editor/lesson-editor.tsx` | NEW — root composing all blocks |
| `src/components/admin/lesson-editor/save-bar.tsx` | NEW — sticky header with three actions |
| `src/components/admin/lesson-editor/metadata-bar.tsx` | NEW — title/type/lang/xp/order strip |
| `src/components/admin/lesson-editor/markdown-editor.tsx` | NEW — textarea + toolbar |
| `src/components/admin/lesson-editor/markdown-toolbar.tsx` | NEW — toolbar buttons |
| `src/components/admin/lesson-editor/code-pair.tsx` | NEW — two Monaco panels |
| `src/components/admin/lesson-editor/test-builder.tsx` | NEW — switches between A/B/C shapes by type+language |
| `src/components/admin/lesson-editor/test-card-io.tsx` | NEW — Shape A card |
| `src/components/admin/lesson-editor/test-card-html.tsx` | NEW — Shape B card with kind switcher |
| `src/components/admin/lesson-editor/test-card-quiz.tsx` | NEW — Shape C question card |
| `src/components/admin/lesson-editor/hints-block.tsx` | NEW — three hint textareas |
| `src/components/admin/lesson-editor/use-lesson-draft.ts` | NEW — localStorage auto-save hook |
| `src/components/admin/lesson-editor/use-self-check.ts` | NEW — runs solution through HtmlRunner / PythonRunner |
| `src/components/lesson/theory-markdown.tsx` | NEW — extracted markdown components shared between student preview and admin preview |
| `src/components/lesson/theory-panel.tsx` | EDIT — import the extracted markdown components |
| `src/components/admin/lesson-list-sortable.tsx` | NEW — drag-drop list inserted into the existing course page |
| `src/app/admin/courses/[id]/page.tsx` | EDIT — replace the static lesson list with `LessonListSortable` |
| `src/app/api/admin/courses/[id]/lessons/[lessonId]/route.ts` | NEW — GET / PATCH; DELETE already exists |
| `src/app/api/admin/courses/[id]/lessons/route.ts` | EDIT — extend POST body |
| `src/app/api/admin/courses/[id]/reorder/route.ts` | NEW — batch order update |
| `src/app/api/admin/lessons/[id]/self-check/route.ts` | NEW — quiz-only server-side validator |
| `package.json` | EDIT — add `@dnd-kit/core`, `@dnd-kit/sortable` |

## 12. Out of scope (explicit YAGNI)

- Image upload (lands in admin-block 2 with course covers)
- WYSIWYG editor — markdown plus toolbar is enough for an author who is also a developer
- Multi-author / collaborative editing
- Versioning / undo history beyond the localStorage draft
- Course-level operations (creating courses with full metadata, image, prerequisites) — admin-block 2
- News / library editors — blocks 3, 4
- User and analytics admin — blocks 5, 6
- Translating English UI labels to Russian everywhere — already Russian throughout the admin

## 13. Testing strategy

The repo has no test runner. We rely on manual smoke-testing:

- Open an existing complex lesson (e.g. HTML 102 lesson 26 — final contact page). Confirm every field round-trips: load → edit nothing → save → diff is empty.
- For each of `code` / `fix-bug` / `quiz` for both `python` and `html`, create a new lesson from scratch and pass all validators to publish. Verify it is reachable from the student dashboard.
- Run self-check on a deliberately broken solution; confirm the failing assertion shows up red.
- Drag-drop reorder five lessons; reload; confirm the new order persists.
- Auto-save: edit content, hard-refresh the tab, confirm the banner offers to restore.
- Delete an already-completed lesson; confirm the user's progress row is gone (cascade).
