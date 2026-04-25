import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "Финал-проект: стилизация рецепта",
  order: 30,
  type: "code",
  language: "html",
  xpReward: 200,
  content: `# Финал-проект: стилизация рецепта

## 🎉 Поздравляю — последний урок CSS 101!

За 29 уроков ты освоил подключение, селекторы, цвета, типографику, юниты, box-model и display. Время **стилизовать рецепт** — взять разметку из HTML 101 и довести до приличного вида.

## 🎯 Что нужно сделать

В стартовом коде уже готовый HTML рецепта (упрощённая версия из HTML 101). Тебе нужно **дописать CSS** в \`<style>\` чтобы страница имела:

## 📋 Обязательные стили

### 1. Базовая типографика для \`body\`
- \`font-family: "Helvetica", "Arial", sans-serif\`
- \`color: #333\`
- \`line-height: 1.6\`
- \`max-width: 720px\`
- \`margin: 0 auto\` (центрирование)
- \`padding: 24px\`

### 2. Заголовок \`h1\`
- \`color: #c2410c\` (тёплый оранжевый)
- \`font-size: 32px\`

### 3. Заголовки \`h2\`
- \`color: #1e293b\` (тёмно-синий)
- \`border-bottom: 2px solid #e5e7eb\`
- \`padding-bottom: 8px\`

### 4. Блок цитаты \`.quote\`
- \`font-style: italic\`
- \`color: #6b7280\`
- \`border-left: 4px solid #c2410c\`
- \`padding-left: 16px\`

### 5. Кнопка \`.btn\`
- \`display: inline-block\`
- \`padding: 12px 24px\`
- \`background: #c2410c\`
- \`color: white\`
- \`border-radius: 6px\`
- \`text-decoration: none\`

## 🚀 Поехали!

Превью покажет результат вживую. После этого урока — **200 XP** и завершение CSS 101.`,
  starterCode: `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <title>Рецепт борща</title>
  <style>
    /* Сюда напиши стили */

  </style>
</head>
<body>
  <h1>Классический борщ</h1>

  <p class="quote">Борщ хорош тем, что на второй день он ещё лучше.</p>

  <h2>Ингредиенты</h2>
  <ul>
    <li>Свёкла — 2 шт.</li>
    <li>Капуста — 300 г</li>
    <li>Картошка — 4 шт.</li>
  </ul>

  <h2>Приготовление</h2>
  <ol>
    <li>Нарезать овощи.</li>
    <li>Обжарить лук с морковью.</li>
    <li>Залить водой и варить 30 минут.</li>
  </ol>

  <a href="#" class="btn">Распечатать рецепт</a>
</body>
</html>
`,
  solution: `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <title>Рецепт борща</title>
  <style>
    body {
      font-family: "Helvetica", "Arial", sans-serif;
      color: #333;
      line-height: 1.6;
      max-width: 720px;
      margin: 0 auto;
      padding: 24px;
    }
    h1 {
      color: #c2410c;
      font-size: 32px;
    }
    h2 {
      color: #1e293b;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 8px;
    }
    .quote {
      font-style: italic;
      color: #6b7280;
      border-left: 4px solid #c2410c;
      padding-left: 16px;
    }
    .btn {
      display: inline-block;
      padding: 12px 24px;
      background: #c2410c;
      color: white;
      border-radius: 6px;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <h1>Классический борщ</h1>
  <p class="quote">Борщ хорош тем, что на второй день он ещё лучше.</p>
  <h2>Ингредиенты</h2>
  <ul>
    <li>Свёкла — 2 шт.</li>
    <li>Капуста — 300 г</li>
    <li>Картошка — 4 шт.</li>
  </ul>
  <h2>Приготовление</h2>
  <ol>
    <li>Нарезать овощи.</li>
    <li>Обжарить лук с морковью.</li>
    <li>Залить водой и варить 30 минут.</li>
  </ol>
  <a href="#" class="btn">Распечатать рецепт</a>
</body>
</html>`,
  tests: [
    { kind: "styleContains", selector: "body", property: "font-family", contains: "Helvetica", description: "✓ body font-family включает Helvetica" },
    { kind: "style", selector: "body", property: "max-width", equals: "720px", description: "✓ body max-width 720px" },
    { kind: "style", selector: "h1", property: "color", equals: "#c2410c", description: "✓ h1 цвет #c2410c" },
    { kind: "style", selector: "h1", property: "font-size", equals: "32px", description: "✓ h1 font-size 32px" },
    { kind: "style", selector: "h2", property: "color", equals: "#1e293b", description: "✓ h2 цвет #1e293b" },
    { kind: "style", selector: "h2", property: "border-bottom-width", equals: "2px", description: "✓ h2 border-bottom 2px" },
    { kind: "style", selector: ".quote", property: "font-style", equals: "italic", description: "✓ .quote курсив" },
    { kind: "style", selector: ".quote", property: "border-left-width", equals: "4px", description: "✓ .quote border-left 4px" },
    { kind: "style", selector: ".btn", property: "display", equals: "inline-block", description: "✓ .btn inline-block" },
    { kind: "style", selector: ".btn", property: "border-radius", equals: "6px", description: "✓ .btn border-radius 6px" },
    { kind: "style", selector: ".btn", property: "background-color", equals: "#c2410c", description: "✓ .btn background #c2410c" },
  ],
  hints: [
    "Иди по чек-листу из задания. Каждый блок — это одно правило в <style>. Превью покажет результат сразу.",
    "Шаблон одного правила: селектор { свойство: значение; }. Несколько свойств через ; и перенос строки.",
    "Полное решение — в подсказке 3. Сравни своё со скелетом, найди отличия.",
  ],
  isAvailable: true,
};

export default lesson;
