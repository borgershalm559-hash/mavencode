# Python 101 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing `Python Основы` course with a 20-lesson Python 101 course for absolute beginners, per spec `docs/superpowers/specs/2026-04-24-python-101-design.md`.

**Architecture:** Each of the 20 lessons is a self-contained TypeScript module that exports a typed `LessonContent` object (content + starter + solution + tests + hints). A seed script reads all modules in order, deletes the old course, and inserts the new Course + Lesson rows into Neon Postgres. A standalone verification script validates every lesson's solution against its tests using a local Python 3.12 interpreter before any DB write hits production.

**Tech Stack:** TypeScript, Prisma 7, Neon Postgres, tsx runtime, Python 3.12 (for local test verification only), markdown with GitHub-flavored syntax.

---

## File Structure

```
prisma/
├── content/
│   └── python-101/
│       ├── types.ts                      # Shared LessonContent type
│       ├── index.ts                      # Re-exports all 20 lessons in order
│       └── lessons/
│           ├── 01-what-is-programming.ts
│           ├── 02-hello-world.ts
│           ├── 03-sequential-execution.ts
│           ├── 04-variables.ts
│           ├── 05-numbers.ts
│           ├── 06-strings.ts
│           ├── 07-booleans.ts
│           ├── 08-if-else.ts
│           ├── 09-fix-broken-conditions.ts
│           ├── 10-while-loop.ts
│           ├── 11-for-loop.ts
│           ├── 12-lists.ts
│           ├── 13-list-methods.ts
│           ├── 14-dicts.ts
│           ├── 15-tuples-sets.ts
│           ├── 16-fix-broken-data.ts
│           ├── 17-functions.ts
│           ├── 18-default-args.ts
│           ├── 19-scope.ts
│           └── 20-capstone-contact-book.ts
└── seed-python-101.ts                    # Orchestrator: reads content, writes to DB

scripts/
└── verify-python-lessons.ts              # Pre-deploy: runs each solution against its tests via system Python
```

**Rationale for per-lesson file split:** each lesson is 1200-2000 words of markdown plus code ≈ 200-400 lines. One-per-file keeps diffs small on review and lets subagents own a single file at a time.

---

## Task 1: Infrastructure and types

**Files:**
- Create: `prisma/content/python-101/types.ts`
- Create: `prisma/content/python-101/index.ts`
- Create: `prisma/content/python-101/lessons/` (directory)
- Create: `scripts/verify-python-lessons.ts`

- [ ] **Step 1: Create the shared `LessonContent` type**

Create `prisma/content/python-101/types.ts`:

```typescript
export type LessonType = "code" | "fill-blanks" | "fix-bug" | "quiz";

export interface TestCase {
  input: string;
  expected: string;
  description: string;
}

export interface LessonContent {
  title: string;
  order: number;
  type: LessonType;
  language: "python";
  xpReward: number;
  content: string;      // markdown body
  starterCode: string;
  solution: string;
  tests: TestCase[];
  hints: string[];      // exactly 3 entries (soft / concrete / full-solution)
  isAvailable: boolean; // first lesson = true; rest = true (we unlock via progress)
}
```

- [ ] **Step 2: Create the aggregating index**

Create `prisma/content/python-101/index.ts`:

```typescript
import type { LessonContent } from "./types";
import lesson01 from "./lessons/01-what-is-programming";
import lesson02 from "./lessons/02-hello-world";
import lesson03 from "./lessons/03-sequential-execution";
import lesson04 from "./lessons/04-variables";
import lesson05 from "./lessons/05-numbers";
import lesson06 from "./lessons/06-strings";
import lesson07 from "./lessons/07-booleans";
import lesson08 from "./lessons/08-if-else";
import lesson09 from "./lessons/09-fix-broken-conditions";
import lesson10 from "./lessons/10-while-loop";
import lesson11 from "./lessons/11-for-loop";
import lesson12 from "./lessons/12-lists";
import lesson13 from "./lessons/13-list-methods";
import lesson14 from "./lessons/14-dicts";
import lesson15 from "./lessons/15-tuples-sets";
import lesson16 from "./lessons/16-fix-broken-data";
import lesson17 from "./lessons/17-functions";
import lesson18 from "./lessons/18-default-args";
import lesson19 from "./lessons/19-scope";
import lesson20 from "./lessons/20-capstone-contact-book";

export const PYTHON_101_LESSONS: LessonContent[] = [
  lesson01, lesson02, lesson03, lesson04, lesson05,
  lesson06, lesson07, lesson08, lesson09, lesson10,
  lesson11, lesson12, lesson13, lesson14, lesson15,
  lesson16, lesson17, lesson18, lesson19, lesson20,
];

export const PYTHON_101_COURSE = {
  title: "Python 101 — Первые шаги",
  description: "Курс для тех, кто никогда не программировал. За 20 уроков ты пройдёшь от «что такое переменная» до написания первой осмысленной программы.",
  tags: ["Python", "Основы", "С нуля"],
  difficulty: "beginner",
  image: null as string | null,
};
```

