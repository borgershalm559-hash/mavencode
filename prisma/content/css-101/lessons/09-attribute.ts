import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "Атрибутные селекторы [attr=val]",
  order: 9,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# Атрибутные селекторы \`[attr=val]\`

## 🎯 После этого урока ты сможешь
- Стилизовать по значению атрибута
- Делать селекторы для разных типов input

## 📚 Теория

### Селектор \`[name=value]\`

Можно стилизовать элементы по **значению атрибута**:

\`\`\`css
input[type="email"] {
  background: lightyellow;
}
\`\`\`

Все \`<input>\` с \`type="email"\` получат жёлтый фон. Другие \`<input>\` — без изменений.

### Просто наличие атрибута

\`[attr]\` — без значения, проверяет **что атрибут есть** (любое значение):

\`\`\`css
input[required] {
  border: 2px solid red;
}
\`\`\`

Все обязательные поля получат красную рамку.

### Префикс/суффикс/содержит

| Селектор | Значение атрибута |
|----------|------------------|
| \`[href]\` | Любой href есть |
| \`[href="https://google.com"]\` | Точно равно |
| \`[href^="https"]\` | Начинается с (^) |
| \`[href$=".pdf"]\` | Заканчивается на ($) |
| \`[href*="example"]\` | Содержит (*) |

\`\`\`css
a[href^="https"] { color: green; }   /* безопасные ссылки */
a[href$=".pdf"] { color: red; }       /* PDF-файлы */
\`\`\`

### Полезные кейсы

- \`input[type="checkbox"]\` — стилизация чекбоксов
- \`a[target="_blank"]\` — пометить внешние ссылки
- \`img[alt=""]\` — найти декоративные картинки
- \`[disabled]\` — отключённые элементы

## 🛠️ Задание

Сделай форму с двумя инпутами:

- \`<input type="text">\`
- \`<input type="email">\`

Стилизуй **только email** — \`background: yellow\` через \`input[type="email"]\`.`,
  starterCode: `<!doctype html>
<html>
<head>
  <style>
    /* input[type="email"] */
  </style>
</head>
<body>
  <!-- два инпута: text и email -->
</body>
</html>
`,
  solution: `<!doctype html>
<html>
<head>
  <style>
    input[type="email"] { background: yellow; }
  </style>
</head>
<body>
  <input type="text">
  <input type="email">
</body>
</html>`,
  tests: [
    { kind: "count", selector: "input", n: 2, description: "Два <input>" },
    { kind: "exists", selector: 'input[type="email"]', description: 'Есть <input type="email">' },
    { kind: "style", selector: 'input[type="email"]', property: "background-color", equals: "yellow", description: "У email-инпута жёлтый фон" },
  ],
  hints: [
    "Селектор по атрибуту: input[type=\"email\"]. Внутри [] имя=значение.",
    "Шаблон CSS: input[type=\"email\"] { background: yellow; }",
    "Полное решение — см. в задании выше.",
  ],
  isAvailable: true,
};

export default lesson;
