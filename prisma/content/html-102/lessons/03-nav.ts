import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "<nav> — главная навигация",
  order: 3,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# \`<nav>\` — главная навигация

## 🎯 После этого урока ты сможешь
- Делать главное меню сайта
- Различать что попадает в \`<nav>\`, а что — нет

## 📚 Теория

### Что такое \`<nav>\`

\`<nav>\` — это **главная навигация по сайту**. Не любой набор ссылок, а **основное меню**: разделы сайта, навигация между страницами.

\`\`\`html
<nav>
  <ul>
    <li><a href="/">Главная</a></li>
    <li><a href="/blog">Блог</a></li>
    <li><a href="/about">О нас</a></li>
  </ul>
</nav>
\`\`\`

Список ссылок чаще всего внутри \`<ul>\` — это считается хорошим тоном (на самом деле это семантически правильно: меню это **набор** пунктов).

### Что НЕ кладут в \`<nav>\`

- **Ссылку на источник** в статье — это просто \`<a>\` внутри \`<p>\`, не отдельная навигация.
- **Ссылки в подвале** на страницы «Контакты», «О нас» — иногда заворачивают в \`<nav>\` тоже, но не обязательно. Главное правило: **\`<nav>\` для главных навигационных блоков**.
- **«Хлебные крошки»** (Главная > Курсы > HTML 102) — для них тоже подходит \`<nav>\`, со специальным aria-label.

Если сомневаешься — это **главное меню**? Если да — \`<nav>\`.

### \`<nav>\` обычно внутри \`<header>\`

Самый частый паттерн — главное меню стоит в \`<header>\`:

\`\`\`html
<header>
  <h1>Сайт</h1>
  <nav>
    <ul>
      <li><a href="/">Главная</a></li>
      <li><a href="/about">О нас</a></li>
    </ul>
  </nav>
</header>
\`\`\`

## 🛠️ Задание

Сделай шапку сайта с навигацией:

- \`<header>\`:
  - \`<h1>Сайт</h1>\`
  - \`<nav>\`:
    - \`<ul>\` с тремя \`<li>\`, каждый со ссылкой:
      - \`Главная\` → \`/\`
      - \`Блог\` → \`/blog\`
      - \`О нас\` → \`/about\``,
  starterCode: `<!-- Шапка с навигацией -->
`,
  solution: `<header>
  <h1>Сайт</h1>
  <nav>
    <ul>
      <li><a href="/">Главная</a></li>
      <li><a href="/blog">Блог</a></li>
      <li><a href="/about">О нас</a></li>
    </ul>
  </nav>
</header>`,
  tests: [
    { kind: "exists", selector: "header nav", description: "Внутри <header> есть <nav>" },
    { kind: "exists", selector: "nav ul", description: "Внутри <nav> есть <ul>" },
    { kind: "count", selector: "nav ul li", n: 3, description: "В навигации три пункта <li>" },
    { kind: "count", selector: "nav a", n: 3, description: "Три ссылки <a>" },
    { kind: "attr", selector: 'nav a[href="/blog"]', name: "href", equals: "/blog", description: 'Есть ссылка на /blog' },
  ],
  hints: [
    "Структура: <header><h1>...</h1><nav><ul><li><a href=\"...\">...</a></li>...</ul></nav></header>",
    "Каждый пункт навигации — это <li> с <a> внутри. Три пункта — три <li>.",
    'Полное решение:\n```html\n<header>\n  <h1>Сайт</h1>\n  <nav>\n    <ul>\n      <li><a href="/">Главная</a></li>\n      <li><a href="/blog">Блог</a></li>\n      <li><a href="/about">О нас</a></li>\n    </ul>\n  </nav>\n</header>\n```',
  ],
  isAvailable: true,
};

export default lesson;
