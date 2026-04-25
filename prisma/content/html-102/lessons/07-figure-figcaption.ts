import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "<figure> и <figcaption>",
  order: 7,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# \`<figure>\` и \`<figcaption>\`

## 🎯 После этого урока ты сможешь
- Оборачивать картинки с подписью семантически правильно
- Использовать \`<figure>\` не только для изображений

## 📚 Теория

### Что такое \`<figure>\`

\`<figure>\` — это **самостоятельный медиа-блок с подписью**. Картинка, диаграмма, фото, кусок кода, цитата — что угодно, что хочется выделить и подписать.

\`<figcaption>\` — это **подпись** к этому блоку.

\`\`\`html
<figure>
  <img src="cat.jpg" alt="Серый кот на подоконнике">
  <figcaption>Рис. 1. Кот моей соседки.</figcaption>
</figure>
\`\`\`

Браузер по умолчанию делает небольшой отступ слева/справа у \`<figure>\` (от обычного текста), чтобы было видно «это вставка».

### Где может быть \`<figcaption>\`

\`<figcaption>\` — **первый или последний** ребёнок \`<figure>\`. До или после картинки. Других мест нет.

\`\`\`html
<figure>
  <figcaption>Рис. 1.</figcaption>
  <img src="...">
</figure>

<figure>
  <img src="...">
  <figcaption>Рис. 1.</figcaption>
</figure>
\`\`\`

### Не только картинки

В \`<figure>\` можно класть **что угодно** что нужно подписать:

\`\`\`html
<figure>
  <pre><code>print("Hello")</code></pre>
  <figcaption>Листинг 1. Простейшая программа.</figcaption>
</figure>
\`\`\`

Или цитата:

\`\`\`html
<figure>
  <blockquote>
    <p>Простота — высшее достижение.</p>
  </blockquote>
  <figcaption>— Леонардо да Винчи</figcaption>
</figure>
\`\`\`

### Чем отличается от просто \`<img alt>\`

- \`alt\` — описание картинки **для тех кто её не видит**.
- \`<figcaption>\` — подпись **для всех читателей**, которая показывается всегда рядом с картинкой.

Часто оба нужны:
\`\`\`html
<figure>
  <img src="dish.jpg" alt="Тарелка с борщом">
  <figcaption>Готовый борщ — фото автора.</figcaption>
</figure>
\`\`\`

## 🛠️ Задание

Сделай:

- \`<figure>\` с:
  - \`<img src="https://example.com/borsch.jpg" alt="Тарелка борща">\`
  - \`<figcaption>\` с текстом \`Рис. 1. Готовый борщ.\``,
  starterCode: `<!-- figure с img и figcaption -->
`,
  solution: `<figure>
  <img src="https://example.com/borsch.jpg" alt="Тарелка борща">
  <figcaption>Рис. 1. Готовый борщ.</figcaption>
</figure>`,
  tests: [
    { kind: "exists", selector: "figure", description: "Есть <figure>" },
    { kind: "exists", selector: "figure img", description: "Внутри <figure> есть <img>" },
    { kind: "attr", selector: "figure img", name: "alt", equals: "Тарелка борща", description: 'У <img> правильный alt' },
    { kind: "exists", selector: "figure figcaption", description: "Внутри <figure> есть <figcaption>" },
    { kind: "textContains", selector: "figcaption", contains: "Готовый борщ", description: 'В <figcaption> упоминается "Готовый борщ"' },
  ],
  hints: [
    "<figure> снаружи. Внутри <img> и <figcaption> по очереди.",
    "Шаблон: <figure><img src=\"...\" alt=\"...\"><figcaption>...</figcaption></figure>",
    'Полное решение:\n```html\n<figure>\n  <img src="https://example.com/borsch.jpg" alt="Тарелка борща">\n  <figcaption>Рис. 1. Готовый борщ.</figcaption>\n</figure>\n```',
  ],
  isAvailable: true,
};

export default lesson;
