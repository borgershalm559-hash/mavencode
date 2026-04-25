import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "<select> и <option> — выпадающий список",
  order: 15,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# \`<select>\` и \`<option>\` — выпадающий список

## 🎯 После этого урока ты сможешь
- Делать выпадающие списки выбора
- Помечать вариант по умолчанию

## 📚 Теория

### Зачем

Когда у пользователя **ограниченный набор вариантов** — лучше дать выбор из списка, чем заставлять вводить вручную. Например страна, валюта, размер одежды.

### Как пишется

\`\`\`html
<select name="country">
  <option value="ru">Россия</option>
  <option value="kz">Казахстан</option>
  <option value="by">Беларусь</option>
</select>
\`\`\`

- \`<select>\` — обёртка, в \`name\` имя поля
- \`<option>\` — один вариант
- \`value\` у \`<option>\` — что **уйдёт на сервер** при выборе этого варианта
- Текст между \`<option>...</option>\` — что **видит пользователь** в списке

### Если \`value\` не указан

Если \`<option>\` без \`value\` — на сервер уйдёт сам **текст** между тегами:

\`\`\`html
<option>Россия</option>   <!-- value по умолчанию = "Россия" -->
\`\`\`

Лучше **всегда указывать \`value\`** — обычно в коротком формате (\`ru\`, \`kz\`), а текст внутри для пользователя — нормальный (\`Россия\`).

### Выбран по умолчанию

Атрибут \`selected\` помечает что **этот вариант выбран сразу**:

\`\`\`html
<select name="country">
  <option value="ru" selected>Россия</option>
  <option value="kz">Казахстан</option>
</select>
\`\`\`

\`selected\` — **булевый** атрибут (как \`disabled\`, \`required\`). Само наличие его уже включает.

### Подсказка-плейсхолдер

\`<select>\` не имеет \`placeholder\`. Чтобы сделать «Выберите...» используют **первый \`<option>\` с пустым \`value\`**, отключённый \`disabled\` и выбранный по умолчанию:

\`\`\`html
<select name="country">
  <option value="" disabled selected>Выберите страну...</option>
  <option value="ru">Россия</option>
  <option value="kz">Казахстан</option>
</select>
\`\`\`

## 🛠️ Задание

Сделай выпадающий список выбора размера:

- \`<form>\`:
  - \`<label for="size">Размер:</label>\`
  - \`<select name="size" id="size">\`:
    - \`<option value="s">S</option>\`
    - \`<option value="m" selected>M</option>\`
    - \`<option value="l">L</option>\``,
  starterCode: `<!-- Форма с select для размера -->
`,
  solution: `<form>
  <label for="size">Размер:</label>
  <select name="size" id="size">
    <option value="s">S</option>
    <option value="m" selected>M</option>
    <option value="l">L</option>
  </select>
</form>`,
  tests: [
    { kind: "exists", selector: "select", description: "Есть <select>" },
    { kind: "count", selector: "select option", n: 3, description: "Внутри <select> три <option>" },
    { kind: "attr", selector: "select", name: "name", equals: "size", description: 'У <select> name="size"' },
    { kind: "exists", selector: "option[selected]", description: "Один из <option> имеет атрибут selected" },
    { kind: "attr", selector: "option[selected]", name: "value", equals: "m", description: 'Выбран по умолчанию option с value="m"' },
  ],
  hints: [
    "<select> — обёртка, внутри три <option> с value=\"s\"/\"m\"/\"l\". У среднего добавь атрибут selected.",
    "Шаблон одного option: <option value=\"...\">текст</option>. У выбранного: <option value=\"...\" selected>текст</option>",
    "Полное решение — см. в задании выше.",
  ],
  isAvailable: true,
};

export default lesson;
