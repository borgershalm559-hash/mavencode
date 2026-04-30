import type { EditorView } from "@codemirror/view";
import { EditorSelection } from "@codemirror/state";
import type { LucideIcon } from "lucide-react";
import {
  Heading1, Heading2, Heading3, Code2, Quote, List, ListOrdered, Table, Minus, Image as ImageIcon,
  BookOpen, GraduationCap, Megaphone, Wrench,
} from "lucide-react";
import type { EditorContext } from "./image-upload";

export interface SlashItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  section: "block" | "template";
  contexts?: EditorContext[]; // omitted = available everywhere
  insert: (view: EditorView, replaceFrom: number, replaceTo: number, helpers: SlashHelpers) => void;
}

export interface SlashHelpers {
  pickImage: () => void;
}

function replaceWith(view: EditorView, from: number, to: number, text: string, caretOffset?: number): void {
  const cursorPos = caretOffset !== undefined ? from + caretOffset : from + text.length;
  view.dispatch({
    changes: { from, to, insert: text },
    selection: EditorSelection.cursor(cursorPos),
    scrollIntoView: true,
  });
  view.focus();
}

const LESSON_TEMPLATE = `# Заголовок урока

## § Теория

Краткое введение в тему.

## § Пример

\`\`\`python
# пример кода
\`\`\`

## § Задание

Опиши, что должен сделать студент.
`;

const QUIZ_INTRO = `# Заголовок квиза

Короткое введение перед вопросами — расскажи, что проверяется и что повторить.

> Подсказка: ответ найдёшь в предыдущем уроке.
`;

const NEWS_CALLOUT = `> **Внимание:** короткая выноска для новости. Замени этот текст.
`;

const INSTALL_STEPS = `## Установка

1. Скачай дистрибутив:
   \`\`\`bash
   # команда
   \`\`\`
2. Установи зависимости:
   \`\`\`bash
   # команда
   \`\`\`
3. Запусти:
   \`\`\`bash
   # команда
   \`\`\`
`;

export const SLASH_ITEMS: SlashItem[] = [
  // Blocks
  {
    id: "h1", title: "Заголовок 1", description: "# Большой заголовок", icon: Heading1, section: "block",
    insert: (v, f, t) => replaceWith(v, f, t, "# Заголовок"),
  },
  {
    id: "h2", title: "Заголовок 2", description: "## Подзаголовок", icon: Heading2, section: "block",
    insert: (v, f, t) => replaceWith(v, f, t, "## Заголовок"),
  },
  {
    id: "h3", title: "Заголовок 3", description: "### Меньше", icon: Heading3, section: "block",
    insert: (v, f, t) => replaceWith(v, f, t, "### Заголовок"),
  },
  {
    id: "code", title: "Код-блок", description: "```\\ncode\\n```", icon: Code2, section: "block",
    insert: (v, f, t) => replaceWith(v, f, t, "```\n// код\n```\n", 3),
  },
  {
    id: "quote", title: "Цитата", description: "> текст", icon: Quote, section: "block",
    insert: (v, f, t) => replaceWith(v, f, t, "> цитата"),
  },
  {
    id: "ul", title: "Список", description: "- пункт", icon: List, section: "block",
    insert: (v, f, t) => replaceWith(v, f, t, "- пункт\n- пункт"),
  },
  {
    id: "ol", title: "Нумерованный список", description: "1. пункт", icon: ListOrdered, section: "block",
    insert: (v, f, t) => replaceWith(v, f, t, "1. пункт\n2. пункт"),
  },
  {
    id: "table", title: "Таблица", description: "Колонки и строки", icon: Table, section: "block",
    insert: (v, f, t) => replaceWith(v, f, t, "| Колонка 1 | Колонка 2 |\n|---|---|\n| 1 | 2 |\n"),
  },
  {
    id: "hr", title: "Разделитель", description: "Горизонтальная линия", icon: Minus, section: "block",
    insert: (v, f, t) => replaceWith(v, f, t, "\n---\n"),
  },
  {
    id: "image", title: "Картинка", description: "Загрузить изображение", icon: ImageIcon, section: "block",
    insert: (v, f, t, helpers) => {
      // remove the slash trigger first, then open file dialog
      v.dispatch({ changes: { from: f, to: t, insert: "" } });
      helpers.pickImage();
    },
  },

  // Templates
  {
    id: "tpl-lesson", title: "Урок: теория → пример → задание",
    description: "Готовая структура урока", icon: GraduationCap, section: "template",
    contexts: ["lesson"],
    insert: (v, f, t) => replaceWith(v, f, t, LESSON_TEMPLATE),
  },
  {
    id: "tpl-quiz", title: "Quiz-вступление",
    description: "Короткое введение для квиз-урока", icon: BookOpen, section: "template",
    contexts: ["lesson"],
    insert: (v, f, t) => replaceWith(v, f, t, QUIZ_INTRO),
  },
  {
    id: "tpl-callout", title: "Callout-объявление",
    description: "Большая выноска внимания", icon: Megaphone, section: "template",
    contexts: ["news"],
    insert: (v, f, t) => replaceWith(v, f, t, NEWS_CALLOUT),
  },
  {
    id: "tpl-install", title: "Шаги установки",
    description: "Numbered list с code blocks", icon: Wrench, section: "template",
    contexts: ["lesson", "library"],
    insert: (v, f, t) => replaceWith(v, f, t, INSTALL_STEPS),
  },
];

export function getSlashItemsForContext(context: EditorContext): SlashItem[] {
  return SLASH_ITEMS.filter(
    (i) => !i.contexts || i.contexts.includes(context),
  );
}

export function filterSlashItems(items: SlashItem[], query: string): SlashItem[] {
  if (!query) return items;
  const q = query.toLowerCase();
  return items.filter(
    (i) => i.title.toLowerCase().includes(q) || i.id.toLowerCase().includes(q),
  );
}
