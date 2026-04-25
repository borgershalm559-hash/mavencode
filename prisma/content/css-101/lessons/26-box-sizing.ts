import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "width, height и box-sizing",
  order: 26,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# \`width\`, \`height\` и \`box-sizing\`

## 🎯 После этого урока ты сможешь
- Задавать размеры блоков
- Понимать как box-sizing меняет логику

## 📚 Теория

### \`width\` и \`height\`

\`\`\`css
.box {
  width: 200px;
  height: 100px;
}
\`\`\`

Можно в любых юнитах: \`px\`, \`%\`, \`rem\`, \`vw\`, \`vh\`...

### Беда «классической» модели

По умолчанию \`width: 200px\` означает **200px только содержимого**. Padding и border **прибавляются сверху**:

\`\`\`css
.box {
  width: 200px;
  padding: 20px;
  border: 5px solid black;
}
/* реальная ширина на экране = 200 + 20×2 + 5×2 = 250px */
\`\`\`

Это запутывает: ты ставишь 200, а получаешь 250.

### \`box-sizing: border-box\` спасает

\`box-sizing: border-box\` меняет логику: \`width\` теперь — это **полная ширина** включая padding и border.

\`\`\`css
.box {
  box-sizing: border-box;
  width: 200px;
  padding: 20px;
  border: 5px solid black;
}
/* реальная ширина = 200px ровно */
\`\`\`

Содержимое внутри будет \`200 - 20×2 - 5×2 = 150px\` — но это тебе обычно и нужно.

### Глобальный сброс

В современных проектах **первое правило** в CSS — применить \`border-box\` ко всему:

\`\`\`css
* {
  box-sizing: border-box;
}
\`\`\`

Это считается **must-have** хорошего тона. С ним размеры предсказуемы.

### \`max-width\` и \`min-width\`

Часто полезнее ограничивать **максимум** ширины, а не задавать жёстко:

\`\`\`css
img {
  max-width: 100%;     /* картинка не вылезет за родителя */
  height: auto;
}

article {
  max-width: 65ch;     /* узкий читабельный текст */
  margin: 0 auto;
}
\`\`\`

## 🛠️ Задание

Стилизуй:

- \`<div class="box">\` — \`width: 200px\`, \`padding: 20px\`, \`border: 2px solid black\`, \`box-sizing: border-box\``,
  starterCode: `<!doctype html>
<html>
<head>
  <style>
    /* .box */
  </style>
</head>
<body>
  <!-- div.box -->
</body>
</html>
`,
  solution: `<!doctype html>
<html>
<head>
  <style>
    .box {
      box-sizing: border-box;
      width: 200px;
      padding: 20px;
      border: 2px solid black;
    }
  </style>
</head>
<body>
  <div class="box">Блок</div>
</body>
</html>`,
  tests: [
    { kind: "style", selector: ".box", property: "box-sizing", equals: "border-box", description: "box-sizing border-box" },
    { kind: "style", selector: ".box", property: "width", equals: "200px", description: "width 200px" },
    { kind: "style", selector: ".box", property: "padding-top", equals: "20px", description: "padding 20px" },
  ],
  hints: [
    "box-sizing: border-box делает width = полная ширина (с padding и border).",
    "Шаблон: .box { box-sizing: border-box; width: 200px; padding: 20px; border: 2px solid black; }",
    "Полное решение — см. в задании выше.",
  ],
  isAvailable: true,
};

export default lesson;
