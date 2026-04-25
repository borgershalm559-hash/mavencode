import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "placeholder и value — подсказки и значения по умолчанию",
  order: 13,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# \`placeholder\` и \`value\` — подсказки и значения по умолчанию

## 🎯 После этого урока ты сможешь
- Делать поле с подсказкой внутри
- Заполнять поле значением по умолчанию

## 📚 Теория

### \`placeholder\` — подсказка-текст в поле

\`placeholder\` — это **серый текст внутри пустого поля**, подсказывающий что нужно ввести. Когда пользователь начинает печатать — текст исчезает.

\`\`\`html
<input type="email" name="email" placeholder="example@mail.com">
\`\`\`

В пустом поле виден серый текст «example@mail.com». Как только начнёшь печатать — он пропадёт.

### \`value\` — значение по умолчанию

\`value\` — **реальное значение** в поле. Поле сразу заполнено этим значением (как будто пользователь сам его ввёл).

\`\`\`html
<input type="text" name="city" value="Москва">
\`\`\`

Поле сразу содержит «Москва». Пользователь может стереть и ввести своё. Если ничего не менять и отправить — на сервер уйдёт «Москва».

### Чем отличаются

| Атрибут | Что в поле | После сабмита |
|---------|-----------|----------------|
| \`placeholder\` | Серая подсказка (исчезает при вводе) | Поле пустое если пользователь не ввёл |
| \`value\` | Реальный текст | Это значение отправится на сервер |

### \`placeholder\` НЕ заменяет \`<label>\`

Очень частая ошибка: «зачем мне \`<label>\`, если есть \`placeholder\`?»

**\`placeholder\` исчезает когда пользователь начал печатать**. После этого пользователь может забыть что вводит. Особенно плохо для скринридеров — они часто \`placeholder\` не озвучивают.

\`<label>\` остаётся **видимым всегда** — это надёжная подпись.

**Пиши и \`<label>\`, и \`placeholder\`** — они решают разные задачи.

## 🛠️ Задание

Сделай форму:

\`\`\`html
<form>
  <label for="name">Имя:</label>
  <input type="text" name="name" id="name" placeholder="Иван" value="Иван Иванов">
</form>
\`\`\`

Поле сразу содержит «Иван Иванов». Подсказка «Иван» появится только если пользователь сотрёт значение.`,
  starterCode: `<!-- form с label и input с placeholder и value -->
`,
  solution: `<form>
  <label for="name">Имя:</label>
  <input type="text" name="name" id="name" placeholder="Иван" value="Иван Иванов">
</form>`,
  tests: [
    { kind: "exists", selector: "form label", description: "Есть <label>" },
    { kind: "attr", selector: "input", name: "placeholder", equals: "Иван", description: 'У <input> placeholder="Иван"' },
    { kind: "attr", selector: "input", name: "value", equals: "Иван Иванов", description: 'У <input> value="Иван Иванов"' },
    { kind: "attr", selector: "input", name: "name", equals: "name", description: 'У <input> name="name"' },
  ],
  hints: [
    "У одного <input> сразу несколько атрибутов: type, name, id, placeholder, value. Все через пробел.",
    "Шаблон: <input type=\"text\" name=\"name\" id=\"name\" placeholder=\"...\" value=\"...\">",
    "Полное решение — см. в задании выше.",
  ],
  isAvailable: true,
};

export default lesson;
