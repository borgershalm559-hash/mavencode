import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "<video> — встраивание видео",
  order: 22,
  type: "code",
  language: "html",
  xpReward: 70,
  content: `# \`<video>\` — встраивание видео

## 🎯 После этого урока ты сможешь
- Встраивать видео на страницу
- Управлять элементами управления

## 📚 Теория

### Как пишется

\`\`\`html
<video src="movie.mp4" controls></video>
\`\`\`

Главное:
- \`<video>\` — тег с **закрывающим** тегом
- \`src\` — путь до видеофайла
- \`controls\` — **булевый** атрибут, добавляет встроенный плеер с кнопками play/pause/громкость

Без \`controls\` пользователь не сможет управлять видео — оно просто будет статичной картинкой.

### Полезные атрибуты

- \`width\` и \`height\` — размер плеера в пикселях
- \`autoplay\` — автозапуск при загрузке (но **браузер часто блокирует** автозапуск со звуком — это раздражает пользователя)
- \`muted\` — без звука (нужен для autoplay в большинстве браузеров)
- \`loop\` — зацикленное воспроизведение
- \`poster\` — картинка-превью пока видео не запустили

\`\`\`html
<video src="movie.mp4" controls width="640" poster="preview.jpg"></video>
\`\`\`

### Несколько форматов через \`<source>\`

Если хочешь дать браузеру выбор форматов:

\`\`\`html
<video controls width="640">
  <source src="movie.mp4" type="video/mp4">
  <source src="movie.webm" type="video/webm">
  Ваш браузер не поддерживает видео.
</video>
\`\`\`

Браузер выберет первый поддерживаемый формат. Текст между тегами — **запасной вариант** для очень старых браузеров.

### Доступность

Хорошая практика — добавить **субтитры** через \`<track>\`:

\`\`\`html
<video src="movie.mp4" controls>
  <track src="subs-ru.vtt" kind="subtitles" srclang="ru" label="Русский">
</video>
\`\`\`

Делает видео доступным для слабослышащих.

## 🛠️ Задание

Встрой видео:

- \`<video>\` с:
  - \`src="https://example.com/movie.mp4"\`
  - \`controls\`
  - \`width="640"\``,
  starterCode: `<!-- Тег video -->
`,
  solution: `<video src="https://example.com/movie.mp4" controls width="640"></video>`,
  tests: [
    { kind: "exists", selector: "video", description: "Есть <video>" },
    { kind: "attr", selector: "video", name: "src", equals: "https://example.com/movie.mp4", description: 'src указан верно' },
    { kind: "attrExists", selector: "video", name: "controls", description: "Есть атрибут controls" },
    { kind: "attr", selector: "video", name: "width", equals: "640", description: 'width="640"' },
  ],
  hints: [
    "<video> с тремя атрибутами через пробел: src, controls (булевый, без значения), width.",
    "Шаблон: <video src=\"...\" controls width=\"640\"></video>. Закрывающий тег </video> обязателен.",
    'Полное решение:\n```html\n<video src="https://example.com/movie.mp4" controls width="640"></video>\n```',
  ],
  isAvailable: true,
};

export default lesson;