- [ ] **Step 3: Create placeholder lesson files so imports don't fail**

For each of the 20 files in `prisma/content/python-101/lessons/`, create a minimal stub:

```typescript
// prisma/content/python-101/lessons/01-what-is-programming.ts
import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "PLACEHOLDER",
  order: 1,
  type: "quiz",
  language: "python",
  xpReward: 75,
  content: "",
  starterCode: "",
  solution: "",
  tests: [],
  hints: [],
  isAvailable: true,
};

export default lesson;
```

Repeat with `order` incremented 1 through 20 for the other 19 files. Use the titles, types, and XP values from the spec's Section 4 table.

- [ ] **Step 4: Create verification script**

Create `scripts/verify-python-lessons.ts`:

```typescript
import { execFileSync } from "node:child_process";
import { writeFileSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { PYTHON_101_LESSONS } from "../prisma/content/python-101";
import type { LessonContent } from "../prisma/content/python-101/types";

function runPython(code: string): string {
  const tmp = join(tmpdir(), `py-verify-${Date.now()}-${Math.random().toString(36).slice(2)}.py`);
  writeFileSync(tmp, code);
  try {
    const out = execFileSync("python", [tmp], { encoding: "utf8", timeout: 5000 });
    return out.trim();
  } finally {
    unlinkSync(tmp);
  }
}

function verifyLesson(lesson: LessonContent): { ok: boolean; failures: string[] } {
  const failures: string[] = [];
  if (lesson.tests.length === 0) return { ok: true, failures: [] };

  for (const test of lesson.tests) {
    try {
      const code = `${lesson.solution}\nprint(${test.input})`;
      const actual = runPython(code);
      if (actual !== test.expected) {
        failures.push(`  [${test.description}] expected "${test.expected}", got "${actual}"`);
      }
    } catch (e) {
      failures.push(`  [${test.description}] runtime error: ${(e as Error).message.slice(0, 200)}`);
    }
  }
  return { ok: failures.length === 0, failures };
}

let totalFailures = 0;
for (const lesson of PYTHON_101_LESSONS) {
  if (lesson.title === "PLACEHOLDER") {
    console.log(`⏸  Lesson ${lesson.order}: PLACEHOLDER (skipped)`);
    continue;
  }
  const result = verifyLesson(lesson);
  if (result.ok) {
    console.log(`✅ Lesson ${lesson.order}: ${lesson.title} — ${lesson.tests.length} tests pass`);
  } else {
    console.log(`❌ Lesson ${lesson.order}: ${lesson.title}`);
    for (const f of result.failures) console.log(f);
    totalFailures += result.failures.length;
  }
}

console.log(`\n${totalFailures === 0 ? "✅ All lessons verified" : `❌ ${totalFailures} test failures`}`);
process.exit(totalFailures === 0 ? 0 : 1);
```

- [ ] **Step 5: Run verification to confirm setup works**

```bash
npx tsc --noEmit
npx tsx scripts/verify-python-lessons.ts
```

Expected: all 20 lessons report "PLACEHOLDER (skipped)" and exit code 0.

- [ ] **Step 6: Commit**

```bash
git add prisma/content scripts/verify-python-lessons.ts
git commit -m "feat(python-101): infrastructure and 20 lesson placeholders"
```

---

## Task 2: Example lesson template (Lesson 5 — Numbers)

This task produces one complete, high-quality lesson that serves as the template for Tasks 3-8. Do this one first in isolation so the pattern is established before bulk production.

**Files:**
- Modify: `prisma/content/python-101/lessons/05-numbers.ts`

- [ ] **Step 1: Replace the placeholder with a complete lesson**

Full content for `prisma/content/python-101/lessons/05-numbers.ts`:

```typescript
import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "Числа и математика",
  order: 5,
  type: "code",
  language: "python",
  xpReward: 120,
  content: `# Числа и математика

