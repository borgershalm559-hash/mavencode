import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "Селектор-потомок (a b)",
  order: 6,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# Селектор-потомок (\`a b\`)

## 🎯 После этого урока ты сможешь
- Стилизовать элемент только если он внутри другого
- Понимать «потомок» в CSS

## 📚 Теория

### Что такое потомок

**Потомок** в CSS — это любой элемент **внутри** другого, на любой глубине. Не обязательно прямо внутри — может быть глубоко вложен.

\`\`\`html
<article>
  <p>Прямой потомок</p>
  <div>
    <p>Потомок через div — тоже потомок article</p>
  </div>
</article>
<p>НЕ потомок article (вне)</p>
\`\`\`

### Селектор-потомок: пробел между селекторами

В CSS пишешь два селектора **через пробел** — браузер понимает «второй должен быть **внутри** первого»:

\`\`\`css
article p {
  color: gray;
}
\`\`\`

Все \`<p>\` **внутри** \`<article>\` станут серыми. Параграф снаружи \`<article>\` не изменится.

### Цепочки

Можно сцепить **несколько уровней**:

\`\`\`css
article header h2 {
  color: red;
}
\`\`\`

«\`<h2>\` внутри \`<header>\` внутри \`<article>\`».

### Класс и тег

Можно совмещать любые селекторы:

\`\`\`css
.card p { color: blue; }       /* p внутри элемента с классом card */
#sidebar a { color: green; }    /* a внутри #sidebar */
.menu .item { color: red; }    /* .item внутри .menu */
\`\`\`

## 🛠️ Задание

Сделай:
- \`<article>\` с двумя \`<p>\` внутри
- ещё один \`<p>\` снаружи \`<article>\`

Стилизуй только \`<p>\` **внутри** \`<article>\` — цвет \`gray\`. Внешний \`<p>\` не трогай.`,
  starterCode: `<!doctype html>
<html>
<head>
  <style>
    /* article p */
  </style>
</head>
<body>
  <!-- article с двумя p внутри + один p снаружи -->
</body>
</html>
`,
  solution: `<!doctype html>
<html>
<head>
  <style>
    article p { color: gray; }
  </style>
</head>
<body>
  <article>
    <p>Внутри 1</p>
    <p>Внутри 2</p>
  </article>
  <p>Снаружи</p>
</body>
</html>`,
  tests: [
    { kind: "count", selector: "article p", n: 2, description: "Внутри <article> два <p>" },
    { kind: "count", selector: "p", n: 3, description: "Всего три <p>" },
    { kind: "style", selector: "article p", property: "color", equals: "gray", description: "Параграфы внутри article — серые" },
  ],
  hints: [
    "Селектор «article p» означает «p внутри article». Пробел между селекторами = потомок.",
    "Шаблон CSS: article p { color: gray; }",
    "Полное решение — см. в задании выше.",
  ],
  isAvailable: true,
};

export default lesson;
