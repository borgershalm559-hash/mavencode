import type { EditorView } from "@codemirror/view";
import { EditorSelection } from "@codemirror/state";

export type EditorContext = "lesson" | "news" | "library";

interface UploadResponse {
  url: string;
  size: number;
  contentType: string;
}

let placeholderCounter = 0;

export function nextPlaceholderToken(): string {
  placeholderCounter += 1;
  return `[upload-${placeholderCounter}-${Date.now()}]`;
}

export async function uploadImage(file: File): Promise<UploadResponse> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Upload failed: ${res.status}`);
  }
  return (await res.json()) as UploadResponse;
}

/**
 * Insert a placeholder at the given position, fire upload, then replace
 * the placeholder text with the final markdown image once done.
 */
export async function insertImageWithUpload(
  view: EditorView,
  pos: number,
  file: File,
): Promise<void> {
  const token = nextPlaceholderToken();
  const placeholder = `![Загружаю...](${token})`;

  view.dispatch({
    changes: { from: pos, to: pos, insert: placeholder },
    selection: EditorSelection.cursor(pos + placeholder.length),
  });

  const replaceToken = (replacement: string) => {
    const doc = view.state.doc.toString();
    const idx = doc.indexOf(placeholder);
    if (idx === -1) return;
    view.dispatch({
      changes: { from: idx, to: idx + placeholder.length, insert: replacement },
    });
  };

  try {
    const result = await uploadImage(file);
    replaceToken(`![](${result.url})`);
  } catch (err) {
    console.error("upload failed", err);
    replaceToken(`![Ошибка загрузки](#)`);
  }
}
