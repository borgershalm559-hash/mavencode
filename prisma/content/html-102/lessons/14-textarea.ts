import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "<textarea> — большое поле для текста",
  order: 14,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# \`<textarea>\` — большое поле для текста

## 🎯 После этого урока ты сможешь
- Делать поля для длинных текстов (комментарии, описания, обращения)
- Управлять размером поля

## 📚 Теория

### Зачем не \`<input>\`

\`<input type="text">\` — **одна строка**. Если человеку нужно написать комментарий или длинное обращение — одной строки не хватит. Для этого есть \`<textarea>\`.

### Как пишется

\`\`\`html
<textarea name="comment"></textarea>
\`\`\`

Главные отличия от \`<input>\`:
- **\`<textarea>\` имеет закрывающий тег** (в отличие от самозакрывающегося \`<input>\`)
- **Значение пишется между тегами**, не в \`value\`:

\`\`\`html
<textarea name="comment">Это значение по умолчанию.</textarea>
\`\`\`

### Размер поля

Атрибуты \`rows\` (строки) и \`cols\` (колонки) задают начальный размер:

\`\`\`html
<textarea name="comment" rows="5" cols="40"></textarea>
\`\`\`

\`rows="5"\` — высота 5 строк. \`cols="40"\` — ширина 40 символов.

Пользователь может **изменить размер** перетаскиванием за угол. Если нужно запретить ресайз — это делается через CSS.

### \`placeholder\` тоже работает

\`\`\`html
<textarea name="comment" placeholder="Расскажите что думаете..."></textarea>
\`\`\`

Подсказка показывается в пустом поле, как у \`<input>\`.

## 🛠️ Задание

Сделай форму обратной связи:

- \`<form>\`:
  - \`<label for="message">Ваше сообщение:</label>\`
  - \`<textarea name="message" id="message" rows="5" placeholder="Напишите что-нибудь..."></textarea>\`
  - \`<button type="submit">Отправить</button>\``,
  starterCode: `<!-- Форма с textarea -->
`,
  solution: `<form>
  <label for="message">Ваше сообщение:</label>
  <textarea name="message" id="message" rows="5" placeholder="Напишите что-нибудь..."></textarea>
  <button type="submit">Отправить</button>
</form>`,
  tests: [
    { kind: "exists", selector: "textarea", description: "Есть <textarea>" },
    { kind: "attr", selector: "textarea", name: "name", equals: "message", description: 'name="message"' },
    { kind: "attr", selector: "textarea", name: "rows", equals: "5", description: 'rows="5"' },
    { kind: "attr", selector: "textarea", name: "placeholder", equals: "Напишите что-нибудь...", description: "placeholder задан" },
    { kind: "exists", selector: "label[for='message']", description: "Есть <label> с for='message'" },
  ],
  hints: [
    "<textarea> с закрывающим тегом (не самозакрывается!). Атрибуты name, id, rows, placeholder через пробел.",
    "Шаблон: <textarea name=\"message\" id=\"message\" rows=\"5\" placeholder=\"...\"></textarea>",
    "Полное решение — см. в задании выше.",
  ],
  isAvailable: true,
};

export default lesson;
