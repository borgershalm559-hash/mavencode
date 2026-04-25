import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "background — фон элемента",
  order: 27,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# \`background\` — фон элемента

## 🎯 После этого урока ты сможешь
- Делать цветной фон
- Ставить картинку на фон
- Делать градиенты

## 📚 Теория

### \`background-color\` — цвет

\`\`\`css
body { background-color: #f5f5f5; }
.btn { background-color: #3b82f6; }
\`\`\`

\`background-color\` принимает любой формат цвета: имя, hex, rgb, hsl, прозрачный.

### \`background-image\` — картинка фоном

\`\`\`css
.hero {
  background-image: url("hero.jpg");
  background-size: cover;       /* растянуть с сохранением пропорций */
  background-position: center;   /* по центру */
  background-repeat: no-repeat; /* не повторять */
}
\`\`\`

**\`background-size\`:**
- \`cover\` — заполнить всю площадь, обрезав лишнее
- \`contain\` — поместить целиком, оставив свободное место
- \`100% 100%\` — растянуть как есть (искажая пропорции)
- \`200px 100px\` — конкретные размеры

**\`background-position\`:**
- \`center\` — по центру
- \`top left\`, \`top right\`, \`bottom center\` — углы
- \`50% 30%\` — проценты или px

### Градиенты

Градиент — это **картинка**, поэтому ставится в \`background\`:

\`\`\`css
/* Линейный градиент: сверху вниз от красного к синему */
background: linear-gradient(to bottom, red, blue);

/* По диагонали */
background: linear-gradient(135deg, #3b82f6, #8b5cf6);

/* Радиальный (от центра) */
background: radial-gradient(circle, yellow, orange);
\`\`\`

### Сокращённая форма \`background\`

Можно объединить всё в одно свойство:

\`\`\`css
background: #fff url("bg.jpg") no-repeat center/cover;
\`\`\`

Но в начале лучше писать **по отдельности** — понятнее.

## 🛠️ Задание

Сделай:

- \`<header class="hero">\` — \`background-color: #1e293b\`, \`color: white\`, \`padding: 40px\``,
  starterCode: `<!doctype html>
<html>
<head>
  <style>
    /* .hero */
  </style>
</head>
<body>
  <!-- header.hero -->
</body>
</html>
`,
  solution: `<!doctype html>
<html>
<head>
  <style>
    .hero {
      background-color: #1e293b;
      color: white;
      padding: 40px;
    }
  </style>
</head>
<body>
  <header class="hero">
    <h1>Привет</h1>
  </header>
</body>
</html>`,
  tests: [
    { kind: "exists", selector: ".hero", description: "Есть .hero" },
    { kind: "style", selector: ".hero", property: "background-color", equals: "#1e293b", description: "background-color #1e293b" },
    { kind: "style", selector: ".hero", property: "color", equals: "white", description: "color white" },
    { kind: "style", selector: ".hero", property: "padding-top", equals: "40px", description: "padding 40px" },
  ],
  hints: [
    "background-color принимает hex/rgb/имя. color — это цвет текста.",
    "Шаблон: .hero { background-color: #1e293b; color: white; padding: 40px; }",
    "Полное решение — см. в задании выше.",
  ],
  isAvailable: true,
};

export default lesson;
