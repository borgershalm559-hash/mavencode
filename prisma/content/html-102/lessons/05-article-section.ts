import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "<article> и <section>",
  order: 5,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# \`<article>\` и \`<section>\`

## 🎯 После этого урока ты сможешь
- Различать \`<article>\` и \`<section>\`
- Использовать каждый правильно

## 📚 Теория

### \`<article>\` — самостоятельный кусок

\`<article>\` — это **самостоятельная единица содержимого**, которая имеет смысл сама по себе. Можно её скопировать на другой сайт — и она останется осмысленной.

Что бывает \`<article>\`:
- Пост в блоге
- Карточка товара в магазине
- Комментарий пользователя
- Новость
- Видео-ролик с описанием

\`\`\`html
<article>
  <h2>Как заварить идеальный чай</h2>
  <p>Вода 90 градусов, 3 минуты настаивания...</p>
</article>
\`\`\`

### \`<section>\` — раздел внутри чего-то

\`<section>\` — это **тематический раздел** внутри страницы или статьи. **Не самостоятельный** — имеет смысл только в контексте.

Что бывает \`<section>\`:
- Глава статьи
- Блок «О нас» на лендинге
- Раздел «Ингредиенты» в рецепте
- Раздел «Отзывы» внутри страницы товара

\`\`\`html
<article>
  <h2>Рецепт борща</h2>
  <section>
    <h3>Ингредиенты</h3>
    <ul>...</ul>
  </section>
  <section>
    <h3>Приготовление</h3>
    <ol>...</ol>
  </section>
</article>
\`\`\`

### Главное правило выбора

Спроси себя: **«Если вырвать этот блок и поставить отдельно — он останется осмысленным?»**
- **Да** → \`<article>\` (пост, новость, отзыв)
- **Нет, нужен контекст вокруг** → \`<section>\` (глава, раздел)

### Каждый \`<article>\` и \`<section>\` имеет свой заголовок

Внутри обычно есть \`<h1>\`–\`<h6>\` — это название этого блока.

## 🛠️ Задание

Сделай статью с двумя разделами:

- \`<article>\`:
  - \`<h2>Рецепт борща</h2>\`
  - \`<section>\` с \`<h3>Ингредиенты</h3>\` + \`<p>Свёкла, капуста, картошка.</p>\`
  - \`<section>\` с \`<h3>Приготовление</h3>\` + \`<p>Варить 30 минут.</p>\``,
  starterCode: `<!-- article с двумя section внутри -->
`,
  solution: `<article>
  <h2>Рецепт борща</h2>
  <section>
    <h3>Ингредиенты</h3>
    <p>Свёкла, капуста, картошка.</p>
  </section>
  <section>
    <h3>Приготовление</h3>
    <p>Варить 30 минут.</p>
  </section>
</article>`,
  tests: [
    { kind: "exists", selector: "article", description: "Есть <article>" },
    { kind: "exists", selector: "article h2", description: "Внутри <article> есть <h2>" },
    { kind: "count", selector: "article section", n: 2, description: "В <article> два <section>" },
    { kind: "count", selector: "section h3", n: 2, description: "В каждом <section> есть <h3>" },
    { kind: "textContains", selector: "article", contains: "Свёкла", description: 'В одном из section есть "Свёкла"' },
  ],
  hints: [
    "<article> снаружи. Внутри него <h2> и две <section>. В каждой <section> — <h3> и <p>.",
    "Структура: <article><h2>...</h2><section><h3>...</h3><p>...</p></section><section>...</section></article>",
    'Полное решение:\n```html\n<article>\n  <h2>Рецепт борща</h2>\n  <section>\n    <h3>Ингредиенты</h3>\n    <p>Свёкла, капуста, картошка.</p>\n  </section>\n  <section>\n    <h3>Приготовление</h3>\n    <p>Варить 30 минут.</p>\n  </section>\n</article>\n```',
  ],
  isAvailable: true,
};

export default lesson;
