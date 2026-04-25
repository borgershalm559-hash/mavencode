import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "Селектор по id #id",
  order: 5,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# Селектор по id \`#id\`

## 🎯 После этого урока ты сможешь
- Использовать id-селектор
- Понимать когда лучше класс, а когда id

## 📚 Теория

### Что такое id

В HTML 101 ты видел атрибут \`id\` для якорных ссылок. \`id\` — это **уникальное имя элемента**, как ник в чате: только один на всю страницу.

В CSS обращаешься к id через **решётку**:

\`\`\`html
<h1 id="main-title">Главный заголовок</h1>
\`\`\`

\`\`\`css
#main-title {
  color: navy;
}
\`\`\`

### id vs class

| | \`#id\` | \`.class\` |
|---|---|---|
| Сколько на странице | **Один** уникальный | Сколько угодно |
| Селектор в CSS | \`#id\` (решётка) | \`.class\` (точка) |
| Для чего | Уникальный конкретный элемент | Группа похожих элементов |

### В реальном коде используется реже чем класс

В современном CSS **классы предпочтительнее** id для стилизации. Причины:
- Класс **переиспользуется** на нескольких элементах
- id имеет **слишком высокую специфичность** (учим в L12) — переопределить сложно

**Правило:** если есть выбор — используй класс. id оставь для якорных ссылок и JS-логики.

## 🛠️ Задание

Сделай две страницы — заголовок с уникальным id и обычный параграф:

- \`<h1 id="main">Главный заголовок</h1>\` — цвет \`navy\` через \`#main\`
- \`<p>Обычный текст.</p>\` — без стиля`,
  starterCode: `<!doctype html>
<html>
<head>
  <style>
    /* #main */
  </style>
</head>
<body>
  <!-- h1 с id="main" и p -->
</body>
</html>
`,
  solution: `<!doctype html>
<html>
<head>
  <style>
    #main { color: navy; }
  </style>
</head>
<body>
  <h1 id="main">Главный заголовок</h1>
  <p>Обычный текст.</p>
</body>
</html>`,
  tests: [
    { kind: "exists", selector: "#main", description: "Есть элемент с id=main" },
    { kind: "text", selector: "#main", equals: "Главный заголовок", description: '#main содержит "Главный заголовок"' },
    { kind: "style", selector: "#main", property: "color", equals: "navy", description: "Цвет #main — navy" },
  ],
  hints: [
    "id в HTML — атрибут id=\"main\". В CSS — селектор #main.",
    "Шаблон HTML: <h1 id=\"main\">...</h1>. Шаблон CSS: #main { color: navy; }",
    "Полное решение — см. в задании выше.",
  ],
  isAvailable: true,
};

export default lesson;
