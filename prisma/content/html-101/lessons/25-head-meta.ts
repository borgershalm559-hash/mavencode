import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "Шапка документа: <title>, <meta charset>, <meta viewport>",
  order: 25,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# Шапка документа: \`<title>\`, \`<meta charset>\`, \`<meta viewport>\`

## 🎯 После этого урока ты сможешь
- Делать правильную шапку любой HTML-страницы
- Понимать каждый из мета-тегов

## 📚 Теория

### \`<title>\` — название во вкладке

\`<title>\` — это **название страницы**. Что увидишь во вкладке браузера, когда страница загружена. Что попадёт в закладки. Что покажется в результатах поиска.

\`\`\`html
<title>Кулинарный блог — рецепт борща</title>
\`\`\`

Хороший \`<title>\`:
- Уникальный для каждой страницы (не «Главная» на всех)
- Описывает содержимое (что найдёшь на этой странице)
- Не слишком длинный (~50-60 символов)

### \`<meta charset="utf-8">\` — кодировка

**Кодировка** — это правила «как переводить байты в файле в буквы на экране». Если страница на русском а кодировка указана английская — увидишь «крякозябры» (нечитаемые символы).

\`\`\`html
<meta charset="utf-8">
\`\`\`

\`utf-8\` — современная универсальная кодировка, понимает русский, китайский, арабский, эмодзи. **Всегда используй \`utf-8\`** на любом сайте.

\`<meta charset>\` — самозакрывающийся тег без содержимого, как \`<br>\` или \`<img>\`.

### \`<meta name="viewport">\` — мобильные устройства

На телефоне страница без \`viewport\` будет отображаться **в очень мелком масштабе** (как «открыли десктопную страницу» — текст крошечный).

\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1">
\`\`\`

Что это значит:
- \`width=device-width\` — «ширина страницы равна ширине экрана» (а не 980 пикселей по умолчанию)
- \`initial-scale=1\` — «при загрузке масштаб 100%, ничего не зумь автоматически»

**Без этой строки сайт на телефоне выглядит как мини-копия десктопной версии.** Эту строчку добавляют **на любую страницу**.

### Полная шапка-минимум

\`\`\`html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Название страницы</title>
</head>
\`\`\`

Это **минимум** для любой современной страницы. На реальных сайтах внутри \`<head>\` ещё много чего (фавикон, описание, OG-теги, подключение CSS) — это уже частности.

## 🛠️ Задание

Сделай полную шапку:

\`\`\`html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Моя страница</title>
</head>
\`\`\`

Без \`<body>\`, без \`<!doctype>\` — только \`<head>\` блок (для теста).`,
  starterCode: `<head>
  <!-- meta charset, meta viewport, title -->
</head>
`,
  solution: `<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Моя страница</title>
</head>`,
  tests: [
    { kind: "exists", selector: "head", description: "Есть <head>" },
    { kind: "attr", selector: "meta[charset]", name: "charset", equals: "utf-8", description: '<meta charset="utf-8">' },
    { kind: "attr", selector: 'meta[name="viewport"]', name: "content", equals: "width=device-width, initial-scale=1", description: '<meta name="viewport" content="width=device-width, initial-scale=1">' },
    { kind: "text", selector: "title", equals: "Моя страница", description: '<title>Моя страница</title>' },
  ],
  hints: [
    "Три тега внутри <head>: <meta charset=\"utf-8\">, <meta name=\"viewport\" content=\"...\">, <title>...</title>.",
    "Атрибут viewport: name=\"viewport\" content=\"width=device-width, initial-scale=1\". Точно по шаблону.",
    'Полное решение:\n```html\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>Моя страница</title>\n</head>\n```',
  ],
  isAvailable: true,
};

export default lesson;
