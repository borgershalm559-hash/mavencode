import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "<audio> — встраивание аудио",
  order: 23,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# \`<audio>\` — встраивание аудио

## 🎯 После этого урока ты сможешь
- Встраивать аудио на страницу
- Делать плеер для подкастов и музыки

## 📚 Теория

### Как пишется

\`<audio>\` работает почти так же как \`<video>\`, только без видеоряда. Используется для подкастов, музыки, голосовых сообщений.

\`\`\`html
<audio src="podcast.mp3" controls></audio>
\`\`\`

- \`src\` — путь к аудиофайлу
- \`controls\` — встроенный плеер с play/pause/громкость/полоска прокрутки

Без \`controls\` плеер **невидим** — пользователь не сможет ничего сделать.

### Атрибуты

- \`autoplay\` — автозапуск (часто блокируется)
- \`loop\` — зацикливание
- \`muted\` — без звука
- \`preload\` — \`auto\`/\`metadata\`/\`none\` — сколько грузить заранее

\`\`\`html
<audio src="podcast.mp3" controls preload="metadata"></audio>
\`\`\`

\`preload="metadata"\` — загрузить только длительность и обложку, сам файл — когда нажмут play. Экономит трафик.

### Несколько форматов

Как с видео — можно дать выбор:

\`\`\`html
<audio controls>
  <source src="song.mp3" type="audio/mpeg">
  <source src="song.ogg" type="audio/ogg">
  Ваш браузер не поддерживает аудио.
</audio>
\`\`\`

### Поддерживаемые форматы

- **MP3** — практически везде
- **OGG/Vorbis** — открытый формат, хорошее сжатие
- **AAC** — обычно в \`.m4a\` файлах
- **WAV** — без сжатия, тяжёлый, для редких случаев

Самый универсальный — MP3.

## 🛠️ Задание

Встрой аудио:

- \`<audio>\` с:
  - \`src="https://example.com/podcast.mp3"\`
  - \`controls\`
  - \`preload="metadata"\``,
  starterCode: `<!-- Тег audio -->
`,
  solution: `<audio src="https://example.com/podcast.mp3" controls preload="metadata"></audio>`,
  tests: [
    { kind: "exists", selector: "audio", description: "Есть <audio>" },
    { kind: "attr", selector: "audio", name: "src", equals: "https://example.com/podcast.mp3", description: 'src указан верно' },
    { kind: "attrExists", selector: "audio", name: "controls", description: "Есть атрибут controls" },
    { kind: "attr", selector: "audio", name: "preload", equals: "metadata", description: 'preload="metadata"' },
  ],
  hints: [
    "<audio> с тремя атрибутами: src, controls, preload.",
    "Шаблон: <audio src=\"...\" controls preload=\"metadata\"></audio>",
    'Полное решение:\n```html\n<audio src="https://example.com/podcast.mp3" controls preload="metadata"></audio>\n```',
  ],
  isAvailable: true,
};

export default lesson;