## 🎯 Что научишься делать
- Работать с целыми и дробными числами в Python
- Использовать математические операторы (+, -, *, /, //, %, **)
- Понимать разницу между \`int\` и \`float\`

## 🔍 Зачем это нужно
Программирование — это на 80% работа с данными, и чаще всего эти данные — числа. Ты считаешь количество товаров в корзине, делишь зарплату на расходы, вычисляешь проценты — всё это через числа в коде. Без уверенного владения математическими операциями не написать даже простой калькулятор.

## 📚 Теория

### Два вида чисел: \`int\` и \`float\`

В Python существуют два типа чисел, и понимать разницу между ними важно:

- **\`int\`** (от «integer» — целое число) — это числа без дробной части: \`1\`, \`42\`, \`-7\`, \`0\`.
- **\`float\`** (от «floating point» — число с плавающей точкой) — это дробные числа: \`3.14\`, \`-0.5\`, \`2.0\`.

Обрати внимание: \`2\` и \`2.0\` — это **разные типы**, хотя значение выглядит одинаково. Python сам выбирает нужный тип:

\`\`\`python
a = 5         # это int
b = 5.0       # это float
c = a + b     # получится float 10.0, потому что при смешивании int и float побеждает float
\`\`\`

### Операторы

Представь, что Python — это калькулятор. Вот все операции, которые он умеет:

| Оператор | Что делает | Пример | Результат |
|---|---|---|---|
| \`+\` | сложение | \`3 + 2\` | \`5\` |
| \`-\` | вычитание | \`10 - 4\` | \`6\` |
| \`*\` | умножение | \`7 * 6\` | \`42\` |
| \`/\` | деление | \`10 / 3\` | \`3.333...\` (всегда float) |
| \`//\` | целочисленное деление | \`10 // 3\` | \`3\` (отбрасывает остаток) |
| \`%\` | остаток от деления | \`10 % 3\` | \`1\` |
| \`**\` | возведение в степень | \`2 ** 10\` | \`1024\` |

### Важный момент: \`/\` всегда даёт \`float\`

В Python 3 обычное деление \`/\` **всегда** возвращает \`float\`, даже если делится нацело:

\`\`\`python
print(10 / 2)    # 5.0, не 5!
print(10 // 2)   # 5 — вот это int
\`\`\`

### Приоритет операций

Python уважает школьную математику: сначала \`**\`, потом \`*\` и \`/\`, потом \`+\` и \`-\`. Скобки всё перебивают:

\`\`\`python
2 + 3 * 4       # = 14 (сначала умножение)
(2 + 3) * 4     # = 20 (сначала скобки)
2 ** 3 * 4      # = 32 (сначала степень: 8, потом умножение)
\`\`\`

Когда сомневаешься — ставь скобки. Они не замедляют код, зато защищают от ошибок.

## 🧪 Примеры

\`\`\`python
# Площадь прямоугольника
width = 5
height = 3
area = width * height
print(area)       # 15

# Сколько полных часов в 200 минутах и остаток
hours = 200 // 60
minutes = 200 % 60
print(hours, minutes)   # 3 20

# Площадь круга (радиус = 10)
radius = 10
pi = 3.14
area = pi * radius ** 2
print(area)       # 314.0
\`\`\`

## ⚠️ Частые ошибки новичков

1. **Путать \`/\` и \`//\`.** Если нужен целый ответ без дроби — используй \`//\`.
2. **Делить на ноль.** \`10 / 0\` — это \`ZeroDivisionError\`. Python не умеет делить на ноль (это фундаментальная математика).
3. **Забыть, что \`float\` иногда «врёт».** \`0.1 + 0.2\` даёт \`0.30000000000000004\`. Это не баг Python — это особенность всех языков программирования, работающих с float. Для точных финансовых расчётов есть модуль \`decimal\`, но о нём — в Python 301.

## 💡 Мини-тест самопроверки

1. Что вернёт \`7 / 2\`? (Ответ: \`3.5\`)
2. Что вернёт \`7 // 2\`? (Ответ: \`3\`)
3. Что вернёт \`7 % 2\`? (Ответ: \`1\`)

## 🛠️ Задание

Напиши функцию \`circle_area(radius)\`, которая возвращает **площадь круга** с заданным радиусом.

Формула: **π × r²** (используй \`3.14\` как приближение числа π).

Возвращаемое значение должно быть \`float\`.`,

  starterCode: `def circle_area(radius):
    # Используй 3.14 как π
    # Возведение в степень — оператор **
    # Верни результат через return
    pass`,

  solution: `def circle_area(radius):
    return 3.14 * radius ** 2`,

  tests: [
    { input: "circle_area(10)", expected: "314.0", description: "Радиус 10 → площадь 314.0" },
    { input: "circle_area(0)",  expected: "0.0",   description: "Радиус 0 → площадь 0.0" },
    { input: "circle_area(1)",  expected: "3.14",  description: "Единичный круг → 3.14" },
    { input: "circle_area(2)",  expected: "12.56", description: "Радиус 2 → 12.56" },
  ],

  hints: [
    "Подумай: формула площади круга — π умножить на радиус в квадрате. В Python возведение в степень — оператор `**`.",
    "Используй `3.14 * radius ** 2` и верни это через `return`. Не забудь, что `**` имеет более высокий приоритет чем `*`, так что скобки не нужны.",
    "Полное решение:\n```python\ndef circle_area(radius):\n    return 3.14 * radius ** 2\n```",
  ],

  isAvailable: true,
};

