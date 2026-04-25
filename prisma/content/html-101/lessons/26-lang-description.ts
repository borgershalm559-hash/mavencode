import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "lang и meta description — SEO-базис",
  order: 26,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# \`lang\` и \`meta description\` — SEO-базис

## 🎯 После этого урока ты сможешь
- Указывать язык страницы
- Писать описание для поисковика

## 📚 Теория

### \`lang\` на \`<html>\`

Атрибут \`lang\` в \`<html>\` указывает **на каком языке страница**:

\`\`\`html
<html lang="ru">
\`\`\`

Зачем:
- **Скринридеры** выбирают правильное произношение (русское, английское, китайское — каждое своё)
- **Браузеры** правильно делают переносы слов и проверку правописания
- **Поисковики** понимают для какого региона страница

Если страница на русском — \`lang="ru"\`. На английском — \`lang="en"\`. Двухбуквенные коды стандарта ISO 639-1.

### \`<meta name="description">\` — описание для поисковика

В \`<head>\` можно добавить **описание страницы**:

\`\`\`html
<meta name="description" content="Лучший борщ за 30 минут. Простой рецепт с пошаговыми фотографиями.">
\`\`\`

Это **не показывается** на самой странице. Зато:
- Google и Яндекс выводят это описание **под названием** в результатах поиска
- Когда страницу шарят в мессенджере — описание показывается под превью

Хороший description:
- 120-160 символов
- Уникальный для каждой страницы
- Описывает что найдёт человек

### \`<meta name="keywords">\` — устарело

В старых уроках видишь \`<meta name="keywords" content="борщ, рецепт, кулинария">\`. **Не пиши его** — поисковики уже 15 лет его игнорируют (его слишком злоупотребляли). Современный SEO работает через \`<title>\`, \`<description>\` и осмысленную структуру страницы.

## 🛠️ Задание

Сделай корректную верхушку HTML-документа с языком и описанием:

\`\`\`html
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <meta name="description" content="Лучший борщ за 30 минут">
    <title>Рецепт борща</title>
  </head>
</html>
\`\`\``,
  starterCode: `<html>
  <head>
    <!-- charset, description, title -->
  </head>
</html>
`,
  solution: `<html lang="ru">
  <head>
    <meta charset="utf-8">
    <meta name="description" content="Лучший борщ за 30 минут">
    <title>Рецепт борща</title>
  </head>
</html>`,
  tests: [
    { kind: "attr", selector: "html", name: "lang", equals: "ru", description: '<html lang="ru">' },
    { kind: "attr", selector: 'meta[name="description"]', name: "content", equals: "Лучший борщ за 30 минут", description: '<meta name="description"> с правильным content' },
    { kind: "text", selector: "title", equals: "Рецепт борща", description: '<title>Рецепт борща</title>' },
  ],
  hints: [
    "Три изменения: 1) добавь lang=\"ru\" к <html>, 2) добавь <meta name=\"description\" content=\"...\">, 3) поставь правильный <title>.",
    "Атрибут lang ставится прямо на <html>: <html lang=\"ru\">. <meta name=\"description\" content=\"...\"> — отдельный самозакрывающийся тег.",
    'Полное решение:\n```html\n<html lang="ru">\n  <head>\n    <meta charset="utf-8">\n    <meta name="description" content="Лучший борщ за 30 минут">\n    <title>Рецепт борща</title>\n  </head>\n</html>\n```',
  ],
  isAvailable: true,
};

export default lesson;
