import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "Прозрачность: opacity и rgba",
  order: 15,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# Прозрачность: \`opacity\` и \`rgba\`

## 🎯 После этого урока ты сможешь
- Делать элементы полупрозрачными
- Различать opacity и прозрачность цвета

## 📚 Теория

### \`opacity\` — прозрачность всего элемента

\`opacity\` — число от **0 до 1**:
- \`1\` — полностью видимый (по умолчанию)
- \`0.5\` — полупрозрачный
- \`0\` — невидимый

\`\`\`css
.faded {
  opacity: 0.5;
}
\`\`\`

**Внимание:** \`opacity\` применяется к **всему элементу** — фон, текст, рамка, всё, что внутри. Включая дочерние элементы — они тоже становятся полупрозрачными.

### Прозрачность только цвета

Если нужно сделать **только текст или фон** полупрозрачным — используй формат с alpha:

\`\`\`css
/* rgba — старый синтаксис */
color: rgba(0, 0, 0, 0.5);

/* rgb с / — современный */
color: rgb(0 0 0 / 0.5);

/* hex с alpha (8 символов) */
color: #00000080;     /* 80 = ~50% */
\`\`\`

### Разница

\`\`\`html
<div style="opacity: 0.5">
  <h2>Заголовок</h2>
  <p>Параграф</p>
</div>
\`\`\`

И заголовок, и параграф будут полупрозрачными.

\`\`\`html
<div style="background: rgb(0 0 0 / 0.5)">
  <h2>Заголовок</h2>
  <p>Параграф</p>
</div>
\`\`\`

Только **фон** полупрозрачный, текст — нет.

### Когда что

- \`opacity\` — когда хочешь «приглушить» весь блок (например disabled-кнопка, скелетон)
- \`rgba\` / hex с alpha — когда полупрозрачный нужен только в одном свойстве (фон/рамка/тень)

## 🛠️ Задание

Сделай два элемента:

- \`<div class="dim">\` — прозрачность всего блока 0.5
- \`<p class="overlay">\` — фон \`rgba(0, 0, 0, 0.4)\``,
  starterCode: `<!doctype html>
<html>
<head>
  <style>
    /* .dim и .overlay */
  </style>
</head>
<body>
  <!-- div и p -->
</body>
</html>
`,
  solution: `<!doctype html>
<html>
<head>
  <style>
    .dim { opacity: 0.5; }
    .overlay { background: rgba(0, 0, 0, 0.4); }
  </style>
</head>
<body>
  <div class="dim">Полупрозрачный блок</div>
  <p class="overlay">Полупрозрачный фон</p>
</body>
</html>`,
  tests: [
    { kind: "exists", selector: ".dim", description: "Есть .dim" },
    { kind: "exists", selector: ".overlay", description: "Есть .overlay" },
    { kind: "style", selector: ".dim", property: "opacity", equals: "0.5", description: ".dim opacity 0.5" },
    { kind: "style", selector: ".overlay", property: "background-color", equals: "rgba(0, 0, 0, 0.4)", description: ".overlay фон rgba(0,0,0,0.4)" },
  ],
  hints: [
    "opacity ставится прямо на элемент. background с rgba — для прозрачности только фона.",
    "Шаблон: .dim { opacity: 0.5; } .overlay { background: rgba(0, 0, 0, 0.4); }",
    "Полное решение — см. в задании выше.",
  ],
  isAvailable: true,
};

export default lesson;
