import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "<iframe> — встраивание чужой страницы",
  order: 24,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# \`<iframe>\` — встраивание чужой страницы

## 🎯 После этого урока ты сможешь
- Встраивать чужой контент на свою страницу
- Понимать ограничения и риски

## 📚 Теория

### Что такое \`<iframe>\`

\`<iframe>\` — это **окошко в другую страницу** прямо внутри твоей. Самые частые применения:
- YouTube-видео
- Карта (Яндекс.Карты, Google Maps)
- Калькуляторы, виджеты
- Документы Google Docs

\`\`\`html
<iframe
  src="https://www.youtube.com/embed/VIDEO_ID"
  width="560"
  height="315"
  title="Видео с YouTube">
</iframe>
\`\`\`

- \`src\` — URL встраиваемой страницы
- \`width\`, \`height\` — размер окошка
- \`title\` — **обязателен** для доступности (скринридер озвучит)

### Закрывающий тег обязателен

В отличие от \`<img>\`, \`<iframe>\` имеет **закрывающий тег**, даже если тело пустое:

\`\`\`html
<iframe src="..." title="..."></iframe>
\`\`\`

### Безопасность: \`sandbox\`

Если ты встраиваешь чужой непроверенный контент — атрибут \`sandbox\` ограничивает что **может** делать встроенная страница:

\`\`\`html
<iframe src="https://untrusted.com" sandbox></iframe>
\`\`\`

Пустой \`sandbox\` запрещает всё (скрипты, формы, навигацию). Можно открыть отдельные разрешения: \`sandbox="allow-scripts"\`, \`sandbox="allow-forms"\`.

### \`loading="lazy"\` для производительности

Если \`<iframe>\` ниже первого экрана и грузится только когда пользователь доскроллит:

\`\`\`html
<iframe src="..." title="..." loading="lazy"></iframe>
\`\`\`

Экономит трафик и время загрузки страницы.

### Не злоупотребляй

\`<iframe>\` тяжёлый: загружает **полноценную чужую страницу** со всеми её скриптами и стилями. Один-два iframe — норма. Десять iframe на странице — медленный сайт.

## 🛠️ Задание

Встрой YouTube-видео:

- \`<iframe>\` с:
  - \`src="https://www.youtube.com/embed/dQw4w9WgXcQ"\`
  - \`width="560"\`
  - \`height="315"\`
  - \`title="Видеоурок"\``,
  starterCode: `<!-- iframe с YouTube -->
`,
  solution: `<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" width="560" height="315" title="Видеоурок"></iframe>`,
  tests: [
    { kind: "exists", selector: "iframe", description: "Есть <iframe>" },
    { kind: "attr", selector: "iframe", name: "src", equals: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "src на YouTube" },
    { kind: "attr", selector: "iframe", name: "width", equals: "560", description: 'width="560"' },
    { kind: "attr", selector: "iframe", name: "height", equals: "315", description: 'height="315"' },
    { kind: "attr", selector: "iframe", name: "title", equals: "Видеоурок", description: 'title="Видеоурок"' },
  ],
  hints: [
    "<iframe> с четырьмя атрибутами: src, width, height, title. Закрывающий тег </iframe> обязателен.",
    "Шаблон: <iframe src=\"...\" width=\"...\" height=\"...\" title=\"...\"></iframe>",
    'Полное решение:\n```html\n<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" width="560" height="315" title="Видеоурок"></iframe>\n```',
  ],
  isAvailable: true,
};

export default lesson;
