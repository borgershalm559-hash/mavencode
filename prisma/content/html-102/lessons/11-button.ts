import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "<button> — кнопки формы",
  order: 11,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# \`<button>\` — кнопки формы

## 🎯 После этого урока ты сможешь
- Делать кнопку отправки формы
- Различать \`type="submit"\`, \`reset\`, \`button\`

## 📚 Теория

### \`<button>\` отправляет форму

Самый частый сценарий — кнопка которая **отправляет форму** на сервер:

\`\`\`html
<form action="/login">
  <input type="text" name="email">
  <button type="submit">Войти</button>
</form>
\`\`\`

При клике на \`<button type="submit">\` форма автоматически отправляется на \`action\`.

### Три значения \`type\` у кнопки

- **\`type="submit"\`** — отправляет форму. Это **значение по умолчанию** — если \`type\` не указан, кнопка submit.
- **\`type="reset"\`** — очищает все поля формы (возвращает к начальным значениям).
- **\`type="button"\`** — обычная кнопка БЕЗ автоматического действия. Нужна если ты будешь обрабатывать клик через JavaScript.

\`\`\`html
<button type="submit">Сохранить</button>
<button type="reset">Сбросить</button>
<button type="button">Открыть подсказку</button>
\`\`\`

### Без \`type\` — это submit

\`<button>Отправить</button>\` — внутри формы это \`submit\`. Если ты этого не хочешь — **обязательно** указывай \`type="button"\`.

### Текст внутри \`<button>\`

В отличие от \`<input type="submit">\` (где текст в \`value\`), у \`<button>\` текст пишется **между тегами**. Можно даже вставить иконку или другой HTML:

\`\`\`html
<button type="submit">
  <span>💾</span> Сохранить
</button>
\`\`\`

### \`<input type="submit">\` тоже работает

Старый способ — кнопка через \`<input>\`:

\`\`\`html
<input type="submit" value="Отправить">
\`\`\`

Работает, но **\`<button>\` гибче и предпочтительнее** в современном HTML.

## 🛠️ Задание

Сделай форму с кнопкой отправки:

- \`<form action="/submit">\` с:
  - \`<input type="text" name="email">\`
  - \`<button type="submit">Отправить</button>\``,
  starterCode: `<!-- form с input и button submit -->
`,
  solution: `<form action="/submit">
  <input type="text" name="email">
  <button type="submit">Отправить</button>
</form>`,
  tests: [
    { kind: "exists", selector: "form button", description: "В форме есть <button>" },
    { kind: "attr", selector: "button", name: "type", equals: "submit", description: 'У <button> type="submit"' },
    { kind: "text", selector: "button", equals: "Отправить", description: 'Текст кнопки — "Отправить"' },
    { kind: "exists", selector: "form input[name='email']", description: "В форме есть <input name='email'>" },
  ],
  hints: [
    "Внутри <form>: <input> и <button>. Тип кнопки — submit.",
    "Шаблон: <form action=\"/submit\"><input type=\"text\" name=\"email\"><button type=\"submit\">Отправить</button></form>",
    'Полное решение:\n```html\n<form action="/submit">\n  <input type="text" name="email">\n  <button type="submit">Отправить</button>\n</form>\n```',
  ],
  isAvailable: true,
};

export default lesson;
