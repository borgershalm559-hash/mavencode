import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "Валидация: required, minlength, maxlength",
  order: 19,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# Валидация: \`required\`, \`minlength\`, \`maxlength\`

## 🎯 После этого урока ты сможешь
- Делать поля обязательными
- Ограничивать длину текста

## 📚 Теория

### Что такое валидация

**Валидация** — это проверка что пользователь ввёл данные **правильного формата**. Например пароль не короче 6 символов, имя не пустое, email похож на email.

Браузер умеет валидировать **сам**, без JavaScript — нужны только **атрибуты** на полях. Если форма не прошла валидацию, браузер не отправит её и покажет ошибку.

### \`required\` — обязательное поле

\`required\` — поле должно быть заполнено. Если пользователь оставит пустым и нажмёт «Отправить» — браузер не пропустит.

\`\`\`html
<input type="email" name="email" required>
\`\`\`

\`required\` — **булевый** атрибут (как \`checked\`, \`disabled\`).

### \`minlength\` и \`maxlength\` — длина текста

- \`minlength="6"\` — минимум 6 символов
- \`maxlength="20"\` — максимум 20 символов

\`\`\`html
<input type="password" name="password" minlength="6" maxlength="50">
\`\`\`

Если пользователь введёт пароль из 3 символов — браузер не отправит и покажет «Минимум 6 символов».

### Применяется к чему

\`required\`, \`minlength\`, \`maxlength\` работают на:
- \`<input>\` (text, email, password, number и т.д.)
- \`<textarea>\`
- \`<select>\` (только \`required\`)

### Что произойдёт без JavaScript

Если поля не прошли валидацию:
1. Браузер **не отправляет** форму
2. Подсвечивает первое невалидное поле
3. Показывает встроенное сообщение («Заполните это поле», «Минимум 6 символов»)

Это всё **бесплатно** — только указать атрибуты.

## 🛠️ Задание

Сделай форму регистрации с валидацией:

- \`<form>\`:
  - \`<input type="email" name="email" required>\` — обязательно
  - \`<input type="password" name="password" required minlength="6" maxlength="50">\` — обязательно, 6-50 символов
  - \`<button type="submit">Зарегистрироваться</button>\``,
  starterCode: `<!-- Форма с required и minlength/maxlength -->
`,
  solution: `<form>
  <input type="email" name="email" required>
  <input type="password" name="password" required minlength="6" maxlength="50">
  <button type="submit">Зарегистрироваться</button>
</form>`,
  tests: [
    { kind: "attrExists", selector: 'input[type="email"]', name: "required", description: "У email-поля есть required" },
    { kind: "attrExists", selector: 'input[type="password"]', name: "required", description: "У password-поля есть required" },
    { kind: "attr", selector: 'input[type="password"]', name: "minlength", equals: "6", description: 'minlength="6"' },
    { kind: "attr", selector: 'input[type="password"]', name: "maxlength", equals: "50", description: 'maxlength="50"' },
    { kind: "exists", selector: 'button[type="submit"]', description: "Есть кнопка submit" },
  ],
  hints: [
    "Атрибуты required, minlength, maxlength добавляются прямо в <input> через пробел.",
    "Шаблон: <input type=\"password\" name=\"password\" required minlength=\"6\" maxlength=\"50\">",
    "Полное решение — см. в задании выше.",
  ],
  isAvailable: true,
};

export default lesson;
