import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "Юниты: px, %, em, rem",
  order: 21,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# Юниты: \`px\`, \`%\`, \`em\`, \`rem\`

## 🎯 После этого урока ты сможешь
- Использовать абсолютные и относительные единицы
- Понимать когда какая удобнее

## 📚 Теория

### Абсолютные единицы

**\`px\`** (пиксели) — самые предсказуемые. **1px = 1 пиксель экрана** (приблизительно).

\`\`\`css
width: 200px;
font-size: 16px;
\`\`\`

Существуют ещё \`cm\`, \`mm\`, \`in\` (дюймы), \`pt\` — но они **редко** нужны (только для печати).

### Относительные единицы — относительно чего-то

**\`%\`** — относительно **родителя**:

\`\`\`css
.box {
  width: 50%;     /* половина ширины родителя */
}
\`\`\`

**\`em\`** — относительно **font-size своего же элемента**:

\`\`\`css
.btn {
  font-size: 16px;
  padding: 1em;     /* 16px (1×16) */
}
\`\`\`

**\`rem\`** — относительно **font-size корневого \`<html>\`** (обычно 16px по умолчанию):

\`\`\`css
margin: 1rem;     /* 16px */
padding: 0.5rem;  /* 8px */
\`\`\`

### Когда что

| Юнит | Хорош для |
|------|-----------|
| \`px\` | Тонкие линии (\`border: 1px\`), макетные размеры с точностью |
| \`%\` | Ширины блоков относительно родителя |
| \`rem\` | Общие отступы и шрифты (масштабируется с пользовательскими настройками) |
| \`em\` | Отступы и иконки **внутри компонента** относительно его шрифта |

### Простое правило

- **Шрифты** — \`rem\`
- **Отступы** (padding, margin) — \`rem\` или \`em\`
- **Бордеры тонкие** (1-2px) — \`px\`
- **Ширины блоков** — \`%\` или \`rem\` (или \`px\` для фиксированных)

## 🛠️ Задание

Стилизуй:

- \`<div class="box">\` — \`width: 50%\`, \`padding: 1rem\`, \`border: 2px solid black\``,
  starterCode: `<!doctype html>
<html>
<head>
  <style>
    /* .box */
  </style>
</head>
<body>
  <!-- div class="box" -->
</body>
</html>
`,
  solution: `<!doctype html>
<html>
<head>
  <style>
    .box {
      width: 50%;
      padding: 1rem;
      border: 2px solid black;
    }
  </style>
</head>
<body>
  <div class="box">Тестовый блок</div>
</body>
</html>`,
  tests: [
    { kind: "exists", selector: ".box", description: "Есть .box" },
    { kind: "style", selector: ".box", property: "padding-top", equals: "16px", description: ".box padding 1rem (16px)" },
    { kind: "style", selector: ".box", property: "border-top-width", equals: "2px", description: ".box border 2px" },
  ],
  hints: [
    "Несколько свойств в одном правиле через ;. Шаблон: .box { width: 50%; padding: 1rem; border: 2px solid black; }",
    "1rem = 16px по умолчанию. 50% = половина родителя.",
    "Полное решение — см. в задании выше.",
  ],
  isAvailable: true,
};

export default lesson;
