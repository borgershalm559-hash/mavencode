# Markdown Editor Upgrade — Design

**Date:** 2026-04-30
**Scope:** Replace the textarea-based markdown editor used across admin (lesson, news, library) with a CodeMirror 6 editor that supports syntax highlighting, hotkeys, drag&drop image upload, paste image, slash menu and contextual templates.

## Goals

1. Cut keystrokes for common markdown operations (bold, italic, link, headings, code).
2. Eliminate the "upload image elsewhere → copy URL → paste" detour.
3. Provide one-shot starting points for typical content patterns (lesson skeleton, quiz intro, news callout).
4. Keep current storage format unchanged (raw markdown strings in DB) — no schema migration.

## Non-Goals

- Rich-text WYSIWYG (Tiptap/Lexical). Storage stays plain markdown.
- Reusable media library page. Uploads are immediate; v1 skips browse UI.
- Workflow states (draft/in-review), scheduled publishing, bulk operations, lesson duplication. Out of scope; tracked for later.
- Cloud storage migration. v1 ships with local FS; if/when prod moves to Vercel-style serverless, swap to R2/Blob (only the upload route changes).

## Architecture

### Editor

- Library: `@uiw/react-codemirror` (React wrapper) + `@codemirror/lang-markdown`, `@codemirror/commands`, `@codemirror/view`, `@codemirror/state`.
- Replace the `<textarea>` inside `src/components/admin/lesson-editor/markdown-editor.tsx`. Keep the existing split-pane wrapper, toolbar position and live `TheoryMarkdown` preview.
- Theme: dark, matching V1 Dossier (mono font, neutral white text, accent `#10B981`).

### Component layout

```
src/components/admin/lesson-editor/
  markdown-editor.tsx         (rewrite — orchestrates editor + preview)
  codemirror-setup.ts         (NEW — extensions, theme, keymap)
  markdown-hotkeys.ts         (NEW — Ctrl+B/I/K/1/2/3/Shift+C commands)
  slash-menu.tsx              (NEW — floating menu component)
  slash-items.ts              (NEW — block items + templates definition)
  image-upload.ts             (NEW — client-side upload helper)
```

### Image upload pipeline

- New route: `POST /api/admin/upload`
  - Auth: admin only.
  - Body: `multipart/form-data`, single field `file`.
  - Limits: 5 MB max.
  - MIME allowlist: `image/jpeg`, `image/png`, `image/webp`, `image/gif`.
  - Magic-byte verification (first 12 bytes vs known signatures). Reject mismatch even if MIME claims image.
  - SVG: rejected — XSS surface, not needed.
  - Storage: `public/uploads/<YYYY>/<MM>/<sha256>.<ext>` (content-addressable; identical files dedupe naturally).
  - Response: `{ url, size, contentType }`.

- Client (`image-upload.ts`):
  - Triggered by drag&drop on the editor or `paste` event with image in clipboard.
  - Inserts placeholder `![Загружаю...](#)` at caret immediately.
  - On success: replaces placeholder with `![](url)`.
  - On failure: replaces placeholder with `![Ошибка загрузки](#)` and shows toast.

- Hosting note: local FS works on VPS/Docker. On Vercel-style read-only filesystems uploaded files vanish on next deploy. v2 swap target: Cloudflare R2 (10 GB free, S3-compatible).

### Slash menu

- Trigger: `/` typed at the start of an empty line.
- Implementation: `slash-menu.tsx` is a floating panel positioned via `EditorView.coordsAtPos`. State lives in component, communicates with editor through a `useImperativeHandle` ref.
- Items in `slash-items.ts`, each:
  ```ts
  type SlashItem = {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    section: "block" | "template";
    contexts: ("lesson" | "news" | "library")[]; // shown only in matching editors
    insert: (view: EditorView) => void;
  };
  ```
- Navigation: ↑↓, Enter, Esc. Typing after `/` filters items by title prefix.
- Markdown editor accepts a `context: "lesson" | "news" | "library"` prop. Slash menu filters items where `contexts` includes that context (or list is empty = universal).

