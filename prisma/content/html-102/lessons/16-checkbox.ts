import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: 'type="checkbox" — галочки',
  order: 16,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# \`type="checkbox"\` — галочки

## 🎯 После этого урока ты сможешь
- Делать галочки (чекбоксы)
- Понимать когда несколько галочек = независимые

## 📚 Теория

### Что такое чекбокс

Чекбокс — это **галочка**: можно поставить или убрать. Подходит для **независимых** выборов:
- «Согласен с условиями»
- «Получать рассылку»
- «Подписаться на уведомления»
- Несколько хобби: «программирование», «спорт», «музыка»

\`\`\`html
<input type="checkbox" name="agree" id="agree">
<label for="agree">Согласен с условиями</label>
\`\`\`

### Несколько чекбоксов — независимые

Каждый чекбокс **сам по себе**. Можно поставить любое количество галочек одновременно.

\`\`\`html
<input type="checkbox" name="newsletter" id="newsletter">
<label for="newsletter">Получать рассылку</label>

<input type="checkbox" name="notifications" id="notifications">
<label for="notifications">Push-уведомления</label>
\`\`\`

У каждого свой \`name\` — потому что это **разные** поля.

### Несколько вариантов одного поля

Иногда нужен **массив значений** под одним именем — например список хобби:

\`\`\`html
<input type="checkbox" name="hobbies" value="code" id="h1">
<label for="h1">Программирование</label>
<input type="checkbox" name="hobbies" value="sport" id="h2">
<label for="h2">Спорт</label>
<input type="checkbox" name="hobbies" value="music" id="h3">
<label for="h3">Музыка</label>
\`\`\`

У всех **одинаковый \`name="hobbies"\`** — на сервер уйдёт массив отмеченных значений.

### Отмечен по умолчанию

Атрибут \`checked\` ставит галочку сразу:

\`\`\`html
<input type="checkbox" name="agree" checked>
\`\`\`

### \`<label>\` важен особенно для чекбокса

Сам чекбокс — **маленький квадратик ~14px**. По нему сложно попасть мышью или пальцем. \`<label>\` решает: клик по подписи **тоже ставит галочку**.

## 🛠️ Задание

Сделай форму регистрации с двумя чекбоксами:

- \`<form>\`:
  - \`<input type="checkbox" name="newsletter" id="newsletter">\` + \`<label for="newsletter">Получать рассылку</label>\`
  - \`<input type="checkbox" name="agree" id="agree" checked>\` + \`<label for="agree">Согласен с условиями</label>\`
  - \`<button type="submit">Зарегистрироваться</button>\``,
  starterCode: `<!-- Форма с двумя чекбоксами -->
`,
  solution: `<form>
  <input type="checkbox" name="newsletter" id="newsletter">
  <label for="newsletter">Получать рассылку</label>
  <input type="checkbox" name="agree" id="agree" checked>
  <label for="agree">Согласен с условиями</label>
  <button type="submit">Зарегистрироваться</button>
</form>`,
  tests: [
    { kind: "count", selector: 'input[type="checkbox"]', n: 2, description: "Два чекбокса" },
    { kind: "exists", selector: 'input[type="checkbox"][name="newsletter"]', description: 'Чекбокс name="newsletter"' },
    { kind: "exists", selector: 'input[type="checkbox"][name="agree"]', description: 'Чекбокс name="agree"' },
    { kind: "exists", selector: 'input[type="checkbox"][checked]', description: "Один чекбокс имеет атрибут checked" },
    { kind: "count", selector: "label", n: 2, description: "Два <label>" },
  ],
  hints: [
    "Два <input type=\"checkbox\"> с разными name. У одного — атрибут checked. К каждому — свой <label> через for+id.",
    "Шаблон одного: <input type=\"checkbox\" name=\"X\" id=\"X\"><label for=\"X\">Подпись</label>",
    "Полное решение — см. в задании выше.",
  ],
  isAvailable: true,
};

export default lesson;
