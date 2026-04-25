import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "Размер шрифта: font-size",
  order: 17,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# Размер шрифта: \`font-size\`

## 🎯 После этого урока ты сможешь
- Задавать размер шрифта в разных единицах
- Понимать когда какая единица удобнее

## 📚 Теория

### Базовые единицы

\`\`\`css
font-size: 16px;     /* пиксели */
font-size: 1em;      /* относительно родителя */
font-size: 1rem;     /* относительно <html> */
font-size: 100%;     /* проценты от родителя */
\`\`\`

### \`px\` — простой и предсказуемый

\`\`\`css
h1 { font-size: 32px; }
p { font-size: 16px; }
\`\`\`

**Плюсы:** просто, точно как в макете.
**Минусы:** не масштабируется если пользователь увеличил размер шрифта в настройках.

### \`rem\` — относительно \`<html>\`

\`1rem\` = размер шрифта **корневого \`<html>\`**. По умолчанию у браузера это **16px**.

\`\`\`css
html { font-size: 16px; }   /* корневой = 16px */

h1 { font-size: 2rem; }      /* 32px */
p  { font-size: 1rem; }      /* 16px */
small { font-size: 0.875rem; } /* 14px */
\`\`\`

**Плюсы:** все размеры пропорциональны. Если поменять корневой на 18px — пропорционально увеличится всё. **Уважает настройки пользователя**.

**Современный стандарт хорошего тона** — использовать \`rem\` для шрифтов.

### \`em\` — относительно родителя

\`1em\` = размер шрифта **родителя**.

\`\`\`css
.card { font-size: 16px; }
.card .title { font-size: 1.5em; }    /* 24px (в 1.5 раза больше родителя) */
\`\`\`

**Минус:** \`em\` накапливается во вложенных элементах (\`1.5em × 1.5em = 2.25em от прародителя\`). Из-за этого иногда трудно предсказать конечный размер.

### Простое правило

- **\`px\`** — для прототипов и когда точно знаешь размер
- **\`rem\`** — для финального продакшна (масштабируется, доступно)
- **\`em\`** — редко, для отступов и иконок относительно текущего шрифта

## 🛠️ Задание

Сделай:

- \`<h1>\` — \`font-size: 32px\`
- \`<p>\` — \`font-size: 1rem\``,
  starterCode: `<!doctype html>
<html>
<head>
  <style>
    /* font-size для h1 и p */
  </style>
</head>
<body>
  <!-- h1 + p -->
</body>
</html>
`,
  solution: `<!doctype html>
<html>
<head>
  <style>
    h1 { font-size: 32px; }
    p { font-size: 1rem; }
  </style>
</head>
<body>
  <h1>Заголовок</h1>
  <p>Параграф</p>
</body>
</html>`,
  tests: [
    { kind: "style", selector: "h1", property: "font-size", equals: "32px", description: "<h1> 32px" },
    { kind: "style", selector: "p", property: "font-size", equals: "16px", description: "<p> 1rem (16px)" },
  ],
  hints: [
    "Шаблон: h1 { font-size: 32px; } p { font-size: 1rem; }",
    "1rem обычно равен 16px — корневой размер по умолчанию.",
    "Полное решение — см. в задании выше.",
  ],
  isAvailable: true,
};

export default lesson;
