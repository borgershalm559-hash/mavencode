import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "Финал-проект: Контактная страница",
  order: 26,
  type: "code",
  language: "html",
  xpReward: 200,
  content: `# Финал-проект: Контактная страница

## 🎉 Поздравляю — последний урок HTML 102!

За 25 уроков ты освоил семантику, формы и мультимедиа. Время собрать всё в одну страницу — **контактную страницу с формой обратной связи**.

## 🎯 Что нужно сделать

Сверстай страницу «Контакты» используя:
- Семантические разделы (\`<header>\`, \`<main>\`, \`<footer>\`, \`<nav>\`)
- Полноценную форму обратной связи с валидацией
- Все изученные техники

## 📋 Обязательные элементы

### 1. \`<header>\` с навигацией
- Внутри \`<h1>\` с названием сайта
- \`<nav>\` со списком \`<ul>\` минимум из 2 ссылок

### 2. \`<main>\` с заголовком и формой
- Внутри \`<h2>\` (например «Свяжитесь с нами»)
- \`<form>\` (см. ниже)

### 3. Форма обратной связи внутри \`<main>\`
Форма должна содержать:
- \`<label>\` + \`<input type="email" required>\` (с правильным for+id)
- \`<label>\` + \`<input type="tel">\`
- \`<label>\` + \`<textarea required minlength="10">\` для сообщения
- Радиогруппа из минимум 2 \`<input type="radio">\` с одинаковым \`name\` (например тема обращения)
- \`<input type="checkbox" required>\` — согласие с обработкой данных
- \`<button type="submit">\` для отправки

### 4. \`<footer>\`
- Внутри \`<p>\` с копирайтом

## 💡 Подсказки

- Каждое поле формы — со своим \`<label>\` через \`for\`+\`id\`
- Используй \`<fieldset>\`+\`<legend>\` для радиогруппы
- Превью справа поможет увидеть результат вживую

## 🚀 Поехали!

После этого урока ты получишь **200 XP** и завершишь второй курс веб-трека. Следующий — CSS 101.`,
  starterCode: `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <title>Контакты</title>
</head>
<body>
  <!-- 1. <header> с <h1> и <nav> -->

  <!-- 2. <main> с <h2> и формой -->

  <!-- 3. <footer> с <p> -->
</body>
</html>
`,
  solution: `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <title>Контакты</title>
</head>
<body>
  <header>
    <h1>MavenCode</h1>
    <nav>
      <ul>
        <li><a href="/">Главная</a></li>
        <li><a href="/contact">Контакты</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <h2>Свяжитесь с нами</h2>
    <form action="/contact" method="post">
      <label for="email">Email:</label>
      <input type="email" id="email" name="email" required>

      <label for="phone">Телефон:</label>
      <input type="tel" id="phone" name="phone">

      <label for="message">Сообщение:</label>
      <textarea id="message" name="message" required minlength="10" rows="5"></textarea>

      <fieldset>
        <legend>Тема обращения:</legend>
        <input type="radio" name="topic" value="support" id="t-support" checked>
        <label for="t-support">Поддержка</label>
        <input type="radio" name="topic" value="suggest" id="t-suggest">
        <label for="t-suggest">Предложение</label>
      </fieldset>

      <input type="checkbox" name="consent" id="consent" required>
      <label for="consent">Согласен с обработкой персональных данных</label>

      <button type="submit">Отправить</button>
    </form>
  </main>

  <footer>
    <p>© 2026 MavenCode</p>
  </footer>
</body>
</html>`,
  tests: [
    { kind: "exists", selector: "header h1", description: "✓ В <header> есть <h1>" },
    { kind: "exists", selector: "header nav ul li a", description: "✓ В <nav> есть <ul> со ссылками" },
    { kind: "exists", selector: "main h2", description: "✓ В <main> есть <h2>" },
    { kind: "exists", selector: "main form", description: "✓ В <main> есть <form>" },
    { kind: "exists", selector: 'form input[type="email"][required]', description: "✓ Email-поле обязательное" },
    { kind: "exists", selector: 'form input[type="tel"]', description: "✓ Поле телефона" },
    { kind: "attrExists", selector: "form textarea[required]", name: "minlength", description: "✓ <textarea> с required и minlength" },
    { kind: "exists", selector: "fieldset legend", description: "✓ Есть <fieldset> с <legend>" },
    { kind: "count", selector: 'fieldset input[type="radio"]', n: 2, description: "✓ Минимум 2 радиокнопки в <fieldset>" },
    { kind: "exists", selector: 'form input[type="checkbox"][required]', description: "✓ Есть обязательный чекбокс согласия" },
    { kind: "exists", selector: 'form button[type="submit"]', description: "✓ Кнопка submit" },
    { kind: "exists", selector: "footer p", description: "✓ В <footer> есть <p>" },
  ],
  hints: [
    "Иди по чек-листу из задания. Каждый пункт — это конкретный набор тегов. Стартовый код — каркас, замени комментарии нужным HTML.",
    "Для радиогруппы — у всех радио ОДИНАКОВЫЙ name. Связывай <label> с <input> через for+id (имена не обязательно осмысленные, главное чтобы совпадали).",
    "Полный пример решения смотри в подсказке 3 — это скелет который пройдёт все тесты. Сравни структуру со своим кодом.",
  ],
  isAvailable: true,
};

export default lesson;
