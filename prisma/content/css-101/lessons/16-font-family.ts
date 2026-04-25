import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "Шрифт: font-family",
  order: 16,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# Шрифт: \`font-family\`

## 🎯 После этого урока ты сможешь
- Менять шрифт элементов
- Понимать «стек шрифтов» и fallback

## 📚 Теория

### \`font-family\` принимает список

\`\`\`css
body {
  font-family: "Helvetica", "Arial", sans-serif;
}
\`\`\`

Браузер пробует **по очереди**:
1. Если установлена «Helvetica» — берёт её
2. Если нет — пробует «Arial»
3. Если и её нет — берёт системный sans-serif

Это называется **«стек шрифтов»** или **fallback** — на разных компьютерах могут быть разные шрифты, поэтому нужны запасные.

### Имя шрифта в кавычках

Если в имени шрифта **есть пробел** или цифра — оборачивай в кавычки:

\`\`\`css
font-family: "Times New Roman", serif;       /* пробел — кавычки */
font-family: Helvetica, sans-serif;          /* без пробела — без кавычек тоже работает */
\`\`\`

### Категории шрифтов (в конце стека)

Всегда заканчивай стек **общей категорией** — браузер найдёт что-нибудь подходящее:

- \`serif\` — с засечками (как Times New Roman)
- \`sans-serif\` — без засечек (как Arial, Helvetica)
- \`monospace\` — моноширинный (как Courier, для кода)
- \`cursive\` — рукописный
- \`fantasy\` — декоративный

### Системные шрифты

В современном CSS часто используют **системный стек** — браузер берёт «родной» шрифт системы (San Francisco на Mac, Segoe UI на Windows):

\`\`\`css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
\`\`\`

Текст выглядит «нативно» под каждую ОС.

### Веб-шрифты (Google Fonts и т.д.)

Можно подключить **внешний шрифт** через \`<link>\`:

\`\`\`html
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">
\`\`\`

\`\`\`css
body { font-family: "Inter", sans-serif; }
\`\`\`

Браузер скачает шрифт с серверов Google и использует его.

## 🛠️ Задание

Сделай две страницы со шрифтами:

- \`<h1>\` — стек \`"Georgia", "Times New Roman", serif\`
- \`<p>\` — стек \`"Helvetica", "Arial", sans-serif\``,
  starterCode: `<!doctype html>
<html>
<head>
  <style>
    /* font-family для h1 и p */
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
    h1 { font-family: "Georgia", "Times New Roman", serif; }
    p { font-family: "Helvetica", "Arial", sans-serif; }
  </style>
</head>
<body>
  <h1>Заголовок</h1>
  <p>Параграф</p>
</body>
</html>`,
  tests: [
    { kind: "styleContains", selector: "h1", property: "font-family", contains: "Georgia", description: "<h1> font-family содержит Georgia" },
    { kind: "styleContains", selector: "p", property: "font-family", contains: "Helvetica", description: "<p> font-family содержит Helvetica" },
  ],
  hints: [
    "Несколько шрифтов через запятую. Если в имени пробел — в кавычках. В конце общая категория (serif/sans-serif).",
    "Шаблон: h1 { font-family: \"Georgia\", \"Times New Roman\", serif; }",
    "Полное решение — см. в задании выше.",
  ],
  isAvailable: true,
};

export default lesson;
