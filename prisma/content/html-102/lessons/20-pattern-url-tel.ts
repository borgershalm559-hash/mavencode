import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: 'Валидация: pattern, type="url", type="tel"',
  order: 20,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# Валидация: \`pattern\`, \`type="url"\`, \`type="tel"\`

## 🎯 После этого урока ты сможешь
- Проверять формат через регулярное выражение
- Использовать специализированные типы

## 📚 Теория

### \`type="url"\`

Поле для URL. Браузер проверяет что введён валидный URL (начинается с \`http://\` или \`https://\`):

\`\`\`html
<input type="url" name="website" placeholder="https://example.com">
\`\`\`

### \`type="tel"\`

Поле для телефона. **Не валидирует формат** (телефоны бывают разные), но на мобильных показывает **цифровую клавиатуру**:

\`\`\`html
<input type="tel" name="phone" placeholder="+7 999 123-45-67">
\`\`\`

Чтобы проверить формат — добавляй \`pattern\`.

### \`pattern\` — собственная проверка через регулярку

\`pattern\` — это **регулярное выражение** которое должно совпадать с введённым значением. Если не совпадает — браузер не пропускает.

\`\`\`html
<input type="tel" name="phone" pattern="\\\\+7[0-9]{10}" placeholder="+71234567890">
\`\`\`

Здесь pattern \`\\+7[0-9]{10}\` означает: «\`+7\` и затем ровно 10 цифр». Без знаний регулярок сложно — это тема большая. На этом уроке только общая идея.

### \`title\` для подсказки

Когда pattern не совпадает, браузер показывает **дефолтное сообщение**. Чтобы дать понятную подсказку — добавь атрибут \`title\`:

\`\`\`html
<input type="tel" name="phone"
  pattern="\\\\+7[0-9]{10}"
  title="Формат: +7 и 10 цифр без пробелов">
\`\`\`

### Полезные простые pattern

| Шаблон | Что значит |
|--------|------------|
| \`[0-9]{4}\` | Ровно 4 цифры |
| \`[a-z]+\` | Одна или больше строчных латинских букв |
| \`.{8,}\` | Минимум 8 любых символов |
| \`[А-Яа-яЁё ]+\` | Только русские буквы и пробелы |

## 🛠️ Задание

Сделай форму:

- \`<form>\`:
  - \`<input type="url" name="website" required>\` — URL обязателен
  - \`<input type="tel" name="phone" pattern="[0-9]{10}" title="10 цифр">\` — 10 цифр
  - \`<button type="submit">OK</button>\``,
  starterCode: `<!-- Форма с url, tel и pattern -->
`,
  solution: `<form>
  <input type="url" name="website" required>
  <input type="tel" name="phone" pattern="[0-9]{10}" title="10 цифр">
  <button type="submit">OK</button>
</form>`,
  tests: [
    { kind: "exists", selector: 'input[type="url"]', description: 'Есть <input type="url">' },
    { kind: "exists", selector: 'input[type="tel"]', description: 'Есть <input type="tel">' },
    { kind: "attr", selector: 'input[type="tel"]', name: "pattern", equals: "[0-9]{10}", description: 'У <input type="tel"> pattern="[0-9]{10}"' },
    { kind: "attrExists", selector: 'input[type="url"]', name: "required", description: "У URL-поля есть required" },
  ],
  hints: [
    "<input type=\"url\"> и <input type=\"tel\"> — два разных поля. У второго добавь pattern.",
    "Шаблон: <input type=\"tel\" name=\"phone\" pattern=\"[0-9]{10}\" title=\"10 цифр\">",
    "Полное решение — см. в задании выше.",
  ],
  isAvailable: true,
};

export default lesson;
