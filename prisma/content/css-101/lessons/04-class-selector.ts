import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "Селектор по классу .class",
  order: 4,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# Селектор по классу \`.class\`

## 🎯 После этого урока ты сможешь
- Создавать переиспользуемые стили через классы
- Применять класс к нужным элементам

## 📚 Теория

### Зачем нужен класс

Селектор по тегу применяется **ко всем** тегам сразу. А что если нужно покрасить **только один** \`<p>\`, а остальные оставить как есть?

Решение — **класс**. Класс — это «метка» которую ты вешаешь на элемент:

\`\`\`html
<p class="warning">Внимание!</p>
<p>Обычный текст.</p>
\`\`\`

В CSS обращаешься к классу через **точку** перед именем:

\`\`\`css
.warning {
  color: red;
}
\`\`\`

Только параграф с \`class="warning"\` станет красным. Остальные \`<p>\` без изменений.

### Имя класса

- Только латинские буквы, цифры, дефис, подчёркивание
- Желательно начинать с буквы
- Желательно по смыслу: \`.warning\`, \`.button\`, \`.card\` — а не \`.red\` или \`.big\` (потому что цвет/размер можно поменять без переименования класса)

### Один элемент — несколько классов

У одного тега может быть **несколько** классов через пробел:

\`\`\`html
<button class="btn btn-primary large">Кнопка</button>
\`\`\`

Применятся правила всех трёх классов.

### Класс может быть на любом теге

\`\`\`html
<h1 class="main-title">...</h1>
<div class="card">...</div>
<a class="btn">...</a>
\`\`\`

Один и тот же класс \`.btn\` можно применить и к \`<a>\`, и к \`<button>\` — оба получат стили кнопки.

## 🛠️ Задание

Сделай два параграфа:
- \`<p class="warning">Внимание!</p>\` — красный
- \`<p>Обычный текст.</p>\` — без стиля

CSS: правило \`.warning { color: red; }\``,
  starterCode: `<!doctype html>
<html>
<head>
  <style>
    /* .warning */
  </style>
</head>
<body>
  <!-- два параграфа, один с классом warning -->
</body>
</html>
`,
  solution: `<!doctype html>
<html>
<head>
  <style>
    .warning { color: red; }
  </style>
</head>
<body>
  <p class="warning">Внимание!</p>
  <p>Обычный текст.</p>
</body>
</html>`,
  tests: [
    { kind: "exists", selector: ".warning", description: "Есть элемент с классом warning" },
    { kind: "count", selector: "p", n: 2, description: "Два параграфа" },
    { kind: "style", selector: ".warning", property: "color", equals: "red", description: "Элемент .warning красный" },
    { kind: "text", selector: ".warning", equals: "Внимание!", description: '.warning содержит "Внимание!"' },
  ],
  hints: [
    "Класс задаётся в HTML через атрибут class=\"warning\". В CSS обращайся через .warning",
    "Шаблон CSS: .warning { color: red; }. HTML: <p class=\"warning\">Внимание!</p>",
    "Полное решение — см. в задании выше.",
  ],
  isAvailable: true,
};

export default lesson;