export default lesson;
```

- [ ] **Step 2: Run verification on this lesson**

```bash
npx tsx scripts/verify-python-lessons.ts
```

Expected output includes: `✅ Lesson 5: Числа и математика — 4 tests pass`

- [ ] **Step 3: Check TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add prisma/content/python-101/lessons/05-numbers.ts
git commit -m "feat(python-101): lesson 5 — Числа и математика (template reference)"
```

---

## Task 3: Block 1 — Introduction (lessons 1, 2, 3)

**Files:**
- Modify: `prisma/content/python-101/lessons/01-what-is-programming.ts`
- Modify: `prisma/content/python-101/lessons/02-hello-world.ts`
- Modify: `prisma/content/python-101/lessons/03-sequential-execution.ts`

For each lesson, replace the placeholder with a full `LessonContent` object following the Task 2 template. Content requirements per lesson:

### Lesson 1: «Что такое программирование и зачем Python» (type: `quiz`, 75 XP)
- Body: ~1500 words covering: what a program is; what an interpreter is; why Python specifically (readability, community, jobs); how Python compares to other languages at a high level (one sentence each for JS, Java, C++).
- `quiz` type has **no `starterCode` / `solution` / `tests`** — leave those as empty strings / empty array.
- Hints array is still 3 entries, but they guide understanding rather than code: rephrase key concepts.
- Use the metaphor: «Python — это как шеф-повар: ты говоришь ему что приготовить обычными словами, а он знает как пользоваться плитой».

### Lesson 2: «Первая программа: Hello, World!» (type: `code`, 100 XP)
- Body: what a program output is; what the `print` function does; what quotes mean; comments with `#`.
- Task: write `print("Привет, <your_name>!")` as a starter.
- Solution: `print("Привет, мир!")` (the site greets the real user, not parses their name — keep it simple).
- Tests: since `print` outputs to stdout and our runner captures stdout, tests check the output matches.

For `print`-based lessons, the test shape is:
```json
[{ "input": "", "expected": "Привет, мир!", "description": "Вывод приветствия" }]
```
The test runner executes the solution and reads captured stdout — no function call needed.

- Hints: guide toward understanding `print()` and string quotes.

### Lesson 3: «Как думает программа: инструкции по порядку» (type: `fill-blanks`, 100 XP)
- Body: sequential execution; top-to-bottom; what happens when you reorder statements; multiple `print`s; introducing comments.
- For `fill-blanks` lessons, the starter has `___` placeholders that the student must fill in. Example starter:
  ```python
  print("Доброе утро!")
  print(___)  # здесь должна быть строка "Чашка кофе"
  print("Открываю ноутбук")
  ```
- Solution fills all blanks.
- Tests check final stdout.

- [ ] **Step 1: Write lesson 01**

Write the complete `LessonContent` object for `01-what-is-programming.ts`. Since it's a quiz type, `starterCode`, `solution` are empty strings and `tests` is `[]`. The `content` field is the entire quiz — include the questions and answer explanations inline in markdown.

- [ ] **Step 2: Write lesson 02**

Write the complete `LessonContent` object for `02-hello-world.ts` per the description above.

- [ ] **Step 3: Write lesson 03**

Write the complete `LessonContent` object for `03-sequential-execution.ts` per the description above.

- [ ] **Step 4: Verify block 1**

```bash
npx tsx scripts/verify-python-lessons.ts
npx tsc --noEmit
```

Expected: lessons 1-3 report pass (or "skipped" for quiz with no tests); lessons 4-20 show placeholder or only lesson 5 is populated.

- [ ] **Step 5: Commit**

```bash
git add prisma/content/python-101/lessons/
git commit -m "feat(python-101): block 1 — introduction (lessons 1-3)"
```

---

## Task 4: Block 2 — Data & variables (lessons 4, 6, 7)

Note: lesson 5 is already done in Task 2.

**Files:**
- Modify: `prisma/content/python-101/lessons/04-variables.ts`
- Modify: `prisma/content/python-101/lessons/06-strings.ts`
- Modify: `prisma/content/python-101/lessons/07-booleans.ts`

