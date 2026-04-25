import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "border — рамки",
  order: 25,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# \`border\` — рамки

## 🎯 После этого урока ты сможешь
- Делать рамки вокруг элементов
- Скруглять углы через border-radius

## 📚 Теория

### Сокращённая форма

\`border: толщина стиль цвет;\`

\`\`\`css
border: 2px solid black;
border: 1px dashed red;
border: 3px dotted blue;
\`\`\`

### Стили \`style\`

- \`solid\` — сплошная (самая частая)
- \`dashed\` — пунктир
- \`dotted\` — точечная
- \`double\` — двойная
- \`none\` — нет рамки

### По одной стороне

Можно ставить рамку **только с одной стороны**:

\`\`\`css
border-top: 2px solid black;
border-bottom: 1px solid gray;
\`\`\`

Часто используется для разделителей:

\`\`\`css
.row {
  border-bottom: 1px solid #eee;   /* тонкая разделительная линия */
}
\`\`\`

### \`border-radius\` — скругление углов

\`\`\`css
border-radius: 8px;        /* все 4 угла */
border-radius: 50%;        /* круг (если width=height) */
border-radius: 8px 0;      /* верх 8px, низ 0 */
\`\`\`

\`\`\`css
.btn {
  border-radius: 8px;       /* мягкие углы кнопки */
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;        /* круглый аватар */
}
\`\`\`

### Прозрачная рамка

\`border-color: transparent\` — рамка есть (занимает место), но невидима. Полезно при hover-эффектах:

\`\`\`css
.btn { border: 2px solid transparent; }
.btn:hover { border-color: blue; }      /* появляется при наведении */
\`\`\`

## 🛠️ Задание

Стилизуй:

- \`<div class="card">\` — \`border: 2px solid black\`, \`border-radius: 8px\``,
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
    .card {
      border: 2px solid black;
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <div class="card">Карточка</div>
</body>
</html>`,
  tests: [
    { kind: "style", selector: ".card", property: "border-top-width", equals: "2px", description: "border 2px" },
    { kind: "style", selector: ".card", property: "border-top-style", equals: "solid", description: "border solid" },
    { kind: "style", selector: ".card", property: "border-radius", equals: "8px", description: "border-radius 8px" },
  ],
  hints: [
    "border: толщина стиль цвет (через пробелы). border-radius — отдельное свойство.",
    "Шаблон: .card { border: 2px solid black; border-radius: 8px; }",
    "Полное решение — см. в задании выше.",
  ],
  isAvailable: true,
};

export default lesson;
