import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "text-decoration и text-transform",
  order: 20,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# \`text-decoration\` и \`text-transform\`

## 🎯 После этого урока ты сможешь
- Подчёркивать или зачёркивать текст
- Делать текст ALL CAPS или маленькими буквами

## 📚 Теория

### \`text-decoration\` — подчёркивания

\`\`\`css
text-decoration: none;          /* убрать декорации */
text-decoration: underline;     /* подчёркивание */
text-decoration: line-through;  /* зачёркивание */
text-decoration: overline;      /* линия сверху */
\`\`\`

Самое частое применение — **убрать подчёркивание со ссылок**:

\`\`\`css
a { text-decoration: none; }
\`\`\`

### Разноцветное подчёркивание

В современном CSS можно стилизовать саму линию подчёркивания:

\`\`\`css
a {
  text-decoration: underline;
  text-decoration-color: red;
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;   /* отступ от текста */
}
\`\`\`

### \`text-transform\` — изменение регистра

\`\`\`css
text-transform: uppercase;     /* ВСЕ ЗАГЛАВНЫЕ */
text-transform: lowercase;     /* все строчные */
text-transform: capitalize;    /* Каждое Слово С Большой Буквы */
text-transform: none;          /* как написано (по умолчанию) */
\`\`\`

**Удобно** — текст в HTML остаётся обычным («Узнать больше»), а CSS делает его капсом. Если решишь убрать капс — меняешь только CSS, не правишь HTML.

\`\`\`css
.cta {
  text-transform: uppercase;
  letter-spacing: 0.1em;     /* капс лучше с межбуквенным */
  font-weight: bold;
}
\`\`\`

## 🛠️ Задание

Сделай:

- \`<a class="link">\` — без подчёркивания (\`text-decoration: none\`)
- \`<span class="caps">\` — все заглавные через \`text-transform: uppercase\``,
  starterCode: `<!doctype html>
<html>
<head>
  <style>
    /* .link и .caps */
  </style>
</head>
<body>
  <!-- a и span -->
</body>
</html>
`,
  solution: `<!doctype html>
<html>
<head>
  <style>
    .link { text-decoration: none; }
    .caps { text-transform: uppercase; }
  </style>
</head>
<body>
  <a class="link" href="#">Ссылка без подчёркивания</a>
  <span class="caps">текст капсом</span>
</body>
</html>`,
  tests: [
    { kind: "styleContains", selector: ".link", property: "text-decoration", contains: "none", description: ".link без подчёркивания" },
    { kind: "style", selector: ".caps", property: "text-transform", equals: "uppercase", description: ".caps в верхнем регистре" },
  ],
  hints: [
    "text-decoration: none убирает все декорации (включая подчёркивание у ссылок).",
    "text-transform: uppercase делает все буквы заглавными.",
    "Полное решение — см. в задании выше.",
  ],
  isAvailable: true,
};

export default lesson;
