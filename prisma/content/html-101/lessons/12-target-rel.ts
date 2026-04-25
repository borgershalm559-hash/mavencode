import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: 'Открыть в новой вкладке: target="_blank" и rel',
  order: 12,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# Открыть в новой вкладке: \`target="_blank"\` и \`rel\`

## 🎯 После этого урока ты сможешь
- Открывать ссылку в новой вкладке
- Понимать зачем нужен \`rel="noopener"\`

## 📚 Теория

### По умолчанию ссылка открывается в той же вкладке

Когда ты пишешь \`<a href="...">\` без дополнительных атрибутов, браузер откроет ссылку **в текущей вкладке** — то есть твоя страница пропадёт, появится та куда ведёт ссылка.

Иногда это плохо: пользователь читал твою статью, кликнул на источник — и ушёл насовсем.

### \`target="_blank"\` — открыть в новой вкладке

Добавь атрибут \`target="_blank"\` — и ссылка откроется в **новой вкладке**, оставив твою страницу на месте.

\`\`\`html
<a href="https://wikipedia.org" target="_blank">Wikipedia</a>
\`\`\`

Слово \`_blank\` (с подчёркиванием в начале) — специальное служебное значение, означает «новая пустая вкладка».

### \`rel="noopener"\` — безопасность

С \`target="_blank"\` нужно добавить ещё один атрибут — \`rel="noopener"\`. Это **защита от старого бага браузеров**, когда новая вкладка могла «дотянуться» до твоей страницы и менять её. Сейчас современные браузеры закрыли этот баг сами, но добавлять \`rel="noopener"\` — это привычка хорошего тона.

\`\`\`html
<a href="https://wikipedia.org" target="_blank" rel="noopener">Wikipedia</a>
\`\`\`

Ещё видишь \`rel="noopener noreferrer"\` — это чуть строже: помимо защиты ещё и не передаёт «откуда пришёл» пользователь.

### Когда использовать \`target="_blank"\`

- **Внешние ссылки** на чужие сайты (источники, википедия, документация). Пользователь не теряет твою страницу.
- **Не использовать** для ссылок внутри своего сайта — это раздражает.

## ⚠️ Частые ошибки

1. **Забывают \`rel="noopener"\`**: только \`target="_blank"\`. Работает, но небезопасно по старым стандартам.
2. **Кавычки в атрибутах**: каждый атрибут — со своими кавычками: \`target="_blank" rel="noopener"\`. Не объединяй.
3. **Пишут \`_BLANK\` или \`Blank\`**: значение должно быть точно \`_blank\` со строчной буквы и с подчёркиванием в начале.

## 🛠️ Задание

Сделай ссылку:

- Текст ссылки: \`Открыть Google\`
- URL: \`https://google.com\`
- Открывается в новой вкладке (\`target="_blank"\`)
- С атрибутом безопасности \`rel="noopener"\``,
  starterCode: `<!-- Ссылка с target="_blank" и rel="noopener" -->
`,
  solution: `<a href="https://google.com" target="_blank" rel="noopener">Открыть Google</a>`,
  tests: [
    { kind: "exists", selector: "a", description: "Есть тег <a>" },
    { kind: "attr", selector: "a", name: "href", equals: "https://google.com", description: 'href="https://google.com"' },
    { kind: "attr", selector: "a", name: "target", equals: "_blank", description: 'target="_blank"' },
    { kind: "attrExists", selector: "a", name: "rel", description: "Есть атрибут rel" },
    { kind: "text", selector: "a", equals: "Открыть Google", description: 'Текст ссылки — "Открыть Google"' },
  ],
  hints: [
    "У одного тега <a> может быть несколько атрибутов через пробел: <a href=\"...\" target=\"...\" rel=\"...\">текст</a>",
    "target должен быть точно _blank со строчной буквы и подчёркиванием. rel — \"noopener\" в кавычках.",
    'Полное решение:\n```html\n<a href="https://google.com" target="_blank" rel="noopener">Открыть Google</a>\n```',
  ],
  isAvailable: true,
};

export default lesson;
