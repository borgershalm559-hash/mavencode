import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "Цвета: named и hex",
  order: 13,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# Цвета: named и hex

## 🎯 После этого урока ты сможешь
- Использовать именованные цвета
- Записывать цвет в hex-формате

## 📚 Теория

### Именованные цвета

CSS знает **140+ цветов по имени**: \`red\`, \`blue\`, \`green\`, \`black\`, \`white\`, \`gray\`, \`navy\`, \`lime\`, \`teal\`, \`coral\`, \`crimson\`, \`gold\`, \`hotpink\`, \`tomato\`...

\`\`\`css
h1 { color: red; }
p { color: gray; }
.bg { background: lightyellow; }
\`\`\`

Удобно для прототипов, но для дизайна обычно нужны **точные оттенки** — для них есть hex и rgb.

### HEX-формат \`#RRGGBB\`

Hex (шестнадцатеричный) — это 6 символов после решётки: по 2 символа на красный, зелёный, синий.

\`\`\`css
color: #ff0000;   /* красный */
color: #00ff00;   /* зелёный */
color: #0000ff;   /* синий */
color: #000000;   /* чёрный */
color: #ffffff;   /* белый */
color: #888888;   /* серый */
\`\`\`

Каждая пара — **00 (нет) до FF (максимум)**. Цифры **0-9** + буквы **a-f**.

### Короткая запись \`#RGB\`

Если все три пары совпадают по цифрам — можно написать **3 символа**:

\`\`\`css
#fff   = #ffffff
#000   = #000000
#f00   = #ff0000
#abc   = #aabbcc
\`\`\`

### Где брать значения

- **Pipette в Figma/Photoshop** — копируешь hex
- **Color picker** в DevTools (нажми на квадратик цвета в стилях)
- **Сайты палитр**: coolors.co, color.adobe.com

## 🛠️ Задание

Сделай разметку:

\`\`\`html
<h1>Заголовок</h1>
<p>Параграф</p>
\`\`\`

Стилизуй:
- \`<h1>\` — цвет \`#3b82f6\` (синий)
- \`<p>\` — цвет \`#888\` (серый)`,
  starterCode: `<!doctype html>
<html>
<head>
  <style>
    /* h1 и p */
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
    h1 { color: #3b82f6; }
    p { color: #888; }
  </style>
</head>
<body>
  <h1>Заголовок</h1>
  <p>Параграф</p>
</body>
</html>`,
  tests: [
    { kind: "style", selector: "h1", property: "color", equals: "#3b82f6", description: "<h1> цвет #3b82f6" },
    { kind: "style", selector: "p", property: "color", equals: "#888888", description: "<p> цвет #888 (серый)" },
  ],
  hints: [
    "Hex-цвет — # и 6 символов (или 3 короткой записью).",
    "Шаблон: h1 { color: #3b82f6; } p { color: #888; }",
    "Полное решение — см. в задании выше.",
  ],
  isAvailable: true,
};

export default lesson;
