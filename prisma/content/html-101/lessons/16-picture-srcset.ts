import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "Адаптивные <picture> и srcset",
  order: 16,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# Адаптивные \`<picture>\` и srcset

## 🎯 После этого урока ты будешь знать
- Как показывать разные картинки на разных экранах
- Зачем нужен \`<picture>\`
- Что делает \`srcset\`

## 📚 Теория

### Проблема: один размер не подходит всем

Если картинка размером 2000×1500 пикселей — она хороша для большого монитора, но на телефоне её **слишком много**: трафик уходит, страница медленно грузится.

Решение — давать **разные** картинки для разных устройств. Маленькую для телефона, большую для монитора.

### \`srcset\` — список вариантов

В одном теге \`<img>\` можно указать **несколько вариантов** через атрибут \`srcset\`. Браузер сам выберет какой брать.

\`\`\`html
<img
  src="cat-800.jpg"
  srcset="cat-400.jpg 400w, cat-800.jpg 800w, cat-1600.jpg 1600w"
  alt="Кот"
>
\`\`\`

Что здесь:
- \`src="cat-800.jpg"\` — **запасной вариант**, если \`srcset\` не работает (старый браузер).
- \`srcset\` — список через запятую: \`URL 400w, URL 800w, URL 1600w\`. Цифра + \`w\` — это **ширина файла в пикселях** (не размер на экране, а реальная ширина картинки).
- Браузер смотрит на свой экран и выбирает **самый подходящий** вариант.

### \`<picture>\` — выбор по условию

Если нужно ещё точнее — например **квадратное** фото для мобильного и **широкое** для десктопа — используют тег \`<picture>\`.

\`\`\`html
<picture>
  <source media="(max-width: 600px)" srcset="cat-mobile.jpg">
  <source media="(min-width: 601px)" srcset="cat-desktop.jpg">
  <img src="cat-desktop.jpg" alt="Кот">
</picture>
\`\`\`

Что здесь:
- \`<picture>\` — обёртка
- \`<source>\` — варианты с условиями (\`media\` — то же что и в CSS @media)
- \`<img>\` — последний, **обязательный** запасной вариант. Без него ничего не покажется.

Браузер берёт **первый \`<source>\` подходящий по условию**, иначе показывает \`<img>\`.

## 💡 Когда что использовать

- **Просто разные размеры** одной и той же картинки → \`<img srcset>\`
- **Совсем разные изображения** для разных размеров экранов → \`<picture>\`

## ⚠️ Частые ошибки

1. **Забыли \`src\` в \`<img>\`**: только \`srcset\`. Без \`src\` старые браузеры ничего не покажут.
2. **Забыли \`<img>\` внутри \`<picture>\`**. Это **обязательный** последний элемент.
3. **Перепутали \`w\` и \`x\`**: \`400w\` (по ширине файла) ≠ \`2x\` (плотность пикселей retina). Учим только \`w\` сейчас.

## 🛠️ Задание

Сделай адаптивную картинку через \`<picture>\`:

- Внутри \`<picture>\`:
  - \`<source>\` с \`media="(max-width: 600px)"\` и \`srcset="https://example.com/cat-small.jpg"\`
  - \`<img>\` с \`src="https://example.com/cat-large.jpg"\` и \`alt="Кот"\``,
  starterCode: `<!-- <picture> с одним <source> и обязательным <img> -->
`,
  solution: `<picture>
  <source media="(max-width: 600px)" srcset="https://example.com/cat-small.jpg">
  <img src="https://example.com/cat-large.jpg" alt="Кот">
</picture>`,
  tests: [
    { kind: "exists", selector: "picture", description: "Есть тег <picture>" },
    { kind: "exists", selector: "picture source", description: "Внутри <picture> есть <source>" },
    { kind: "attr", selector: "picture source", name: "media", equals: "(max-width: 600px)", description: 'У <source> media="(max-width: 600px)"' },
    { kind: "exists", selector: "picture img", description: "Внутри <picture> есть <img> (обязательный)" },
    { kind: "attr", selector: "picture img", name: "alt", equals: "Кот", description: 'У <img> alt="Кот"' },
  ],
  hints: [
    "<picture> — обёртка. Внутри: один или несколько <source> с условиями + обязательно <img> в конце.",
    "Шаблон: <picture><source media=\"...\" srcset=\"...\"><img src=\"...\" alt=\"...\"></picture>",
    'Полное решение:\n```html\n<picture>\n  <source media="(max-width: 600px)" srcset="https://example.com/cat-small.jpg">\n  <img src="https://example.com/cat-large.jpg" alt="Кот">\n</picture>\n```',
  ],
  isAvailable: true,
};

export default lesson;
