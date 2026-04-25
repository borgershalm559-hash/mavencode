import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "Подключение CSS — тег <style>",
  order: 2,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# Подключение CSS — тег \`<style>\`

## 🎯 После этого урока ты сможешь
- Подключать CSS прямо в HTML-документе
- Понимать три способа подключения

## 📚 Теория

### Три способа подключить CSS

**1. Тег \`<style>\` в \`<head>\`** — пишешь CSS прямо в HTML-файле:

\`\`\`html
<head>
  <style>
    h1 { color: red; }
  </style>
</head>
<body>
  <h1>Привет</h1>   <!-- будет красным -->
</body>
\`\`\`

Удобно для маленьких страниц или когда стили специфичны для одной страницы.

**2. Внешний файл \`.css\` через \`<link>\`** — самый частый способ на реальных сайтах:

\`\`\`html
<head>
  <link rel="stylesheet" href="style.css">
</head>
\`\`\`

В файле \`style.css\` лежит CSS. Преимущества: один файл стилей на много страниц, кэшируется браузером.

**3. Inline-стиль через атрибут \`style\`** — прямо на одном элементе:

\`\`\`html
<h1 style="color: red;">Привет</h1>
\`\`\`

Применяется только к этому конкретному элементу. **Используй редко** — стили смешиваются с HTML, плохо переиспользуется.

### В этом курсе используем \`<style>\`

В уроках курса будем писать CSS прямо в \`<style>\` внутри \`<head>\`. Это удобно — всё в одном файле для проверки.

В реальных проектах ты потом будешь использовать внешние \`.css\`-файлы, но техника написания CSS одна и та же.

## 🛠️ Задание

Сделай страничку с заголовком и стилем:

- В \`<head>\` — тег \`<style>\` с правилом \`h1 { color: red; }\`
- В \`<body>\` — тег \`<h1>\` с текстом \`Привет\`

Превью покажет красный заголовок.`,
  starterCode: `<!doctype html>
<html>
<head>
  <!-- тег <style> с правилом h1 { color: red; } -->
</head>
<body>
  <!-- h1 со словом Привет -->
</body>
</html>
`,
  solution: `<!doctype html>
<html>
<head>
  <style>
    h1 { color: red; }
  </style>
</head>
<body>
  <h1>Привет</h1>
</body>
</html>`,
  tests: [
    { kind: "exists", selector: "head style", description: "В <head> есть тег <style>" },
    { kind: "exists", selector: "body h1", description: "В <body> есть <h1>" },
    { kind: "text", selector: "h1", equals: "Привет", description: '<h1> содержит "Привет"' },
    { kind: "style", selector: "h1", property: "color", equals: "red", description: "У <h1> цвет красный" },
  ],
  hints: [
    "Внутри <head> ставишь <style>...</style>. Внутри стиля — h1 { color: red; }. В <body> — обычный <h1>Привет</h1>.",
    "Шаблон: <style>h1 { color: red; }</style>. Не забудь ; в конце объявления и закрыть </style>.",
    "Полное решение — см. в задании выше.",
  ],
  isAvailable: true,
};

export default lesson;
