import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: 'type="radio" — выбор одного из',
  order: 17,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# \`type="radio"\` — выбор одного из

## 🎯 После этого урока ты сможешь
- Делать радиокнопки
- Понимать роль одинакового \`name\`

## 📚 Теория

### Чем радио отличается от чекбокса

**Чекбокс** — независимая галочка. Можно поставить любое число.

**Радиокнопка** — выбор **одного** из нескольких вариантов. Можно отметить только один, остальные автоматически снимаются.

Пример: «Размер пиццы» — нельзя одновременно «маленькая» и «большая».

\`\`\`html
<input type="radio" name="size" value="small" id="s">
<label for="s">Маленькая</label>

<input type="radio" name="size" value="medium" id="m" checked>
<label for="m">Средняя</label>

<input type="radio" name="size" value="large" id="l">
<label for="l">Большая</label>
\`\`\`

### Главное правило: одинаковый \`name\`

Радиокнопки **группируются по \`name\`**. У всех вариантов одной группы — **одинаковый \`name\`**. Так браузер понимает «эти кнопки взаимоисключающие».

Если у двух радио-инпутов **разные \`name\`** — они не связаны и каждый можно отметить отдельно (бессмысленный паттерн).

### Разные \`value\`

У каждого варианта **свой \`value\`** — это значение уйдёт на сервер если выбрана эта радиокнопка.

\`\`\`html
<!-- name одинаковый = группа, value разные = варианты -->
<input type="radio" name="size" value="small">
<input type="radio" name="size" value="medium">
<input type="radio" name="size" value="large">
\`\`\`

### Один вариант по умолчанию

Хорошая практика — **отметить один из вариантов** как \`checked\` чтобы группа не была пустой:

\`\`\`html
<input type="radio" name="size" value="medium" checked>
\`\`\`

## 🛠️ Задание

Сделай радиогруппу для выбора цвета:

- \`<form>\`:
  - три \`<input type="radio">\` с **одинаковым** \`name="color"\`:
    - \`value="red"\`, label «Красный»
    - \`value="green"\`, label «Зелёный», **checked**
    - \`value="blue"\`, label «Синий»`,
  starterCode: `<!-- Радиогруппа выбора цвета -->
`,
  solution: `<form>
  <input type="radio" name="color" value="red" id="red">
  <label for="red">Красный</label>
  <input type="radio" name="color" value="green" id="green" checked>
  <label for="green">Зелёный</label>
  <input type="radio" name="color" value="blue" id="blue">
  <label for="blue">Синий</label>
</form>`,
  tests: [
    { kind: "count", selector: 'input[type="radio"]', n: 3, description: "Три радиокнопки" },
    { kind: "count", selector: 'input[type="radio"][name="color"]', n: 3, description: "У всех трёх одинаковый name=\"color\"" },
    { kind: "exists", selector: 'input[type="radio"][value="red"]', description: 'Есть value="red"' },
    { kind: "exists", selector: 'input[type="radio"][value="green"][checked]', description: 'value="green" имеет атрибут checked' },
    { kind: "exists", selector: 'input[type="radio"][value="blue"]', description: 'Есть value="blue"' },
  ],
  hints: [
    "Три <input type=\"radio\"> с ОДИНАКОВЫМ name=\"color\" но РАЗНЫМ value. У одного — атрибут checked.",
    "Шаблон: <input type=\"radio\" name=\"color\" value=\"X\" id=\"X\"><label for=\"X\">Подпись</label>",
    "Полное решение — см. в задании выше.",
  ],
  isAvailable: true,
};

export default lesson;
