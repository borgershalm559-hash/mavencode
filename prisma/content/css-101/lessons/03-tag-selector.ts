import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "Селектор по тегу",
  order: 3,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# Селектор по тегу

## 🎯 После этого урока ты сможешь
- Стилизовать все элементы определённого тега

## 📚 Теория

### Самый простой селектор — имя тега

Пиши **имя тега** (без угловых скобок) — стиль применится **ко всем** таким тегам на странице.

\`\`\`css
p {
  color: blue;
}
\`\`\`

Все \`<p>\` на странице станут синими.

\`\`\`css
h1 { color: red; }
h2 { color: green; }
li { color: gray; }
\`\`\`

### Несколько тегов через запятую

Если хочешь применить **один и тот же стиль** к разным тегам — пиши их через **запятую**:

\`\`\`css
h1, h2, h3 {
  color: navy;
}
\`\`\`

Все три типа заголовков будут тёмно-синими.

### Универсальный селектор \`*\`

\`*\` — это **все элементы** на странице. Используется редко, обычно для глобального сброса:

\`\`\`css
* {
  margin: 0;
}
\`\`\`

## 🛠️ Задание

В \`<style>\` напиши:
- Все \`<p>\` — цвет \`green\`
- Все \`<h1>\` — цвет \`red\`

В \`<body>\` поставь \`<h1>Заголовок</h1>\` и \`<p>Текст</p>\`.`,
  starterCode: `<!doctype html>
<html>
<head>
  <style>
    /* стили здесь */
  </style>
</head>
<body>
  <!-- h1 и p -->
</body>
</html>
`,
  solution: `<!doctype html>
<html>
<head>
  <style>
    p { color: green; }
    h1 { color: red; }
  </style>
</head>
<body>
  <h1>Заголовок</h1>
  <p>Текст</p>
</body>
</html>`,
  tests: [
    { kind: "exists", selector: "h1", description: "Есть <h1>" },
    { kind: "exists", selector: "p", description: "Есть <p>" },
    { kind: "style", selector: "h1", property: "color", equals: "red", description: "<h1> красный" },
    { kind: "style", selector: "p", property: "color", equals: "green", description: "<p> зелёный" },
  ],
  hints: [
    "Два правила в <style>: одно для p, одно для h1. Каждое — селектор { color: ...; }.",
    "Шаблон: p { color: green; } h1 { color: red; }",
    "Полное решение — см. в задании выше.",
  ],
  isAvailable: true,
};

export default lesson;
