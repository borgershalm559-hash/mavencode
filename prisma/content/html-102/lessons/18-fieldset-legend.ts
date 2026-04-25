import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "<fieldset> и <legend> — группировка полей",
  order: 18,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# \`<fieldset>\` и \`<legend>\` — группировка полей

## 🎯 После этого урока ты сможешь
- Группировать связанные поля визуально и семантически
- Подписывать группу через \`<legend>\`

## 📚 Теория

### Зачем

В большой форме часто есть **группы полей** по смыслу. «Личные данные» — отдельно, «Адрес доставки» — отдельно, «Способ оплаты» — отдельно.

\`<fieldset>\` визуально объединяет группу **рамкой**, а \`<legend>\` даёт ей **название**.

\`\`\`html
<form>
  <fieldset>
    <legend>Личные данные</legend>
    <label for="name">Имя:</label>
    <input type="text" name="name" id="name">
    <label for="email">Email:</label>
    <input type="email" name="email" id="email">
  </fieldset>

  <fieldset>
    <legend>Доставка</legend>
    <label for="city">Город:</label>
    <input type="text" name="city" id="city">
  </fieldset>
</form>
\`\`\`

Браузер по умолчанию рисует тонкую рамку вокруг \`<fieldset>\` и помещает \`<legend>\` сверху на рамке.

### Особенно полезно для радиогрупп

Радиогруппа без обёртки выглядит кучей кнопок. С \`<fieldset>\`+\`<legend>\` сразу понятно «вот эти варианты — про размер»:

\`\`\`html
<fieldset>
  <legend>Размер пиццы</legend>
  <input type="radio" name="size" value="s" id="s">
  <label for="s">Маленькая</label>
  <input type="radio" name="size" value="m" id="m">
  <label for="m">Средняя</label>
</fieldset>
\`\`\`

Скринридер озвучит группу как «Размер пиццы. Радиокнопки». Без \`<fieldset>\` — просто куча кнопок без контекста.

### \`<legend>\` — первый ребёнок \`<fieldset>\`

\`<legend>\` должен идти **первым** в \`<fieldset>\`. Это правило стандарта.

## 🛠️ Задание

Сделай форму:

- \`<form>\`:
  - \`<fieldset>\`:
    - \`<legend>Размер пиццы</legend>\`
    - две \`<input type="radio" name="size">\` с подписями \`Маленькая\` и \`Большая\``,
  starterCode: `<!-- Форма с fieldset+legend и радиогруппой -->
`,
  solution: `<form>
  <fieldset>
    <legend>Размер пиццы</legend>
    <input type="radio" name="size" value="small" id="small">
    <label for="small">Маленькая</label>
    <input type="radio" name="size" value="large" id="large">
    <label for="large">Большая</label>
  </fieldset>
</form>`,
  tests: [
    { kind: "exists", selector: "fieldset", description: "Есть <fieldset>" },
    { kind: "exists", selector: "fieldset legend", description: "Внутри <fieldset> есть <legend>" },
    { kind: "text", selector: "legend", equals: "Размер пиццы", description: '<legend> содержит "Размер пиццы"' },
    { kind: "count", selector: 'fieldset input[type="radio"]', n: 2, description: "В <fieldset> два radio-инпута" },
    { kind: "count", selector: 'fieldset input[name="size"]', n: 2, description: 'У обоих radio name="size"' },
  ],
  hints: [
    "<fieldset> снаружи. Первый ребёнок — <legend>. Остальное — поля.",
    "Шаблон: <fieldset><legend>...</legend><input ...><label>...</label>...</fieldset>",
    "Полное решение — см. в задании выше.",
  ],
  isAvailable: true,
};

export default lesson;
