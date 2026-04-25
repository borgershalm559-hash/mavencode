import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: 'type="email", "password", "number"',
  order: 12,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# \`type="email"\`, \`"password"\`, \`"number"\`

## 🎯 После этого урока ты сможешь
- Использовать специализированные типы инпутов
- Получать встроенную валидацию и удобство для пользователя

## 📚 Теория

### \`type="email"\` — поле для email

Поле для ввода email. **Браузер автоматически проверяет** что введён корректный email при отправке формы. На мобильных устройствах автоматически показывает **клавиатуру с символом @**.

\`\`\`html
<input type="email" name="email">
\`\`\`

Если пользователь введёт «привет» вместо email — браузер не отправит форму и покажет красный значок ошибки.

### \`type="password"\` — поле для пароля

Поле где введённые символы превращаются в **точки** (•••••). Никакой автопроверки — только маскировка.

\`\`\`html
<input type="password" name="password">
\`\`\`

### \`type="number"\` — поле для числа

Поле принимает **только цифры**. Браузер показывает **кнопки +/-** для увеличения/уменьшения. На мобильных — клавиатура с цифрами.

\`\`\`html
<input type="number" name="age" min="0" max="120">
\`\`\`

Атрибуты:
- \`min\` — минимальное значение
- \`max\` — максимальное значение
- \`step\` — шаг (например \`step="0.1"\` для дробных)

### Зачем не просто \`type="text"\`

Можно везде писать \`type="text"\` — будет работать. Но специализированные типы дают:

1. **Удобство пользователю** на мобильных (правильная клавиатура)
2. **Бесплатную валидацию** (email проверяется браузером)
3. **Маскирование пароля**
4. **Доступность** (скринридер озвучит «поле email», а не просто «текстовое поле»)

**Пиши тип точнее — пользователю удобнее.**

## 🛠️ Задание

Сделай форму регистрации:

- \`<form>\` с тремя полями + кнопкой:
  - \`<label>\` + \`<input type="email" name="email">\`
  - \`<label>\` + \`<input type="password" name="password">\`
  - \`<label>\` + \`<input type="number" name="age" min="14" max="120">\`
  - \`<button type="submit">Регистрация</button>\``,
  starterCode: `<!-- Форма регистрации с email, password, age -->
`,
  solution: `<form>
  <label for="email">Email:</label>
  <input type="email" name="email" id="email">
  <label for="password">Пароль:</label>
  <input type="password" name="password" id="password">
  <label for="age">Возраст:</label>
  <input type="number" name="age" id="age" min="14" max="120">
  <button type="submit">Регистрация</button>
</form>`,
  tests: [
    { kind: "exists", selector: 'input[type="email"]', description: 'Есть <input type="email">' },
    { kind: "exists", selector: 'input[type="password"]', description: 'Есть <input type="password">' },
    { kind: "exists", selector: 'input[type="number"]', description: 'Есть <input type="number">' },
    { kind: "attr", selector: 'input[type="number"]', name: "min", equals: "14", description: 'У number-поля min="14"' },
    { kind: "attr", selector: 'input[type="number"]', name: "max", equals: "120", description: 'У number-поля max="120"' },
    { kind: "attr", selector: "button", name: "type", equals: "submit", description: 'Кнопка type="submit"' },
  ],
  hints: [
    "Три <input> с разными type, плюс <button type=\"submit\">. У number-поля атрибуты min и max.",
    "Шаблон одного поля: <label for=\"X\">Подпись:</label><input type=\"...\" name=\"...\" id=\"X\">",
    "Полное решение — см. в задании выше.",
  ],
  isAvailable: true,
};

export default lesson;