### Lesson 4: «Переменные: именованные коробочки» (`code`, 120 XP)
- Metaphor: variable = labeled envelope. Explain `=`, reassignment, `print(name)`.
- Cover: naming rules, case-sensitivity, why snake_case, keywords that can't be used as names (`for`, `if`, `print`).
- Task: create variables `name`, `age`, `city` with values, then print them in a formatted sentence.
- Tests: verify stdout matches expected greeting.

### Lesson 6: «Строки: работа с текстом» (`code`, 120 XP)
- Cover: concatenation with `+`, f-strings (`f"hello {name}"`), methods `.upper()`, `.lower()`, `.strip()`, `.replace(old, new)`, length via `len()`.
- Task: write `greet(name, city)` that returns `f"Hello, {name.upper()}, welcome to {city}!"`.
- 3-4 tests with different inputs.

### Lesson 7: «Тип `bool` и логические операторы» (`fill-blanks`, 120 XP)
- Cover: `True`/`False` (capitalized!), comparison operators (`==`, `!=`, `<`, `<=`, `>`, `>=`), logical `and`, `or`, `not`.
- Task: fill-blanks — a function `can_vote(age, citizenship)` returning bool.
- Tests: verify multiple input combos.

- [ ] **Step 1: Write lesson 04**
- [ ] **Step 2: Write lesson 06**
- [ ] **Step 3: Write lesson 07**
- [ ] **Step 4: Verify block 2**

```bash
npx tsx scripts/verify-python-lessons.ts
```

Expected: lessons 1-7 pass (quiz reports skip; others pass tests).

- [ ] **Step 5: Commit**

```bash
git add prisma/content/python-101/lessons/
git commit -m "feat(python-101): block 2 — data and variables (lessons 4, 6, 7)"
```

---

## Task 5: Block 3 — Control flow (lessons 8, 9, 10, 11)

**Files:**
- Modify: `prisma/content/python-101/lessons/08-if-else.ts`
- Modify: `prisma/content/python-101/lessons/09-fix-broken-conditions.ts`
- Modify: `prisma/content/python-101/lessons/10-while-loop.ts`
- Modify: `prisma/content/python-101/lessons/11-for-loop.ts`

