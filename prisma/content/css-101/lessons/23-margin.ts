import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "margin — внешние отступы",
  order: 23,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# \`margin\` — внешние отступы

## 🎯 После этого урока ты сможешь
- Делать отступы вокруг элементов
- Использовать сокращённую форму

## 📚 Теория

### Что такое margin

**\`margin\`** — это **внешний отступ** между элементом и **соседями вокруг**. Это «пустое пространство» снаружи.

\`\`\`
+------+         +------+
|      | margin  |      |
|  A   | ←—————→ |  B   |
|      |         |      |
+------+         +------+
\`\`\`

### Каждая сторона отдельно

\`\`\`css
margin-top: 10px;
margin-right: 20px;
margin-bottom: 10px;
margin-left: 20px;
\`\`\`

### Сокращённая форма

\`\`\`css
margin: 10px;                /* все 4 стороны 10px */
margin: 10px 20px;            /* верх/низ 10px, лево/право 20px */
margin: 10px 20px 30px;       /* верх 10, лево/право 20, низ 30 */
margin: 10px 20px 30px 40px;  /* верх / право / низ / лево */
\`\`\`

Запомни порядок: **сверху, справа, снизу, слева** (по часовой стрелке).

### \`margin: auto\` — центрирование блока

Если элемент имеет фиксированную ширину, \`margin: 0 auto\` центрирует его по горизонтали:

\`\`\`css
.container {
  width: 800px;
  margin: 0 auto;     /* верх/низ 0, лево/право — auto = поровну */
}
\`\`\`

### Отрицательные margin

Можно поставить **отрицательный margin** — элемент «налезет» на соседа или родителя:

\`\`\`css
.overlap {
  margin-top: -20px;
}
\`\`\`

Используется редко, но иногда полезно.

## 🛠️ Задание

Стилизуй:

- \`<div class="card">\` — \`margin: 20px\` со всех сторон`,
  starterCode: `<!doctype html>
<html>
<head>
  <style>
    /* .card */
  </style>
</head>
<body>
  <!-- div.card -->
</body>
</html>
`,
  solution: `<!doctype html>
<html>
<head>
  <style>
    .card { margin: 20px; }
  </style>
</head>
<body>
  <div class="card">Карточка</div>
</body>
</html>`,
  tests: [
    { kind: "exists", selector: ".card", description: "Есть .card" },
    { kind: "style", selector: ".card", property: "margin-top", equals: "20px", description: "margin-top 20px" },
    { kind: "style", selector: ".card", property: "margin-right", equals: "20px", description: "margin-right 20px" },
    { kind: "style", selector: ".card", property: "margin-bottom", equals: "20px", description: "margin-bottom 20px" },
    { kind: "style", selector: ".card", property: "margin-left", equals: "20px", description: "margin-left 20px" },
  ],
  hints: [
    "Шаблон: .card { margin: 20px; } — это сокращение для всех 4 сторон.",
    "Полное решение — см. в задании выше.",
  ],
  isAvailable: true,
};

export default lesson;
