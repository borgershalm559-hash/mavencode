import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "<form> и <input> — текстовое поле",
  order: 9,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# \`<form>\` и \`<input>\` — текстовое поле

## 🎯 После этого урока ты сможешь
- Создавать форму с текстовым полем
- Понимать роль атрибутов name и type

## 📚 Теория

### Минимальная форма

\`\`\`html
<form action="/submit" method="post">
  <input type="text" name="username">
</form>
\`\`\`

Что здесь:
- \`<form>\` — обёртка
- \`action="/submit"\` — куда отправлять
- \`method="post"\` — как отправлять
- \`<input>\` — поле для ввода
- \`type="text"\` — простое текстовое поле
- \`name="username"\` — **имя** поля (под этим ключом данные уйдут на сервер)

### Атрибут \`name\` — почему он критичен

Если у поля **нет \`name\`** — оно НЕ отправится на сервер. Поле без имени = безымянная коробка, на которую никто не подписан.

\`\`\`html
<input type="text">              <!-- ✗ не отправится -->
<input type="text" name="email">  <!-- ✓ отправится как email=... -->
\`\`\`

### \`<input>\` — самозакрывающийся

\`<input>\` не имеет содержимого. Закрывающий тег **не нужен**:

\`\`\`html
<input type="text" name="username">     <!-- ✓ -->
<input type="text" name="username"></input>   <!-- технически ошибка -->
\`\`\`

### Атрибут \`type\` — какое поле

Только \`type\` определяет что это за \`<input>\`. Меняешь \`type\` — меняется и поведение:
- \`type="text"\` — обычная текстовая строка (по умолчанию если \`type\` не указан)
- \`type="password"\` — точки вместо букв (для паролей)
- \`type="email"\` — текст + проверка что введён email
- \`type="number"\` — только цифры с кнопками +/-
- \`type="checkbox"\` — галочка
- \`type="radio"\` — радиокнопка
- \`type="file"\` — загрузка файла
- ...и ещё много

С этого урока начинаем разбирать разные \`type\`.

## 🛠️ Задание

Сделай форму с одним текстовым полем:

- \`<form action="/login" method="post">\`
- внутри \`<input type="text" name="username">\``,
  starterCode: `<!-- form с одним input type=text -->
`,
  solution: `<form action="/login" method="post">
  <input type="text" name="username">
</form>`,
  tests: [
    { kind: "exists", selector: "form", description: "Есть <form>" },
    { kind: "attr", selector: "form", name: "action", equals: "/login", description: 'У <form> action="/login"' },
    { kind: "attr", selector: "form", name: "method", equals: "post", description: 'У <form> method="post"' },
    { kind: "attr", selector: "form input", name: "type", equals: "text", description: 'Внутри есть <input type="text">' },
    { kind: "attr", selector: "form input", name: "name", equals: "username", description: 'У <input> name="username"' },
  ],
  hints: [
    "<form> с двумя атрибутами (action, method) и одним <input> внутри. <input> — самозакрывающийся.",
    "Шаблон: <form action=\"...\" method=\"...\"><input type=\"...\" name=\"...\"></form>",
    'Полное решение:\n```html\n<form action="/login" method="post">\n  <input type="text" name="username">\n</form>\n```',
  ],
  isAvailable: true,
};

export default lesson;
