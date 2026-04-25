import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "Псевдоклассы: :hover, :first-child, :nth-child",
  order: 10,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# Псевдоклассы: \`:hover\`, \`:first-child\`, \`:nth-child\`

## 🎯 После этого урока ты сможешь
- Стилизовать состояние элемента (наведение, фокус)
- Стилизовать по позиции в родителе

## 📚 Теория

### Что такое псевдокласс

**Псевдокласс** — это **состояние** или **позиция** элемента, которые нельзя выразить классом или атрибутом. Например «когда мышь наведена», «первый ребёнок родителя», «когда поле в фокусе».

Записывается через **двоеточие** после селектора:

\`\`\`css
a:hover {
  color: red;
}
\`\`\`

Когда мышь над ссылкой — она красная. Курсор уехал — стиль пропал.

### Часто используемые

**\`:hover\`** — мышь наведена:
\`\`\`css
button:hover { background: blue; }
\`\`\`

**\`:focus\`** — элемент в фокусе (например клик на input или Tab на ссылку):
\`\`\`css
input:focus { border-color: green; }
\`\`\`

**\`:first-child\`** — первый ребёнок своего родителя:
\`\`\`css
li:first-child { color: red; }   /* первый <li> в каждом списке */
\`\`\`

**\`:last-child\`** — последний ребёнок:
\`\`\`css
li:last-child { color: blue; }
\`\`\`

**\`:nth-child(N)\`** — N-й ребёнок:
\`\`\`css
li:nth-child(2) { color: green; }     /* второй */
li:nth-child(odd) { background: gray; }   /* нечётные */
li:nth-child(even) { background: white; } /* чётные */
\`\`\`

### Проверь себя

\`\`\`html
<ul>
  <li>1</li>   <!-- :first-child -->
  <li>2</li>   <!-- :nth-child(2) -->
  <li>3</li>   <!-- :last-child -->
</ul>
\`\`\`

## 🛠️ Задание

Сделай список из трёх \`<li>\`:

- \`<li>Первый</li>\` — цвет \`red\` через \`:first-child\`
- \`<li>Второй</li>\`
- \`<li>Третий</li>\` — цвет \`blue\` через \`:last-child\``,
  starterCode: `<!doctype html>
<html>
<head>
  <style>
    /* li:first-child и li:last-child */
  </style>
</head>
<body>
  <!-- ul с тремя li -->
</body>
</html>
`,
  solution: `<!doctype html>
<html>
<head>
  <style>
    li:first-child { color: red; }
    li:last-child { color: blue; }
  </style>
</head>
<body>
  <ul>
    <li>Первый</li>
    <li>Второй</li>
    <li>Третий</li>
  </ul>
</body>
</html>`,
  tests: [
    { kind: "count", selector: "li", n: 3, description: "Три <li>" },
    { kind: "style", selector: "li:first-child", property: "color", equals: "red", description: "Первый <li> — красный" },
    { kind: "style", selector: "li:last-child", property: "color", equals: "blue", description: "Последний <li> — синий" },
  ],
  hints: [
    "Псевдоклассы пишутся через двоеточие: li:first-child, li:last-child.",
    "Шаблон: li:first-child { color: red; } li:last-child { color: blue; }",
    "Полное решение — см. в задании выше.",
  ],
  isAvailable: true,
};

export default lesson;
