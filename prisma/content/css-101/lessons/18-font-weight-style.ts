import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "Жирность и наклон: font-weight, font-style",
  order: 18,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# Жирность и наклон: \`font-weight\`, \`font-style\`

## 🎯 После этого урока ты сможешь
- Делать текст жирным или тонким
- Включать курсив через CSS

## 📚 Теория

### \`font-weight\` — жирность

Числовые значения **100-900**:
- \`100\` — Thin (очень тонкий)
- \`300\` — Light
- \`400\` — Regular (обычный, по умолчанию)
- \`500\` — Medium
- \`600\` — Semibold
- \`700\` — Bold
- \`900\` — Black (очень жирный)

Также можно ключевыми словами:
\`\`\`css
font-weight: normal;   /* = 400 */
font-weight: bold;     /* = 700 */
\`\`\`

**Внимание:** доступная жирность **зависит от шрифта**. Не все шрифты имеют все 9 градаций. Если поставишь 300 у шрифта без 300 — браузер возьмёт ближайшую (обычно 400).

### \`font-style\` — наклон

Два значения:
- \`normal\` — обычный (по умолчанию)
- \`italic\` — курсив

\`\`\`css
.note { font-style: italic; }
\`\`\`

\`oblique\` — тоже курсив, но слегка отличается. На практике используется редко, пиши \`italic\`.

### Когда использовать через CSS, а не через теги

В HTML 101 мы видели \`<strong>\` (жирный, смысл «важно») и \`<em>\` (курсив, смысл «акцент»). Это **смысловые** теги.

\`font-weight\` и \`font-style\` — для **визуала без смысла**. Например в макете дизайнер сделал «среднюю жирность» в подзаголовке — это не «важно», это просто вид. Тогда:

\`\`\`css
h2 { font-weight: 500; }
\`\`\`

**Правило:** если есть смысл — \`<strong>\`/\`<em>\`. Просто визуал — \`font-weight\`/\`font-style\` через CSS.

## 🛠️ Задание

Стилизуй:

- \`<h1>\` — \`font-weight: 300\` (тонкий)
- \`<p class="quote">\` — \`font-style: italic\``,
  starterCode: `<!doctype html>
<html>
<head>
  <style>
    /* h1 и .quote */
  </style>
</head>
<body>
  <!-- h1 и p с classом quote -->
</body>
</html>
`,
  solution: `<!doctype html>
<html>
<head>
  <style>
    h1 { font-weight: 300; }
    .quote { font-style: italic; }
  </style>
</head>
<body>
  <h1>Заголовок</h1>
  <p class="quote">Цитата</p>
</body>
</html>`,
  tests: [
    { kind: "style", selector: "h1", property: "font-weight", equals: "300", description: "<h1> font-weight 300" },
    { kind: "style", selector: ".quote", property: "font-style", equals: "italic", description: ".quote курсив" },
  ],
  hints: [
    "font-weight принимает число 100-900 или ключевое слово (normal/bold). font-style — normal или italic.",
    "Шаблон: h1 { font-weight: 300; } .quote { font-style: italic; }",
    "Полное решение — см. в задании выше.",
  ],
  isAvailable: true,
};

export default lesson;
