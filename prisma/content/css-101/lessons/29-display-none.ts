import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "Скрыть элемент: display: none и visibility: hidden",
  order: 29,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# Скрыть элемент: \`display: none\` и \`visibility: hidden\`

## 🎯 После этого урока ты сможешь
- Скрывать элементы со страницы
- Различать «удалить» и «спрятать»

## 📚 Теория

### \`display: none\` — элемент удаляется

Элемент **исчезает полностью**: его не видно, он не занимает места, на него нельзя нажать. Как будто его нет в HTML.

\`\`\`css
.hidden { display: none; }
\`\`\`

### \`visibility: hidden\` — элемент невидим, но место занимает

Элемент **не виден**, но **место под него остаётся** — соседи не сдвигаются.

\`\`\`css
.invisible { visibility: hidden; }
\`\`\`

### Сравнение

\`\`\`html
<p>До</p>
<div class="hidden">Скрытый блок</div>
<p>После</p>
\`\`\`

С \`display: none\`:
- \`До\` и \`После\` идут вплотную (как будто div'а нет)

С \`visibility: hidden\`:
- Между \`До\` и \`После\` пустое место (там div, но невидимый)

### Когда что использовать

| | display: none | visibility: hidden |
|---|---|---|
| Видно | нет | нет |
| Занимает место | нет | да |
| В layout | пропадает полностью | остаётся |
| Использование | скрыть элемент целиком | сохранить layout, временно убрать |

### Ещё способ — \`opacity: 0\`

\`opacity: 0\` похож на \`visibility: hidden\` (не видно, место занимает), **но кликать всё ещё можно**. Используется для анимаций (плавное появление через \`opacity: 0 → 1\`).

\`\`\`css
.fade-in {
  opacity: 0;
  transition: opacity 0.3s;
}
.fade-in.show {
  opacity: 1;
}
\`\`\`

## 🛠️ Задание

Стилизуй два элемента:

- \`<p class="gone">\` — \`display: none\` (исчезает)
- \`<p class="invisible">\` — \`visibility: hidden\` (пустое место)`,
  starterCode: `<!doctype html>
<html>
<head>
  <style>
    /* .gone и .invisible */
  </style>
</head>
<body>
  <!-- два p -->
</body>
</html>
`,
  solution: `<!doctype html>
<html>
<head>
  <style>
    .gone { display: none; }
    .invisible { visibility: hidden; }
  </style>
</head>
<body>
  <p class="gone">Скрыт через display</p>
  <p class="invisible">Скрыт через visibility</p>
</body>
</html>`,
  tests: [
    { kind: "style", selector: ".gone", property: "display", equals: "none", description: "display: none" },
    { kind: "style", selector: ".invisible", property: "visibility", equals: "hidden", description: "visibility: hidden" },
  ],
  hints: [
    "display: none — элемент исчезает полностью. visibility: hidden — невидим, но место остаётся.",
    "Шаблон: .gone { display: none; } .invisible { visibility: hidden; }",
    "Полное решение — см. в задании выше.",
  ],
  isAvailable: true,
};

export default lesson;
