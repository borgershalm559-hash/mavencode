import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "line-height, letter-spacing, text-align",
  order: 19,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# line-height, letter-spacing, text-align

## 🎯 После этого урока ты сможешь
- Управлять расстоянием между строками
- Регулировать межбуквенный интервал
- Выравнивать текст

## 📚 Теория

### \`line-height\` — высота строки

Расстояние между строками в **многострочном** тексте. По умолчанию около 1.2 (немного больше font-size).

\`\`\`css
p { line-height: 1.5; }      /* без единицы — множитель от font-size */
p { line-height: 24px; }     /* конкретно 24px */
p { line-height: 150%; }     /* 150% от font-size */
\`\`\`

**Лучше использовать без единиц** (\`1.5\`) — тогда множитель пропорционально работает с любым font-size.

Хорошие значения для текста: **1.4-1.7**. Меньше — слишком плотно, больше — рыхло.

### \`letter-spacing\` — межбуквенный интервал

Расстояние **между буквами**. Можно отрицательное (буквы ближе) и положительное (буквы дальше).

\`\`\`css
.hero { letter-spacing: -0.02em; }   /* буквы чуть ближе */
.label { letter-spacing: 0.2em; }    /* буквы расставлены — для caps lock */
\`\`\`

Часто используется с **\`text-transform: uppercase\`** для красивых заголовков ALL CAPS.

### \`text-align\` — выравнивание

\`\`\`css
text-align: left;     /* по умолчанию */
text-align: right;    /* по правому */
text-align: center;   /* по центру */
text-align: justify;  /* по ширине (как в книгах) */
\`\`\`

### Совмещение

\`\`\`css
.hero {
  font-size: 48px;
  line-height: 1.1;          /* плотные строки для крупного заголовка */
  letter-spacing: -0.02em;   /* буквы чуть ближе */
  text-align: center;
}
\`\`\`

## 🛠️ Задание

Стилизуй:

- \`<p class="lead">\` — \`line-height: 1.6\` и \`text-align: center\``,
  starterCode: `<!doctype html>
<html>
<head>
  <style>
    /* .lead */
  </style>
</head>
<body>
  <!-- p с class="lead" -->
</body>
</html>
`,
  solution: `<!doctype html>
<html>
<head>
  <style>
    .lead {
      line-height: 1.6;
      text-align: center;
    }
  </style>
</head>
<body>
  <p class="lead">Длинный текст с увеличенной высотой строки и центрированием.</p>
</body>
</html>`,
  tests: [
    { kind: "exists", selector: ".lead", description: "Есть .lead" },
    { kind: "style", selector: ".lead", property: "text-align", equals: "center", description: "Текст по центру" },
  ],
  hints: [
    "В одном правиле сразу два свойства через ;. Шаблон: .lead { line-height: 1.6; text-align: center; }",
    "Полное решение — см. в задании выше.",
  ],
  isAvailable: true,
};

export default lesson;