### Hotkeys

Wrappers built on CodeMirror commands:

| Combo | Action |
|---|---|
| Ctrl/Cmd+B | Toggle wrap selection in `**…**` |
| Ctrl/Cmd+I | Toggle wrap selection in `*…*` |
| Ctrl/Cmd+K | Wrap selection as `[selection](|)`, caret inside parens |
| Ctrl/Cmd+Shift+C | Wrap selection as fenced code block |
| Ctrl/Cmd+1/2/3 | Prefix current line with `# `/`## `/`### ` (toggle off if already heading) |
| Ctrl/Cmd+S | Trigger save callback (passed via prop, optional) |
| Tab / Shift+Tab | Indent/outdent in lists |

`Ctrl+S` should be wired by the parent editor (lesson/news/library). It's optional; default behaviour falls through to browser save dialog suppression.

### Templates

In `slash-items.ts`, `section: "template"`:

- **Lesson skeleton** (`contexts: ["lesson"]`):
  ```
  # Заголовок урока

  ## § Теория

  Краткое введение в тему.

  ## § Пример

  ```python
  # пример кода
  ```

  ## § Задание

  Опиши, что должен сделать студент.
  ```

- **Quiz intro** (`contexts: ["lesson"]`): short prompt template for quiz lessons.

- **News callout** (`contexts: ["news"]`):
  ```
  > **Внимание:** короткая выноска.
  ```

- **Install steps** (`contexts: ["lesson", "library"]`): numbered list with code blocks placeholder.

Templates insert their content at the current caret position, replacing the leading `/` if present.

## Data Flow

```
User types in editor
  ↓
CodeMirror dispatches transaction
  ↓
onChange callback (existing) → parent component updates draft state
  ↓
Live preview re-renders via TheoryMarkdown
```

```
User pastes/drops image
  ↓
image-upload.ts inserts placeholder, fires fetch to /api/admin/upload
  ↓
Server validates, hashes, writes to public/uploads/, returns URL
  ↓
image-upload.ts replaces placeholder text with real markdown image
```

```
User types "/"
  ↓
CodeMirror update listener detects "/" at start-of-line
  ↓
slash-menu becomes visible at caret coordinates
  ↓
User presses Enter → SlashItem.insert(view) runs → menu closes
```

## Error Handling

- Upload failure (validation/network): inline placeholder gets replaced with `![Ошибка загрузки](#)`, console error, toast (existing project toast pattern if available, else `alert`).
- Editor crash / extension error: error boundary in `markdown-editor.tsx` falls back to a plain `<textarea>` with current value preserved, so the user never loses content.
- Slash menu positioning: if `coordsAtPos` returns null (very rare), menu opens centered below the editor — degraded but functional.

## Security

- Upload route is admin-gated via existing `getAdminUserId`.
- File-type sniffing is mandatory: do not trust the `Content-Type` header alone. Reject any file whose first bytes don't match the allowlist.
- File extension is derived from sniffed type, not from `file.name`, to prevent `.exe` masquerading as `.png`.
- Reject SVG entirely.
- Filename is `<sha256>.<ext>` — no user-supplied path components reach disk.

## Testing

- Manual smoke for each editor (lesson, news, library):
  1. Hotkeys round-trip.
  2. Drag&drop image — placeholder appears, then real URL.
  3. Paste image from clipboard — same flow.
  4. Slash menu shows correct items per context.
  5. Each template inserts cleanly.
  6. Existing live preview still renders identically.
- Unit tests for `markdown-hotkeys.ts` (pure CodeMirror command functions): bold-toggle on selection, heading-toggle, code-block wrap.
- Upload route: cover MIME mismatch, oversize, and happy path with a `vitest` integration suite (uses tmpdir).

## Rollout

Single PR, single migration-free release. After merge, re-publish admin docs in onboarding (out of scope for this spec).
