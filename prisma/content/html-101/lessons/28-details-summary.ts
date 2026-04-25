import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "Раскрывающиеся блоки: <details> и <summary>",
  order: 28,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# Раскрывающиеся блоки: \`<details>\` и \`<summary>\`

## 🎯 После этого урока ты сможешь
- Делать FAQ-блоки которые раскрываются по клику
- Понимать пару \`<details>\` + \`<summary>\`

## 📚 Теория

### Раскрывающийся блок

Видел на сайтах FAQ-секции, где **вопрос виден всегда**, а ответ открывается по клику? В HTML это делается **без JavaScript** — встроенным тегом \`<details>\`.

\`\`\`html
<details>
  <summary>Как заварить чай?</summary>
  <p>Залить кипятком, подождать 3 минуты.</p>
</details>
\`\`\`

Что увидишь в браузере:
- Сначала только видно вопрос «Как заварить чай?» с маленьким треугольником ▶ слева
- Кликаешь — раскрывается, треугольник поворачивается ▼, появляется ответ

### Структура

- **\`<details>\`** — обёртка всего блока
- **\`<summary>\`** — то что видно всегда (заголовок, вопрос). Он **должен быть первым** внутри \`<details>\`.
- Всё остальное внутри \`<details>\` (после \`<summary>\`) — содержимое которое раскрывается.

### Открыто по умолчанию

Если хочешь чтобы блок был **сразу открыт**, добавь атрибут \`open\`:

\`\`\`html
<details open>
  <summary>Этот блок открыт сразу</summary>
  <p>Можно его закрыть кликом.</p>
</details>
\`\`\`

\`open\` — это **булевый** атрибут (помнишь L03?). Само наличие атрибута уже включает его.

### Несколько \`<details>\` рядом

Можно поставить много \`<details>\` друг за другом — получится FAQ:

\`\`\`html
<details>
  <summary>Вопрос 1?</summary>
  <p>Ответ 1.</p>
</details>
<details>
  <summary>Вопрос 2?</summary>
  <p>Ответ 2.</p>
</details>
\`\`\`

Каждый раскрывается независимо.

## ⚠️ Частые ошибки

1. **\`<summary>\` не первый** в \`<details>\` — браузер запутается.
2. **Несколько \`<summary>\` в одном \`<details>\`** — должен быть один.
3. **Используют \`<details>\` для бокового меню или другого UI** — нет, это специально для «раскрыть по клику» интерфейсов.

## 🛠️ Задание

Сделай FAQ-блок из одного вопроса:

- Вопрос (внутри \`<summary>\`): \`Как связаться с поддержкой?\`
- Ответ (внутри \`<p>\` после summary): \`Напишите на support@example.com\``,
  starterCode: `<!-- details + summary + ответ -->
`,
  solution: `<details>
  <summary>Как связаться с поддержкой?</summary>
  <p>Напишите на support@example.com</p>
</details>`,
  tests: [
    { kind: "exists", selector: "details", description: "Есть <details>" },
    { kind: "exists", selector: "details summary", description: "Внутри <details> есть <summary>" },
    { kind: "text", selector: "summary", equals: "Как связаться с поддержкой?", description: 'В <summary> правильный вопрос' },
    { kind: "exists", selector: "details p", description: "Внутри <details> есть <p> с ответом" },
    { kind: "textContains", selector: "details p", contains: "support@example.com", description: 'В ответе упоминается support@example.com' },
  ],
  hints: [
    "Структура: <details><summary>Вопрос</summary><p>Ответ</p></details>. Сначала <summary>, потом <p>.",
    "Текст в <summary> — это вопрос. Текст в <p> внутри <details> — ответ.",
    'Полное решение:\n```html\n<details>\n  <summary>Как связаться с поддержкой?</summary>\n  <p>Напишите на support@example.com</p>\n</details>\n```',
  ],
  isAvailable: true,
};

export default lesson;