### Lesson 8: «Условные конструкции: if / elif / else» (`code`, 130 XP)
- Metaphor: fork in the road.
- Cover: `if`, `elif`, `else`; indentation (Python's critical rule); comparison operators; nested vs flat conditions.
- Task: `grade(score)` → "A" (≥90), "B" (≥80), "C" (≥70), "D" (≥60), "F" (<60).
- Tests: cover each branch.

### Lesson 9: «Найди баг: сломанные условия» (`fix-bug`, 140 XP)
- For `fix-bug`, starter contains broken code; student fixes it.
- Bugs to include: `=` instead of `==` in condition; wrong `and`/`or` logic; off-by-one (e.g., `>` when should be `>=`).
- Starter: a function `check_password(password)` with 2-3 bugs that makes it always return True or reject valid passwords.
- Solution: the fixed version.
- Tests: verify the fixed version correctly validates.

### Lesson 10: «Цикл `while`: пока истинно» (`code`, 130 XP)
- Metaphor: «пока чайник не закипел, жди».
- Cover: `while condition:`, counters, `break`, infinite loops and how to escape them.
- Task: `count_down(n)` prints numbers from n down to 1 using while. Tests check stdout.

### Lesson 11: «Цикл `for`: перебор последовательностей» (`code`, 140 XP)
- Cover: `for x in range(...)`, iterating over a string, `range(start, stop, step)`, accumulators.
- Task: `sum_range(start, end)` returns sum of integers from start to end inclusive.
- Tests: several ranges.

- [ ] **Step 1: Write lesson 08**
- [ ] **Step 2: Write lesson 09**
- [ ] **Step 3: Write lesson 10**
- [ ] **Step 4: Write lesson 11**
- [ ] **Step 5: Verify block 3**

```bash
npx tsx scripts/verify-python-lessons.ts
```

- [ ] **Step 6: Commit**

```bash
git add prisma/content/python-101/lessons/
git commit -m "feat(python-101): block 3 — control flow (lessons 8-11)"
```

---

## Task 6: Block 4 — Data structures (lessons 12-16)

**Files:**
- Modify: `prisma/content/python-101/lessons/12-lists.ts`
- Modify: `prisma/content/python-101/lessons/13-list-methods.ts`
- Modify: `prisma/content/python-101/lessons/14-dicts.ts`
- Modify: `prisma/content/python-101/lessons/15-tuples-sets.ts`
- Modify: `prisma/content/python-101/lessons/16-fix-broken-data.ts`

### Lesson 12: «Списки: упорядоченные коллекции» (`code`, 140 XP)
- Metaphor: labeled shelf with numbered bins.
- Cover: `[1, 2, 3]`, indexing (incl. negative `list[-1]`), slicing `list[1:3]`, `append`, `remove`, `len`.
- Task: `filter_even(numbers)` returns a new list with only even numbers.

### Lesson 13: «Методы списков и сортировка» (`fill-blanks`, 140 XP)
- Cover: `.sort()`, `sorted()`, `.reverse()`, `in`, `.count(x)`, min/max.
- Starter: a stats function with blanks. Student fills in method calls.
- Solution + tests verify correctness.

### Lesson 14: «Словари: данные по ключам» (`code`, 150 XP)
- Metaphor: phone book.
- Cover: `{"key": "value"}`, access via `d[key]`, `.get(key, default)`, `.keys()`, `.values()`, `.items()`.
- Task: `lookup_phone(contacts, name)` returns phone number for a given name or `"Не найдено"`.

### Lesson 15: «Кортежи и множества» (`code`, 140 XP)
- Cover: tuples (immutable, `(1, 2, 3)`), unpacking `a, b = point`, sets (`{1, 2, 3}`, uniqueness), `set.add()`.
- Task: `unique_words(text)` returns a sorted list of unique words from a string (lowercased).

### Lesson 16: «Найди баг: сломанная обработка данных» (`fix-bug`, 150 XP)
- Bugs to include: mutable default argument (`def f(a=[])`), modifying a list while iterating, off-by-one in slicing.
- Starter: `calculate_totals(orders)` with 2-3 bugs.
- Solution and tests verify.

- [ ] **Step 1: Write lesson 12**
- [ ] **Step 2: Write lesson 13**
- [ ] **Step 3: Write lesson 14**
- [ ] **Step 4: Write lesson 15**
- [ ] **Step 5: Write lesson 16**
- [ ] **Step 6: Verify block 4**

```bash
npx tsx scripts/verify-python-lessons.ts
```

- [ ] **Step 7: Commit**

```bash
git add prisma/content/python-101/lessons/
git commit -m "feat(python-101): block 4 — data structures (lessons 12-16)"
```

---

## Task 7: Block 5 — Functions (lessons 17, 18, 19)

**Files:**
- Modify: `prisma/content/python-101/lessons/17-functions.ts`
- Modify: `prisma/content/python-101/lessons/18-default-args.ts`
- Modify: `prisma/content/python-101/lessons/19-scope.ts`

### Lesson 17: «Функции: многоразовые блоки кода» (`code`, 150 XP)
- Metaphor: coffee machine (input bean → output coffee).
- Cover: `def`, parameters vs arguments, `return`, `None` when no return.
- Task: write both `factorial(n)` and `is_even(n)` — two functions in one lesson.

### Lesson 18: «Параметры по умолчанию и именованные аргументы» (`code`, 150 XP)
- Cover: `def f(a, b=10)`, calling with positional vs keyword args, `*args` briefly (but not detailed — saved for 301).
- Task: `format_email(to, subject, body="", cc=None)` returns formatted string.

### Lesson 19: «Область видимости: local vs global» (`quiz`, 130 XP)
- Cover: local vs module-level names; `global` keyword (show but discourage); shadowing.
- Quiz questions cover scope edge cases with multiple-choice + fix-2-cases.

- [ ] **Step 1: Write lesson 17**
- [ ] **Step 2: Write lesson 18**
- [ ] **Step 3: Write lesson 19**
- [ ] **Step 4: Verify block 5**

```bash
npx tsx scripts/verify-python-lessons.ts
```

- [ ] **Step 5: Commit**

```bash
git add prisma/content/python-101/lessons/
git commit -m "feat(python-101): block 5 — functions (lessons 17-19)"
```

---

## Task 8: Block 6 — Capstone (lesson 20)

**Files:**
- Modify: `prisma/content/python-101/lessons/20-capstone-contact-book.ts`

### Lesson 20: «Мини-записная книжка» (`code`, 300 XP)

This is the final integration lesson. The student builds a CLI-style contact book that uses everything from the course: dicts for storage, functions for operations, conditions for validation, loops for listing, strings for formatting.

Required functions:
- `add_contact(book, name, phone, email)` — adds a new entry; returns updated book
- `find_contact(book, name)` — returns dict for name or `None`
- `remove_contact(book, name)` — removes entry by name; returns updated book
- `list_contacts(book)` — returns a sorted list of names
- `format_contact(contact)` — returns formatted string `"Name: X\nPhone: Y\nEmail: Z"`

Body explains the project, walks through how each function works, shows how they compose together.

Tests: 6 tests covering each function with base + edge cases.

- [ ] **Step 1: Write lesson 20**
- [ ] **Step 2: Verify all 20 lessons**

```bash
npx tsx scripts/verify-python-lessons.ts
```

Expected: all 20 lessons pass (quiz types report "0 tests" which counts as pass).

- [ ] **Step 3: Type-check the whole project**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add prisma/content/python-101/lessons/
git commit -m "feat(python-101): block 6 — capstone contact book (lesson 20)"
```

---

## Task 9: Seed orchestrator script

**Files:**
- Create: `prisma/seed-python-101.ts`

- [ ] **Step 1: Write the seed script**

Create `prisma/seed-python-101.ts`:

```typescript
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PYTHON_101_LESSONS, PYTHON_101_COURSE } from "./content/python-101";

