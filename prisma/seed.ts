import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // ── Course 1: JavaScript Основы (interactive lessons) ──
  await prisma.course.create({
    data: {
      title: "JavaScript Основы",
      description: "Основы JavaScript с нуля: переменные, функции, циклы и структуры данных. Интерактивные задания с проверкой кода.",
      tags: ["JS", "WEB"],
      difficulty: "beginner",
      estimatedHours: 4,
      lessons: {
        create: [
          {
            title: "Переменные и типы данных",
            order: 1,
            type: "code",
            language: "javascript",
            xpReward: 100,
            content: `# Переменные и типы данных

В JavaScript есть три способа объявить переменную:

\`\`\`javascript
let name = "Alice";    // можно менять
const age = 25;        // нельзя менять
var old = "устаревший"; // не используйте
\`\`\`

## Основные типы

- **string** — текст: \`"hello"\`
- **number** — числа: \`42\`, \`3.14\`
- **boolean** — \`true\` / \`false\`
- **undefined** — переменная без значения
- **null** — "пустое" значение

Оператор \`typeof\` возвращает тип значения:

\`\`\`javascript
typeof "hello" // "string"
typeof 42      // "number"
typeof true    // "boolean"
\`\`\`

---

## Задание

Напишите функцию \`getType(value)\`, которая возвращает тип переданного значения (используйте \`typeof\`).`,
            starterCode: `function getType(value) {
  // Верните тип значения

}`,
            solution: `function getType(value) {
  return typeof value;
}`,
            tests: JSON.stringify([
              { input: "getType(42)", expected: "number", description: "getType(42) должна вернуть 'number'" },
              { input: "getType('hello')", expected: "string", description: "getType('hello') должна вернуть 'string'" },
              { input: "getType(true)", expected: "boolean", description: "getType(true) должна вернуть 'boolean'" },
            ]),
            hints: JSON.stringify([
              "Используйте оператор `typeof` — он возвращает строку с названием типа.",
              "Функция должна вернуть результат: `return typeof value;`",
              "Полное решение:\n```javascript\nfunction getType(value) {\n  return typeof value;\n}\n```",
            ]),
          },
          {
            title: "Условные операторы",
            order: 2,
            type: "fill-blanks",
            language: "javascript",
            xpReward: 100,
            content: `# Условные операторы

Оператор \`if/else\` выполняет код в зависимости от условия:

\`\`\`javascript
if (age >= 18) {
  console.log("Взрослый");
} else {
  console.log("Несовершеннолетний");
}
\`\`\`

## Тернарный оператор

Короткая форма if/else:

\`\`\`javascript
const status = age >= 18 ? "adult" : "minor";
\`\`\`

---

## Задание

Заполните пропуски в функции \`checkAge\`, чтобы она возвращала \`"adult"\` для возраста >= 18 и \`"minor"\` иначе.`,
            starterCode: `function checkAge(age) {
  if (age ___ 18) {
    return "adult";
  } ___ {
    return "minor";
  }
}`,
            solution: `function checkAge(age) {
  if (age >= 18) {
    return "adult";
  } else {
    return "minor";
  }
}`,
            tests: JSON.stringify([
              { input: "checkAge(20)", expected: "adult", description: "checkAge(20) → 'adult'" },
              { input: "checkAge(18)", expected: "adult", description: "checkAge(18) → 'adult'" },
              { input: "checkAge(15)", expected: "minor", description: "checkAge(15) → 'minor'" },
            ]),
            hints: JSON.stringify([
              "Первый пропуск — оператор сравнения «больше или равно».",
              "Используйте `>=` для первого пропуска и `else` для второго.",
              "Полное решение:\n```javascript\nfunction checkAge(age) {\n  if (age >= 18) {\n    return \"adult\";\n  } else {\n    return \"minor\";\n  }\n}\n```",
            ]),
          },
          {
            title: "Циклы",
            order: 3,
            type: "code",
            language: "javascript",
            xpReward: 120,
            content: `# Циклы

## Цикл for

\`\`\`javascript
for (let i = 0; i < 5; i++) {
  console.log(i); // 0, 1, 2, 3, 4
}
\`\`\`

## Цикл while

\`\`\`javascript
let count = 0;
while (count < 3) {
  console.log(count);
  count++;
}
\`\`\`

## Полезные методы массивов

\`\`\`javascript
const nums = [1, 2, 3];
const sum = nums.reduce((acc, n) => acc + n, 0); // 6
\`\`\`

---

## Задание

Напишите функцию \`sumArray(arr)\`, которая возвращает сумму всех чисел в массиве. Используйте любой цикл или метод массива.`,
            starterCode: `function sumArray(arr) {
  // Верните сумму элементов массива

}`,
            solution: `function sumArray(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}`,
            tests: JSON.stringify([
              { input: "sumArray([1, 2, 3])", expected: "6", description: "sumArray([1, 2, 3]) → 6" },
              { input: "sumArray([10, -5, 3])", expected: "8", description: "sumArray([10, -5, 3]) → 8" },
              { input: "sumArray([])", expected: "0", description: "sumArray([]) → 0" },
            ]),
            hints: JSON.stringify([
              "Создайте переменную `sum = 0`, затем пройдитесь по массиву циклом и прибавляйте каждый элемент.",
              "Используйте цикл `for` внутри функции `sumArray`. Параметр `arr` — это массив, по которому нужно пройтись.",
              "Полное решение:\n```javascript\nfunction sumArray(arr) {\n  let sum = 0;\n  for (let i = 0; i < arr.length; i++) {\n    sum += arr[i];\n  }\n  return sum;\n}\n```\n\nИли короче, через `reduce`:\n```javascript\nfunction sumArray(arr) {\n  return arr.reduce((acc, n) => acc + n, 0);\n}\n```",
            ]),
          },
          {
            title: "Функции",
            order: 4,
            type: "code",
            language: "javascript",
            xpReward: 120,
            content: `# Функции

## Объявление функции

\`\`\`javascript
function greet(name) {
  return "Hello, " + name + "!";
}
\`\`\`

## Стрелочные функции

\`\`\`javascript
const greet = (name) => "Hello, " + name + "!";
\`\`\`

## Параметры по умолчанию

\`\`\`javascript
function greet(name = "World") {
  return "Hello, " + name + "!";
}
\`\`\`

---

## Задание

Напишите функцию \`multiply(a, b)\`, которая возвращает произведение двух чисел. Если \`b\` не передан, используйте значение по умолчанию \`1\`.`,
            starterCode: `function multiply(a, b) {
  // Верните произведение a и b
  // Если b не передан, используйте 1

}`,
            solution: `function multiply(a, b = 1) {
  return a * b;
}`,
            tests: JSON.stringify([
              { input: "multiply(3, 4)", expected: "12", description: "multiply(3, 4) → 12" },
              { input: "multiply(5)", expected: "5", description: "multiply(5) → 5 (b по умолчанию 1)" },
              { input: "multiply(0, 100)", expected: "0", description: "multiply(0, 100) → 0" },
            ]),
            hints: JSON.stringify([
              "Используйте параметр по умолчанию: `function multiply(a, b = 1)`",
              "Тело функции: `return a * b;`",
              "Полное решение:\n```javascript\nfunction multiply(a, b = 1) {\n  return a * b;\n}\n```",
            ]),
          },
          {
            title: "Найди баг",
            order: 5,
            type: "fix-bug",
            language: "javascript",
            xpReward: 150,
            content: `# Отладка: найди баг

Отладка — важный навык программиста. В этом задании нужно найти и исправить ошибку в коде.

## Типичные ошибки

- **Off-by-one** — цикл проходит на 1 итерацию больше/меньше
- **Неправильный оператор** — \`=\` вместо \`===\`
- **Забытый return** — функция ничего не возвращает

---

## Задание

Функция \`findMax\` должна возвращать **максимальное** число из массива, но в ней есть баг. Найдите и исправьте его.`,
            starterCode: `function findMax(arr) {
  let max = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}`,
            solution: `function findMax(arr) {
  let max = -Infinity;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}`,
            tests: JSON.stringify([
              { input: "findMax([1, 5, 3])", expected: "5", description: "findMax([1, 5, 3]) → 5" },
              { input: "findMax([-10, -3, -7])", expected: "-3", description: "findMax([-10, -3, -7]) → -3 (отрицательные числа)" },
              { input: "findMax([42])", expected: "42", description: "findMax([42]) → 42" },
            ]),
            hints: JSON.stringify([
              "Проблема в начальном значении `max`. Что будет, если все числа отрицательные?",
              "Замените `let max = 0` на `let max = -Infinity` или `let max = arr[0]`.",
              "Полное решение:\n```javascript\nfunction findMax(arr) {\n  let max = -Infinity;\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] > max) {\n      max = arr[i];\n    }\n  }\n  return max;\n}\n```",
            ]),
          },
          {
            title: "Тест: основы JS",
            order: 6,
            type: "quiz",
            language: "javascript",
            xpReward: 80,
            content: `# Тест: основы JavaScript

Проверьте свои знания основ JavaScript. Выберите правильный ответ на каждый вопрос.

> Подсказка: вспомните уроки о переменных, условиях, циклах и функциях.`,
            starterCode: null,
            solution: null,
            tests: JSON.stringify([
              { input: "Что вернёт typeof null?", expected: "object", description: "object,undefined,null,string" },
              { input: "Какое ключевое слово создаёт неизменяемую переменную?", expected: "const", description: "let,const,var,static" },
              { input: "Чему равно 0.1 + 0.2 === 0.3?", expected: "false", description: "true,false,undefined,NaN" },
              { input: "Какой метод добавляет элемент в конец массива?", expected: "push", description: "push,pop,unshift,append" },
              { input: "Что вернёт [1,2,3].length?", expected: "3", description: "2,3,4,undefined" },
            ]),
            hints: JSON.stringify([
              "typeof null — это известный баг JavaScript, результат неожиданный.",
              "const запрещает переприсваивание, let — разрешает.",
              "Из-за IEEE 754: 0.1 + 0.2 === 0.30000000000000004",
            ]),
          },
        ],
      },
    },
  });
  console.log("✓ Course 'JavaScript Основы' created");

  // ── Course 2: Python Основы (interactive lessons) ──
  await prisma.course.create({
    data: {
      title: "Python Основы",
      description: "Основы Python: переменные, списки, функции и словари. Код выполняется прямо в браузере через Pyodide.",
      tags: ["PYTHON"],
      difficulty: "beginner",
      estimatedHours: 3,
      lessons: {
        create: [
          {
            title: "Hello Python",
            order: 1,
            type: "code",
            language: "python",
            xpReward: 100,
            content: `# Привет, Python!

Python — один из самых популярных языков программирования. Он прост и читаем.

\`\`\`python
print("Hello, World!")
name = "Alice"
age = 25
print(f"Меня зовут {name}, мне {age} лет")
\`\`\`

## Основные типы

- \`str\` — строки: \`"hello"\`
- \`int\` — целые числа: \`42\`
- \`float\` — дробные: \`3.14\`
- \`bool\` — \`True\` / \`False\`
- \`list\` — списки: \`[1, 2, 3]\`

---

## Задание

Напишите функцию \`greet(name)\`, которая возвращает строку \`"Hello, {name}!"\`.`,
            starterCode: `def greet(name):
    # Верните приветствие
    pass`,
            solution: `def greet(name):
    return f"Hello, {name}!"`,
            tests: JSON.stringify([
              { input: "str(greet('Alice'))", expected: "Hello, Alice!", description: "greet('Alice') → 'Hello, Alice!'" },
              { input: "str(greet('World'))", expected: "Hello, World!", description: "greet('World') → 'Hello, World!'" },
            ]),
            hints: JSON.stringify([
              "Используйте f-строку: `f\"Hello, {name}!\"`",
              "Полное решение:\n```python\ndef greet(name):\n    return f\"Hello, {name}!\"\n```",
            ]),
          },
          {
            title: "Списки",
            order: 2,
            type: "fill-blanks",
            language: "python",
            xpReward: 100,
            content: `# Списки (lists)

Списки — основная структура данных в Python:

\`\`\`python
fruits = ["apple", "banana", "cherry"]
fruits.append("date")     # добавить в конец
fruits.remove("banana")   # удалить по значению
print(len(fruits))        # длина: 3
\`\`\`

## Срезы (slices)

\`\`\`python
nums = [0, 1, 2, 3, 4]
nums[1:3]   # [1, 2]
nums[:2]    # [0, 1]
nums[-1]    # 4
\`\`\`

---

## Задание

Заполните пропуски, чтобы функция возвращала сумму всех чисел в списке.`,
            starterCode: `def sum_list(numbers):
    total = ___
    for num in ___:
        total ___ num
    return total`,
            solution: `def sum_list(numbers):
    total = 0
    for num in numbers:
        total += num
    return total`,
            tests: JSON.stringify([
              { input: "str(sum_list([1, 2, 3]))", expected: "6", description: "sum_list([1, 2, 3]) → 6" },
              { input: "str(sum_list([]))", expected: "0", description: "sum_list([]) → 0" },
              { input: "str(sum_list([10, -5]))", expected: "5", description: "sum_list([10, -5]) → 5" },
            ]),
            hints: JSON.stringify([
              "Пропуски: начальное значение `0`, итерируем по `numbers`, оператор `+=`.",
              "```python\ntotal = 0\nfor num in numbers:\n    total += num\n```",
            ]),
          },
          {
            title: "Функции",
            order: 3,
            type: "code",
            language: "python",
            xpReward: 120,
            content: `# Функции в Python

\`\`\`python
def add(a, b):
    return a + b

# Значения по умолчанию
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"
\`\`\`

## Аннотации типов

\`\`\`python
def add(a: int, b: int) -> int:
    return a + b
\`\`\`

---

## Задание

Напишите функцию \`fizzbuzz(n)\`, которая возвращает:
- \`"FizzBuzz"\` если \`n\` делится на 3 и на 5
- \`"Fizz"\` если только на 3
- \`"Buzz"\` если только на 5
- Строковое представление числа в остальных случаях`,
            starterCode: `def fizzbuzz(n):
    # Реализуйте FizzBuzz
    pass`,
            solution: `def fizzbuzz(n):
    if n % 15 == 0:
        return "FizzBuzz"
    elif n % 3 == 0:
        return "Fizz"
    elif n % 5 == 0:
        return "Buzz"
    else:
        return str(n)`,
            tests: JSON.stringify([
              { input: "str(fizzbuzz(15))", expected: "FizzBuzz", description: "fizzbuzz(15) → 'FizzBuzz'" },
              { input: "str(fizzbuzz(9))", expected: "Fizz", description: "fizzbuzz(9) → 'Fizz'" },
              { input: "str(fizzbuzz(10))", expected: "Buzz", description: "fizzbuzz(10) → 'Buzz'" },
              { input: "str(fizzbuzz(7))", expected: "7", description: "fizzbuzz(7) → '7'" },
            ]),
            hints: JSON.stringify([
              "Проверяйте делимость на 15 (3×5) первым, иначе условия на 3 и 5 сработают раньше.",
              "Используйте оператор `%` (остаток от деления) и `elif` для цепочки условий.",
              "Полное решение:\n```python\ndef fizzbuzz(n):\n    if n % 15 == 0:\n        return \"FizzBuzz\"\n    elif n % 3 == 0:\n        return \"Fizz\"\n    elif n % 5 == 0:\n        return \"Buzz\"\n    else:\n        return str(n)\n```",
            ]),
          },
          {
            title: "Словари",
            order: 4,
            type: "code",
            language: "python",
            xpReward: 120,
            content: `# Словари (dict)

Словарь — пары ключ-значение:

\`\`\`python
user = {"name": "Alice", "age": 25}
user["name"]        # "Alice"
user.get("email")   # None (нет ключа)
user["email"] = "a@b.com"  # добавить
\`\`\`

## Полезные методы

\`\`\`python
user.keys()    # dict_keys(["name", "age", "email"])
user.values()  # dict_values(["Alice", 25, "a@b.com"])
user.items()   # dict_items([("name", "Alice"), ...])
\`\`\`

---

## Задание

Напишите функцию \`count_words(text)\`, которая принимает строку и возвращает словарь, где ключ — слово, значение — количество вхождений. Слова разделены пробелами, регистр не учитывать.`,
            starterCode: `def count_words(text):
    # Верните словарь {слово: количество}
    pass`,
            solution: `def count_words(text):
    words = text.lower().split()
    result = {}
    for word in words:
        result[word] = result.get(word, 0) + 1
    return result`,
            tests: JSON.stringify([
              { input: "str(count_words('hello world hello'))", expected: "{'hello': 2, 'world': 1}", description: "count_words('hello world hello') → {'hello': 2, 'world': 1}" },
              { input: "str(count_words('a'))", expected: "{'a': 1}", description: "count_words('a') → {'a': 1}" },
              { input: "str(count_words('Hi hi HI'))", expected: "{'hi': 3}", description: "count_words('Hi hi HI') → {'hi': 3} (регистр не важен)" },
            ]),
            hints: JSON.stringify([
              "Используйте `text.lower().split()` чтобы разбить строку на слова в нижнем регистре.",
              "`dict.get(key, 0)` вернёт 0 если ключа нет — удобно для подсчёта.",
              "Полное решение:\n```python\ndef count_words(text):\n    words = text.lower().split()\n    result = {}\n    for word in words:\n        result[word] = result.get(word, 0) + 1\n    return result\n```",
            ]),
          },
        ],
      },
    },
  });
  console.log("✓ Course 'Python Основы' created");

  // ── Remaining courses (simple, non-interactive) ──
  const simpleCourses = [
    {
      title: "React 19 Fundamentals",
      description: "Полный курс по React 19: хуки, серверные компоненты, Suspense и современные паттерны.",
      tags: ["WEB", "REACT"],
      difficulty: "intermediate",
      estimatedHours: 8,
      lessons: [
        "Введение в React 19", "JSX и компоненты", "Props и State",
        "Хуки: useState, useEffect", "useContext и useReducer",
        "Серверные компоненты", "Suspense и Transitions",
        "React Compiler", "Формы и Actions", "Оптимизация рендеринга",
      ],
    },
    {
      title: "TypeScript Pro",
      description: "Продвинутый TypeScript: generics, utility types, типизация библиотек и DX.",
      tags: ["TS"],
      difficulty: "advanced",
      estimatedHours: 6,
      lessons: [
        "Основы типов", "Интерфейсы и типы", "Union и Intersection",
        "Generics: основы", "Generics: ограничения", "Conditional Types",
        "Mapped Types", "Template Literal Types", "Utility Types",
      ],
    },
    {
      title: "Next.js App Router",
      description: "Next.js 15+ App Router: серверные компоненты, streaming, middleware и deployment.",
      tags: ["NEXT"],
      difficulty: "intermediate",
      estimatedHours: 7,
      lessons: [
        "Архитектура App Router", "Layouts и Templates",
        "Server Components", "Client Components", "Data Fetching",
        "Server Actions", "Middleware", "Streaming и Suspense",
      ],
    },
    {
      title: "Advanced CSS",
      description: "Продвинутый CSS: Grid, анимации, custom properties, container queries.",
      tags: ["CSS"],
      difficulty: "intermediate",
      estimatedHours: 4,
      lessons: [
        "CSS Grid: основы", "Grid: сложные лейауты",
        "CSS Custom Properties", "Анимации и transitions",
        "Container Queries", "@layer и каскад",
      ],
    },
  ];

  for (const c of simpleCourses) {
    await prisma.course.create({
      data: {
        title: c.title,
        description: c.description,
        tags: c.tags,
        difficulty: c.difficulty,
        estimatedHours: c.estimatedHours,
        lessons: {
          create: c.lessons.map((title, i) => ({
            title,
            content: `Содержание урока: ${title}`,
            order: i + 1,
          })),
        },
      },
    });
  }

  console.log(`✓ ${simpleCourses.length + 2} courses created`);

  // ── Achievements ──
  const achievements = [
    { title: "Starter", description: "Завершил первый урок", icon: "rocket" },
    { title: "TypeSafe", description: "Прошёл курс TypeScript", icon: "shield" },
    { title: "UI Master", description: "Прошёл курс Design Systems", icon: "palette" },
    { title: "Sprinter", description: "5 уроков за день", icon: "zap" },
    { title: "Marathon", description: "30 дней подряд", icon: "flame" },
  ];

  for (const a of achievements) {
    const existing = await prisma.achievement.findFirst({ where: { title: a.title } });
    if (existing) {
      await prisma.achievement.update({
        where: { id: existing.id },
        data: { description: a.description, icon: a.icon },
      });
    } else {
      await prisma.achievement.create({ data: a });
    }
  }

  console.log(`✓ ${achievements.length} achievements upserted`);

  // ── News ──
  const news = [
    {
      title: "Обновление платформы 4.0.0",
      category: "Обновление",
      body: `## Что нового

Крупное обновление платформы с множеством улучшений для комфортного обучения.

### Производительность

- **Скорость загрузки** — оптимизация на 40%, мгновенные переходы между страницами
- **Кэширование данных** — SWR с умной ревалидацией, меньше запросов к серверу
- **Оптимизация запросов** — устранены N+1 проблемы в API

### Новый интерфейс

- Обновлённые **анимации** и переходы на Framer Motion
- **Glassmorphism** карточки с cursor glow эффектом
- Полностью адаптивная вёрстка для мобильных устройств

### Библиотека

Добавлены новые ресурсы в библиотеку.

> Обновление уже доступно для всех пользователей. Просто обновите страницу!`,
      summary: "Улучшения производительности, новые компоненты UI, обновлённые анимации и оптимизация для мобильных устройств.",
      imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=500&fit=crop",
      pinned: true,
      publishedAt: new Date("2026-03-03"),
    },
    {
      title: "Запуск весеннего интенсива",
      category: "Событие",
      body: `## Весенний интенсив по фронтенду

Стартует интенсивная программа по современному фронтенду. Если вы хотите прокачать навыки — это ваш шанс!

### Что будем изучать

- **React 19** — новые хуки, Server Components, Suspense
- **Next.js App Router** — маршрутизация, middleware, серверные действия
- **TypeScript** — продвинутые типы, generics, utility types
- **Системы дизайна** — Tailwind CSS, компонентная архитектура

### Формат обучения

Ежедневные короткие занятия по **30-40 минут** и проектная работа в команде. Каждую неделю — code review от ментора.

### Как записаться

Регистрация открыта до **10 марта**. Количество мест ограничено — всего 50 участников.

> Интенсив бесплатный для пользователей с уровнем 5 и выше`,
      summary: "Стартует интенсив по современному фронтенду: React 19, Next.js App Router и TypeScript best practices.",
      imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=500&fit=crop",
      publishedAt: new Date("2026-03-02"),
    },
    {
      title: "Новые ресурсы в библиотеке",
      category: "Объявление",
      body: `## Пополнение библиотеки

Мы добавили подборку материалов, которые помогут закрепить знания и углубиться в отдельные темы.

### Новые материалы

- **PDF-гайд по TypeScript** — подробный справочник: типы, generics, utility types и советы по типизации реальных проектов
- **Видеолекции по React Hooks** — углублённый разбор \`useState\`, \`useEffect\`, \`useRef\` и кастомных хуков
- **Шаблон проекта Next.js** — готовая структура с авторизацией, API и базой данных

### Как получить доступ

Все ресурсы доступны в разделе **Библиотека** в боковом меню. Скачивайте, изучайте и применяйте в своих проектах!`,
      summary: "PDF-гайды по TypeScript, видеолекции по React Hooks и готовый шаблон проекта для Next.js.",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=500&fit=crop",
      publishedAt: new Date("2026-03-01"),
    },
  ];

  for (const n of news) {
    await prisma.news.create({ data: n });
  }

  console.log(`✓ ${news.length} news created`);

  // ── Library Resources ──
  const resources = [
    { title: "Гайд по TypeScript", kind: "PDF", size: "2.4MB", body: "Подробный справочник по TS: типы, generics, utility types и советы по типизации реальных проектов." },
    { title: "React Hooks Deep Dive", kind: "Видео", size: "18мин", body: "Углублённый разбор основных хуков React и паттернов композиции состояний." },
    { title: "CSS Grid Cheatsheet", kind: "Шпаргалка", size: "1стр", body: "Краткая выжимка по CSS Grid с примерами областей и шаблонов." },
    { title: "Next.js Boilerplate", kind: "Проект", size: "Git", body: "Готовый шаблон проекта на Next.js с базовой структурой, линтингом и настроенным стилем." },
    { title: "Node Streams", kind: "PDF", size: "1.1MB", body: "Практическое руководство по потокам в Node.js, механизмам backpressure и пайплайнам." },
    { title: "Design Tokens", kind: "Шпаргалка", size: "2стр", body: "Основы дизайн‑токенов и организация их в больших проектах." },
  ];

  for (const r of resources) {
    await prisma.libraryResource.create({ data: r });
  }

  console.log(`✓ ${resources.length} library resources created`);

  console.log("\n🌱 Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
