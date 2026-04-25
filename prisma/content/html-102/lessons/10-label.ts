import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "<label> — связь подписи с полем",
  order: 10,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# \`<label>\` — связь подписи с полем

## 🎯 После этого урока ты сможешь
- Подписывать поля формы правильно
- Связывать \`<label>\` с \`<input>\` через \`for\`+\`id\`

## 📚 Теория

### Зачем нужен \`<label>\`

Поле без подписи — это плохо. Пользователь должен понять что в него вводить. Подпись можно сделать через обычный \`<p>\`, но **есть специальный тег \`<label>\`** — он лучше:

1. **Клик по подписи фокусирует поле**. Удобно — особенно для маленьких чекбоксов.
2. **Скринридер связывает подпись с полем** — слепой пользователь слышит «Имя, поле для ввода», а не отдельно «Имя», потом отдельно «поле для ввода».
3. **Стандарт хорошего тона** — поисковики и анализаторы доступности это проверяют.

### Два способа связать

**Способ 1: через атрибут \`for\` и \`id\`**

У \`<label>\` есть атрибут \`for\` — туда пишешь \`id\` поля:

\`\`\`html
<label for="username">Имя:</label>
<input type="text" name="username" id="username">
\`\`\`

\`for\` ссылается на \`id\`. Они должны **точно совпадать**.

**Способ 2: обернуть \`<input>\` в \`<label>\`**

Можно поле просто положить внутрь \`<label>\`:

\`\`\`html
<label>
  Имя: <input type="text" name="username">
</label>
\`\`\`

Связь устанавливается автоматически — без \`for\` и \`id\`. Удобно для маленьких форм.

### Какой способ выбрать

- **Способ 1 (for+id)** — когда подпись и поле должны быть **отдельными элементами** (например в разных колонках таблицы или с дизайном-обёрткой).
- **Способ 2 (вложенный)** — когда подпись просто рядом с полем — короче и без \`id\`.

В этом курсе используем **способ 1** — он более универсальный.

## 🛠️ Задание

Сделай форму с полем «Имя» и правильной подписью:

\`\`\`html
<form>
  <label for="name">Имя:</label>
  <input type="text" name="name" id="name">
</form>
\`\`\`

Или вложенный вариант — тоже считается, но в тесте проверяем именно вариант с for+id.`,
  starterCode: `<!-- form с label и input связанными через for+id -->
`,
  solution: `<form>
  <label for="name">Имя:</label>
  <input type="text" name="name" id="name">
</form>`,
  tests: [
    { kind: "exists", selector: "form label", description: "Есть <label> внутри формы" },
    { kind: "attr", selector: "label", name: "for", equals: "name", description: 'У <label> атрибут for="name"' },
    { kind: "attr", selector: "input", name: "id", equals: "name", description: 'У <input> id="name"' },
    { kind: "attr", selector: "input", name: "type", equals: "text", description: '<input type="text">' },
    { kind: "textContains", selector: "label", contains: "Имя", description: '<label> содержит слово "Имя"' },
  ],
  hints: [
    "Два тега: <label for=\"X\">Подпись</label> и <input ... id=\"X\">. Значение for должно совпадать с id.",
    "Шаблон: <form><label for=\"name\">Имя:</label><input type=\"text\" name=\"name\" id=\"name\"></form>",
    'Полное решение:\n```html\n<form>\n  <label for="name">Имя:</label>\n  <input type="text" name="name" id="name">\n</form>\n```',
  ],
  isAvailable: true,
};

export default lesson;