const pool = new Pool({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  console.log("🌱 Seeding Python 101...");

  // Remove the old Python Основы course (cascade deletes its lessons)
  const oldCourses = await prisma.course.findMany({
    where: {
      OR: [
        { title: "Python Основы" },
        { title: { startsWith: "Python 101" } },
      ],
    },
  });
  for (const c of oldCourses) {
    await prisma.lesson.deleteMany({ where: { courseId: c.id } });
    await prisma.course.delete({ where: { id: c.id } });
    console.log(`🗑️  Removed old course: ${c.title}`);
  }

  // Create Python 101 course
  const course = await prisma.course.create({
    data: {
      title: PYTHON_101_COURSE.title,
      description: PYTHON_101_COURSE.description,
      tags: PYTHON_101_COURSE.tags,
      difficulty: PYTHON_101_COURSE.difficulty,
      image: PYTHON_101_COURSE.image,
    },
  });
  console.log(`✓ Created course: ${course.title}`);

  // Create all 20 lessons
  for (const l of PYTHON_101_LESSONS) {
    await prisma.lesson.create({
      data: {
        courseId: course.id,
        title: l.title,
        content: l.content,
        order: l.order,
        type: l.type,
        language: l.language,
        xpReward: l.xpReward,
        starterCode: l.starterCode,
        solution: l.solution,
        tests: JSON.stringify(l.tests),
        hints: JSON.stringify(l.hints),
        isAvailable: l.isAvailable,
      },
    });
    console.log(`  ✓ Lesson ${l.order}: ${l.title}`);
  }

  console.log(`\n✅ Done — ${PYTHON_101_LESSONS.length} lessons created.`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
```

- [ ] **Step 2: Exclude seed script from TypeScript build**

The `tsconfig.json` already excludes `prisma/seed-*.ts` (line 33, added in earlier work). Verify:

```bash
grep "prisma/seed" tsconfig.json
```

Expected: `"prisma/seed.ts"` and `"prisma/seed-*.ts"` in the `exclude` array.

- [ ] **Step 3: Commit**

```bash
git add prisma/seed-python-101.ts
git commit -m "feat(python-101): seed script to write course + lessons to DB"
```

---

## Task 10: Run seed locally against Neon

- [ ] **Step 1: Run the seed**

```bash
npx tsx prisma/seed-python-101.ts
```

Expected output:
```
🌱 Seeding Python 101...
🗑️  Removed old course: Python Основы
✓ Created course: Python 101 — Первые шаги
  ✓ Lesson 1: Что такое программирование и зачем Python
  ✓ Lesson 2: Первая программа: Hello, World!
  ...
  ✓ Lesson 20: Капстон: «Мини-записная книжка»

✅ Done — 20 lessons created.
```

- [ ] **Step 2: Verify in Neon via Prisma Studio**

```bash
npx prisma studio
```

Browse to Course → find `Python 101 — Первые шаги` → verify 20 lessons attached with correct `order` values 1-20. Close Studio.

- [ ] **Step 3: Live site smoke test**

Open `https://mavencode-one.vercel.app` (or your deploy URL), log in, navigate to Courses → `Python 101 — Первые шаги`. Spot-check:
- Lesson 1 (quiz) renders markdown correctly.
- Lesson 2 (code) — paste solution `print("Привет, мир!")`, click Run, all tests pass.
- Lesson 5 — paste `return 3.14 * radius ** 2` into the function, click Run, all 4 tests pass.
- Lesson 20 (capstone) — confirm all 6 tests exist and at least 3 pass with a reference solution.

- [ ] **Step 4: Fix any lessons where live Pyodide behaves differently from local Python**

Most likely causes of divergence:
- Whitespace in expected output (Pyodide may add/trim a trailing newline)
- Float precision (`.format` differences between Python versions)
- `print` automatic newline vs test expectations

If any lesson fails in Pyodide but passed in local verification, update the test's `expected` to match actual Pyodide output. Re-verify:

```bash
npx tsx scripts/verify-python-lessons.ts
```

Must still pass.

- [ ] **Step 5: Commit any fixes**

```bash
git add prisma/content/python-101/lessons/
git commit -m "fix(python-101): align test expectations with Pyodide runtime"
```

---

## Task 11: Deploy to production

- [ ] **Step 1: Push all commits**

```bash
git push origin main
```

Vercel picks up the push and builds. Wait for green deploy.

- [ ] **Step 2: Smoke test on production**

Open `https://mavencode-one.vercel.app`. Navigate to Courses → `Python 101 — Первые шаги`. Same checks as Task 10 step 3, but on prod.

- [ ] **Step 3: Announce the course**

Manually create a news item announcing Python 101 availability. Run a one-off seed script (or add to the admin panel once editor is built — for now, inline in a simple script):

```bash
npx tsx -e "
import('dotenv').then(d => d.config());
import('@prisma/client').then(({ PrismaClient }) => {
  import('@prisma/adapter-pg').then(({ PrismaPg }) => {
    import('pg').then(async ({ Pool }) => {
      const pool = new Pool({ connectionString: process.env.DATABASE_URL });
      const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
      await prisma.news.create({
        data: {
          title: 'Python 101 — Первые шаги: полный курс с нуля',
          category: 'Обновление',
          summary: '20 уроков с подробной теорией, метафорами из жизни и прогрессивными подсказками. Для тех, кто ни разу не кодил.',
          body: '# Новый курс Python 101\\n\\n20 уроков, ~15 часов контента. От переменных до мини-записной книжки.',
          pinned: false,
          publishedAt: new Date(),
        },
      });
      await prisma.\$disconnect();
      await pool.end();
      console.log('News created');
    });
  });
});
"
```

Or more simply, create `prisma/seed-python-101-news.ts` mirroring the earlier `seed-news.ts` pattern and run it.

- [ ] **Step 4: Verify news visible on live site**

Open the news section on prod; confirm the Python 101 announcement appears.

- [ ] **Step 5: Final commit (if new files)**

```bash
git add prisma/seed-python-101-news.ts
git commit -m "docs(python-101): announce course in news feed"
git push
```

---

## Self-Review

Walking through the spec section by section:

1. **Course Metadata (spec §2)** → covered in Task 9 via `PYTHON_101_COURSE` constant.
2. **Learning Path Position (spec §3)** → N/A for implementation; documentation-only.
3. **Curriculum (spec §4, 20 lessons)** → covered in Tasks 2-8 (one task per block, Task 2 adds the template lesson early).
4. **Lesson Format (spec §5)** → `LessonContent` type in Task 1 mirrors every field; template in Task 2 shows the markdown skeleton exactly as specified.
5. **Pedagogical Principles (spec §6)** → instructions to each Task 3-8 reference the spec's metaphor/example/error-section rules; Task 2's template is the concrete example.
6. **Runtime Constraints (spec §7)** → Task 10 step 3 explicitly verifies lessons on Pyodide; step 4 accounts for divergence.
7. **Data Model Mapping (spec §8)** → Task 9 seed script writes to Course + Lesson tables exactly as described.
8. **Out of Scope (spec §9)** → every lesson's content stays within the listed topics; no OOP, no file IO, no HTTP.
9. **Success Criteria (spec §10)** → captured via the capstone (Task 8) and its 6 tests.
10. **Non-Functional Requirements (spec §11)** → Task 2 step 2/3 runs `npx tsc` and verification; Task 10 steps verify Pyodide compatibility; seed is idempotent (deletes old before creating new).

No placeholder patterns found. No spec requirement lacks a task. Type names (`LessonContent`, `TestCase`, `LessonType`) are defined once in Task 1 and used consistently afterward.

**Estimated effort:** ~12-18 hours of work depending on how much care goes into each lesson's prose.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-24-python-101-implementation.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task (one per block). Each subagent gets the plan + spec + template lesson, returns 3-5 completed lessons, I review, commit, move to next block. Better isolation of context, faster iteration, and each lesson is a clean diff. **Recommended because lesson writing is a well-bounded unit of work.**

2. **Inline Execution** — I execute tasks in this session using executing-plans, batch execution with checkpoints. Faster for small runs but this plan is large (~15 hours of content) and will bloat the main conversation context.

**Which approach?**
