import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "display: block, inline, inline-block",
  order: 28,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# \`display\`: block, inline, inline-block

## 🎯 После этого урока ты сможешь
- Различать блочные и строчные элементы
- Менять поведение через display

## 📚 Теория

### По умолчанию у каждого тега своё поведение

**Блочные** (\`display: block\` по умолчанию):
- \`<div>\`, \`<p>\`, \`<h1>\`-\`<h6>\`, \`<section>\`, \`<article>\`, \`<header>\`, \`<footer>\`...
- Занимают **всю ширину** строки
- Каждый — на новой строке
- Можно задать \`width\` и \`height\`

**Строчные** (\`display: inline\` по умолчанию):
- \`<a>\`, \`<span>\`, \`<strong>\`, \`<em>\`, \`<code>\`...
- Занимают **столько ширины, сколько нужно** контенту
- Идут друг за другом в одной строке
- **Нельзя** задать \`width\` и \`height\` (игнорируется)
- Margin-top/bottom не работают как обычно

### Менять через CSS

\`\`\`css
/* Сделать ссылку блочной (на отдельной строке, можно задать ширину) */
a { display: block; }

/* Сделать div строчным (в одну строку с соседями) */
.tag { display: inline; }
\`\`\`

### \`inline-block\` — гибрид

Самое полезное! Идёт **в одну строку с соседями** (как inline), но **можно задать width/height** (как block):

\`\`\`css
.tag {
  display: inline-block;
  width: 80px;
  height: 32px;
  padding: 4px 12px;
}
\`\`\`

Часто используется для тегов, бейджей, чипов в одну строку.

### Ещё есть

- \`display: flex\` — Flexbox layout (учим в CSS 102)
- \`display: grid\` — Grid layout (учим в CSS 102)
- \`display: none\` — скрыть (следующий урок)

## 🛠️ Задание

Стилизуй:

- \`<a class="btn">\` — \`display: inline-block\`, \`padding: 8px 16px\`, \`background: blue\`, \`color: white\``,
  starterCode: `<!doctype html>
<html>
<head>
  <style>
    /* .btn */
  </style>
</head>
<body>
  <!-- a.btn -->
</body>
</html>
`,
  solution: `<!doctype html>
<html>
<head>
  <style>
    .btn {
      display: inline-block;
      padding: 8px 16px;
      background: blue;
      color: white;
    }
  </style>
</head>
<body>
  <a class="btn" href="#">Кликни</a>
</body>
</html>`,
  tests: [
    { kind: "exists", selector: ".btn", description: "Есть .btn" },
    { kind: "style", selector: ".btn", property: "display", equals: "inline-block", description: "display inline-block" },
    { kind: "style", selector: ".btn", property: "padding-top", equals: "8px", description: "padding 8px 16px" },
    { kind: "style", selector: ".btn", property: "background-color", equals: "blue", description: "background blue" },
  ],
  hints: [
    "display: inline-block — гибрид (в одну строку, но с width/height/padding).",
    "Шаблон: .btn { display: inline-block; padding: 8px 16px; background: blue; color: white; }",
    "Полное решение — см. в задании выше.",
  ],
  isAvailable: true,
};

export default lesson;
