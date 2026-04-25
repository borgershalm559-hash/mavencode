import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "Специфичность",
  order: 12,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# Специфичность

## 🎯 После этого урока ты сможешь
- Считать специфичность селектора
- Понимать почему один селектор побеждает другой

## 📚 Теория

### Как считать специфичность

Каждый селектор имеет «вес» из 3 цифр: \`(id, классы, теги)\`.

| Селектор | Вес |
|----------|-----|
| \`p\` | (0, 0, 1) — один тег |
| \`.warning\` | (0, 1, 0) — один класс |
| \`#main\` | (1, 0, 0) — один id |
| \`p.warning\` | (0, 1, 1) — класс + тег |
| \`#main p\` | (1, 0, 1) — id + тег |
| \`a:hover\` | (0, 1, 1) — псевдокласс считается как класс |
| \`[type="text"]\` | (0, 1, 0) — атрибут как класс |

Сравнивают **поразрядно**: сначала id, потом классы, потом теги. Большее значение побеждает.

### Примеры

\`\`\`css
#main { color: red; }       /* (1,0,0) */
.title { color: blue; }     /* (0,1,0) */
\`\`\`

\`<h1 id="main" class="title">\` — побеждает **\`#main\`**, потому что 1 > 0 в первом разряде.

\`\`\`css
.warning { color: red; }     /* (0,1,0) */
p.warning { color: blue; }    /* (0,1,1) — добавили тег */
\`\`\`

\`<p class="warning">\` — побеждает **\`p.warning\`** (равно по классам, но у второго есть тег).

### \`!important\` обходит всё

Правило с \`!important\` побеждает любую специфичность:

\`\`\`css
p { color: red !important; }
#main { color: blue; }
\`\`\`

Параграф будет **красным**, несмотря на id.

**Не злоупотребляй \`!important\`** — это «ядерная кнопка», ломает каскад. Используй когда других решений нет.

## 🛠️ Задание

Сделай разметку и стили чтобы заголовок был **зелёным**:

\`\`\`html
<h1 id="main" class="title">Заголовок</h1>
\`\`\`

CSS:
- \`h1 { color: red; }\` — общий тег
- \`.title { color: blue; }\` — по классу
- \`#main { color: green; }\` — по id (победит, специфичность выше всех)`,
  starterCode: `<!doctype html>
<html>
<head>
  <style>
    /* h1, .title, #main с разными color */
  </style>
</head>
<body>
  <!-- h1 с id="main" и class="title" -->
</body>
</html>
`,
  solution: `<!doctype html>
<html>
<head>
  <style>
    h1 { color: red; }
    .title { color: blue; }
    #main { color: green; }
  </style>
</head>
<body>
  <h1 id="main" class="title">Заголовок</h1>
</body>
</html>`,
  tests: [
    { kind: "exists", selector: "#main.title", description: "Есть <h1> с id=\"main\" и class=\"title\"" },
    { kind: "style", selector: "#main", property: "color", equals: "green", description: "Заголовок зелёный (id побеждает)" },
  ],
  hints: [
    "У <h1> должно быть и id, и class. В CSS — три правила с разными color: h1, .title, #main.",
    "Шаблон HTML: <h1 id=\"main\" class=\"title\">...</h1>. CSS: h1 { color: red; } .title { color: blue; } #main { color: green; }",
    "Полное решение — см. в задании выше.",
  ],
  isAvailable: true,
};

export default lesson;
