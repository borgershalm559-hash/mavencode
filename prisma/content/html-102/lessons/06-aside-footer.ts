import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "<aside> и <footer>",
  order: 6,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# \`<aside>\` и \`<footer>\`

## 🎯 После этого урока ты сможешь
- Делать боковые блоки с дополнительной информацией
- Делать подвал страницы

## 📚 Теория

### \`<aside>\` — побочное содержимое

\`<aside>\` — это содержимое **рядом с основным**, **косвенно связанное** с ним. На сайтах это часто **боковая колонка**.

Что попадает в \`<aside>\`:
- «Похожие статьи»
- «Популярные посты»
- Виджет рекламы
- Биография автора рядом со статьёй
- Цитата-врезка внутри длинной статьи

\`\`\`html
<main>
  <article>
    <h2>Статья про чай</h2>
    <p>...</p>
    <aside>
      <h3>Об авторе</h3>
      <p>Иван — профессиональный чайный мастер.</p>
    </aside>
  </article>
</main>
\`\`\`

\`<aside>\` визуально может стоять справа/слева/внутри статьи — где удобно. Главное смысловое: «это не главное, это дополнение».

### \`<footer>\` — подвал

\`<footer>\` — это **завершающая часть** страницы или раздела. На уровне всей страницы — это типичный «подвал сайта»:

\`\`\`html
<footer>
  <p>© 2026 MavenCode. Все права защищены.</p>
  <nav>
    <a href="/contacts">Контакты</a>
    <a href="/privacy">Политика конфиденциальности</a>
  </nav>
</footer>
\`\`\`

Что обычно в \`<footer>\` сайта:
- Копирайт
- Ссылки на «Контакты», «Политика», «О нас»
- Соцсети
- Юридическая информация

### \`<footer>\` тоже бывает локальный

Как у \`<header>\`: \`<footer>\` может быть **внутри \`<article>\`** — тогда это «подвал статьи»:

\`\`\`html
<article>
  <h2>Пост</h2>
  <p>Текст...</p>
  <footer>
    <p>Опубликовано: <time datetime="2026-04-25">25 апреля</time></p>
    <p>Автор: Иван</p>
  </footer>
</article>
\`\`\`

## 🛠️ Задание

Сделай разметку:

- \`<main>\`:
  - \`<article>\`:
    - \`<h2>Заголовок</h2>\`
    - \`<p>Текст статьи.</p>\`
    - \`<aside>\`:
      - \`<h3>Похожие статьи</h3>\`
      - \`<p>См. также: HTML 101.</p>\`
- \`<footer>\` (вне main):
  - \`<p>© 2026 MavenCode</p>\``,
  starterCode: `<!-- main с article+aside и footer снаружи -->
`,
  solution: `<main>
  <article>
    <h2>Заголовок</h2>
    <p>Текст статьи.</p>
    <aside>
      <h3>Похожие статьи</h3>
      <p>См. также: HTML 101.</p>
    </aside>
  </article>
</main>
<footer>
  <p>© 2026 MavenCode</p>
</footer>`,
  tests: [
    { kind: "exists", selector: "main article aside", description: "<aside> внутри <article> внутри <main>" },
    { kind: "exists", selector: "aside h3", description: "В <aside> есть <h3>" },
    { kind: "textContains", selector: "aside", contains: "Похожие статьи", description: '<aside> про похожие статьи' },
    { kind: "exists", selector: "footer", description: "Есть <footer>" },
    { kind: "textContains", selector: "footer", contains: "MavenCode", description: '<footer> содержит MavenCode' },
  ],
  hints: [
    "<aside> ставится ВНУТРИ <article>. <footer> — снаружи <main>, в самом конце.",
    "Шаблон: <main><article><h2>...</h2><p>...</p><aside>...</aside></article></main><footer>...</footer>",
    "Полное решение — см. в задании выше.",
  ],
  isAvailable: true,
};

export default lesson;
