import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "padding — внутренние отступы",
  order: 24,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# \`padding\` — внутренние отступы

## 🎯 После этого урока ты сможешь
- Делать отступ от границы элемента до содержимого
- Различать padding и margin

## 📚 Теория

### Что такое padding

**\`padding\`** — это **внутренний отступ**: пространство **между границей** элемента и его **содержимым**.

\`\`\`
+------------+
|  padding   |
|  +------+  |
|  | text |  |
|  +------+  |
|  padding   |
+------------+
\`\`\`

### Сокращённая форма как у margin

\`\`\`css
padding: 10px;                  /* все стороны */
padding: 10px 20px;              /* верх/низ 10, лево/право 20 */
padding: 10px 20px 30px 40px;    /* верх / право / низ / лево */
\`\`\`

### Каждая сторона

\`\`\`css
padding-top: 10px;
padding-right: 20px;
padding-bottom: 10px;
padding-left: 20px;
\`\`\`

### Padding vs margin

| | margin (внешний) | padding (внутренний) |
|---|---|---|
| Где | **снаружи** границы | **внутри** границы |
| Видно ли фон | нет (прозрачно) | да (фон элемента) |
| Когда нужно | оторвать элемент от соседей | дать «воздух» вокруг текста внутри |

### Типичные случаи

\`\`\`css
/* Кнопка с приятным внутренним отступом */
.btn {
  padding: 10px 20px;
  background: blue;
}

/* Карточка с воздухом вокруг текста */
.card {
  padding: 24px;
  background: white;
  border: 1px solid gray;
}
\`\`\`

## 🛠️ Задание

Стилизуй:

- \`<button class="btn">\` — \`padding: 10px 20px\` (10 сверху/снизу, 20 слева/справа)`,
  starterCode: `<!doctype html>
<html>
<head>
  <style>
    /* .btn */
  </style>
</head>
<body>
  <!-- button.btn -->
</body>
</html>
`,
  solution: `<!doctype html>
<html>
<head>
  <style>
    .btn { padding: 10px 20px; }
  </style>
</head>
<body>
  <button class="btn">Кликни</button>
</body>
</html>`,
  tests: [
    { kind: "exists", selector: ".btn", description: "Есть .btn" },
    { kind: "style", selector: ".btn", property: "padding-top", equals: "10px", description: "padding-top 10px" },
    { kind: "style", selector: ".btn", property: "padding-left", equals: "20px", description: "padding-left 20px" },
  ],
  hints: [
    "Сокращение «padding: 10px 20px» = верх/низ 10, лево/право 20.",
    "Шаблон: .btn { padding: 10px 20px; }",
    "Полное решение — см. в задании выше.",
  ],
  isAvailable: true,
};

export default lesson;
