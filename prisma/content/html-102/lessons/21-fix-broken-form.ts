import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "Сломанная форма — почини",
  order: 21,
  type: "fix-bug",
  language: "html",
  xpReward: 80,
  content: `# Сломанная форма — почини

## 🎯 После этого урока ты сможешь
- Замечать типичные ошибки в форме
- Чинить связи label-input

## 📚 Что чинить

В стартовом коде есть форма с **3 ошибками**:

1. У \`<input>\` для email отсутствует атрибут \`name\` (без него поле не отправится).
2. \`<label>\` ссылается на несуществующий id (опечатка в \`for\`).
3. У кнопки \`type="reset"\` вместо \`submit\` (она не будет отправлять форму).

## 🛠️ Задание

Найди и исправь все три ошибки. После починки тесты должны пройти.`,
  starterCode: `<form action="/login">
  <label for="emial">Email:</label>
  <input type="email" id="email" required>
  <button type="reset">Войти</button>
</form>`,
  solution: `<form action="/login">
  <label for="email">Email:</label>
  <input type="email" id="email" name="email" required>
  <button type="submit">Войти</button>
</form>`,
  tests: [
    { kind: "attr", selector: "label", name: "for", equals: "email", description: 'Исправлен for на "email"' },
    { kind: "attrExists", selector: 'input[type="email"]', name: "name", description: "У <input> добавлен атрибут name" },
    { kind: "attr", selector: 'input[type="email"]', name: "name", equals: "email", description: 'name="email"' },
    { kind: "attr", selector: "button", name: "type", equals: "submit", description: 'Кнопка type="submit"' },
    { kind: "text", selector: "button", equals: "Войти", description: 'Текст кнопки "Войти"' },
  ],
  hints: [
    "Три проблемы: 1) опечатка \"emial\" вместо \"email\" в for, 2) у <input> нет name=\"email\", 3) у кнопки type=\"reset\" должно быть type=\"submit\".",
    "Сравни for у label с id у input — должны буква в букву совпадать. Проверь все обязательные атрибуты у input. Кнопка должна отправлять форму, не сбрасывать.",
    "Полное решение:\n```html\n<form action=\"/login\">\n  <label for=\"email\">Email:</label>\n  <input type=\"email\" id=\"email\" name=\"email\" required>\n  <button type=\"submit\">Войти</button>\n</form>\n```",
  ],
  isAvailable: true,
};

export default lesson;
