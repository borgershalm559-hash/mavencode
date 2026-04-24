# Python 101 — Первые шаги — Design Spec

**Date:** 2026-04-24
**Status:** Approved (brainstorming)
**Next step:** `writing-plans` for implementation plan

---

## 1. Context

MavenCode currently has a course **«Python Основы»** with 6 short lessons.
The user wants a deep, thoroughly-explained Python curriculum for complete
beginners (people who have never coded).

A single course cannot cover «everything about Python to a pro level» —
that's a multi-course learning path of ~100 lessons. We agreed to **decompose
the program into 5 sequential courses**, and this spec covers only the
**first course: Python 101 — Первые шаги (20 lessons)**. The remaining
courses (201, 301, 401, 501) will be designed in separate specs after 101
is implemented and validated.

---

## 2. Course Metadata

| Parameter | Value |
|---|---|
| Title | Python 101 — Первые шаги |
| Description | Курс для тех, кто никогда не программировал. За 20 уроков ты пройдёшь от «что такое переменная» до написания первой осмысленной программы. |
| Difficulty | `beginner` |
| Tags | Python, Основы, С нуля |
| Language | `python` |
| Total XP | 2745 |
| Expected completion time | 15–20 hours (30–45 min/lesson) |
| Replaces existing course | **YES** — the old «Python Основы» (6 lessons) is removed entirely. |

---

## 3. Learning Path Position

Python 101 is the **first of 5 sequential courses** in the Python track:

| # | Course | Lessons | After it, student can… |
|---|---|---|---|
| **1** | Python 101 — Первые шаги | 20 | Write simple scripts, understand variables / conditionals / loops / lists |
| 2 | Python 201 — Функции и ООП | 22 | Design and read classes, modules, handle errors |
| 3 | Python 301 — Продвинутый | 20 | Use decorators, generators, async, typing |
| 4 | Python 401 — Инструменты | 15 | Write tests, package a project, work in git + venv |
| 5 | Python 501 — Практика | 20 | Build CLI, HTTP clients, REST API, work with databases |

Each course is prerequisite for the next. Each ships as an independent
product so a student can stop after any one.

---

## 4. Curriculum (20 Lessons)

### Block 1. Introduction (3 lessons)

| # | Title | Type | XP | Core concept |
|---|---|---|---|---|
| 1 | Что такое программирование и зачем Python | `quiz` | 75 | Language, interpreter, why Python |
| 2 | Первая программа: Hello, World! | `code` | 100 | `print()`, strings, comments |
| 3 | Как думает программа: инструкции по порядку | `fill-blanks` | 100 | Sequential execution, multiple statements |

### Block 2. Data & Variables (4 lessons)

| # | Title | Type | XP | Core concept |
|---|---|---|---|---|
| 4 | Переменные: именованные коробочки | `code` | 120 | Assignment, naming rules, reassignment |
| 5 | Числа и математика | `code` | 120 | `int`, `float`, arithmetic operators |
| 6 | Строки: работа с текстом | `code` | 120 | Concatenation, f-strings, `.upper/.lower/.strip/.replace` |
| 7 | Тип `bool` и логические операторы | `fill-blanks` | 120 | `True/False`, `and`/`or`/`not`, comparisons |

### Block 3. Control Flow (4 lessons)

| # | Title | Type | XP | Core concept |
|---|---|---|---|---|
| 8 | Условные конструкции: if / elif / else | `code` | 130 | Branching |
| 9 | Найди баг: сломанные условия | `fix-bug` | 140 | `=` vs `==`, operator precedence |
| 10 | Цикл `while`: пока истинно | `code` | 130 | Counters, `break`, infinite loops |
| 11 | Цикл `for`: перебор последовательностей | `code` | 140 | `range()`, iteration, accumulators |

### Block 4. Data Structures (5 lessons)

| # | Title | Type | XP | Core concept |
|---|---|---|---|---|
| 12 | Списки: упорядоченные коллекции | `code` | 140 | Creation, indexing, `append`/`remove`, slices |
| 13 | Методы списков и сортировка | `fill-blanks` | 140 | `sort`, `reverse`, `len`, `in` |
| 14 | Словари: данные по ключам | `code` | 150 | `dict`, `get`, `keys`, `values` |
| 15 | Кортежи и множества | `code` | 140 | Immutable vs mutable, uniqueness |
| 16 | Найди баг: сломанная обработка данных | `fix-bug` | 150 | Off-by-one, wrong iteration, mutable default |

### Block 5. Functions (3 lessons)

| # | Title | Type | XP | Core concept |
|---|---|---|---|---|
| 17 | Функции: многоразовые блоки кода | `code` | 150 | `def`, parameters, `return`, `None` |
| 18 | Параметры по умолчанию и именованные аргументы | `code` | 150 | `def f(a, b=10)`, keyword args |
| 19 | Область видимости: local vs global | `quiz` | 130 | Scope, shadowing, best practices |

### Block 6. Capstone (1 lesson)

| # | Title | Type | XP | Core concept |
|---|---|---|---|---|
| 20 | Капстон: «Мини-записная книжка» | `code` | 300 | CLI contact book — integrates everything |

**Total XP:** 2745 — rewards finishing the whole course, not grinding.
(Sum: Block 1 = 275 · Block 2 = 480 · Block 3 = 540 · Block 4 = 720 · Block 5 = 430 · Block 6 = 300)

---

## 5. Lesson Format

Every lesson follows the same markdown skeleton so students never hunt for a
section:

```markdown
# Название урока

## 🎯 Что научишься делать
2-3 bullets of concrete skills.

## 🔍 Зачем это нужно
1-2 paragraphs of real-world motivation.

## 📚 Теория
1200-2000 words, conversational, structured as:
- Life-world metaphor (box, recipe, name-cards, etc)
- Example code with line-by-line explanation
- Common beginner mistakes
- Gotchas (e.g. `/` vs `//`, float arithmetic quirks)

## 🧪 Примеры
3-4 live code examples with comments.

## 💡 Мини-тест самопроверки
2-3 comprehension questions (not auto-graded — for self-check).

## 🛠️ Задание
Clear task, requirements, and sample I/O.
```

### Starter code
Scaffold is always pre-filled with comments that guide structure:

```python
def calculate_area(radius):
    # 1. Вычисли площадь по формуле π × r²
    # 2. Используй 3.14 как приближение π
    # 3. Верни результат через return
    pass
```

### Solution
Full working solution **plus one alternative way** (where meaningful) to
reinforce that there is rarely only one right answer.

### Tests (JSON, stored in `Lesson.tests`)
For `code` lessons: 3–5 tests covering:
- Typical case (base input)
- Boundary case (empty, zero, negative)
- Edge case (large values, unusual input)

Example:
```json
[
  { "input": "calculate_area(5)",  "expected": "78.5", "description": "Радиус 5 → 78.5" },
  { "input": "calculate_area(0)",  "expected": "0.0",  "description": "Радиус 0 → 0" },
  { "input": "calculate_area(1)",  "expected": "3.14", "description": "Единичная окружность" }
]
```

### Hints (progressive, 3 levels)
Stored in `Lesson.hints` as JSON array, matching the existing pattern used
in seed.ts:
1. **Soft nudge** — direction of thought
2. **Concrete pointer** — code fragment
3. **Full solution** — complete code in a fenced block

XP is reduced by 10% per hint used (existing `hintsUsed` field).

---

## 6. Pedagogical Principles

1. **Always start with a life metaphor** before code (box, recipe, phonebook, fork-in-the-road).
2. **Never use an unexplained term** — first appearance gets a one-line explanation inline.
3. **Every example is explained line-by-line** — not «here's the code, here's the output».
4. **Show typical mistakes eagerly** — dedicated «⚠️ Частые ошибки новичков» section each lesson.
5. **Bridge from the previous lesson** — every lesson opens with a one-sentence callback.
6. **Mini-FAQ at the end of the theory block** — preempts the questions every beginner asks.
7. **Friendly but not infantilizing tone** — no academic jargon, no patronising "kiddo" language.
8. **Target Python 3.12+** — f-strings, walrus operator where appropriate, modern idioms. No `.format()`, no `%` formatting.

---

## 7. Runtime Constraints

We run Python in the browser via Pyodide. This limits what the course can
cover:

- ✅ All stdlib that matters for 101 works (`math`, `random`, `datetime`, `json`)
- ✅ `print()` output is captured and shown in the console panel
- ❌ No file system — anything touching files moves to **Python 201**
- ❌ No `pip install` — everything must work with stdlib
- ❌ No real `input()` — for interactive-style lessons we simulate input via
  test harness (ask student to make a function that receives input as an
  argument instead)

---

## 8. Data Model Mapping

No schema changes needed. Uses existing tables:

- `Course` row (replace existing «Python Основы» entry)
- 20 `Lesson` rows with fields: `title`, `content` (markdown), `order` (1-20),
  `type`, `language: "python"`, `xpReward`, `isAvailable` (first lesson always
  available; others unlock as prior ones complete),
  `starterCode`, `solution`, `tests` (JSON string), `hints` (JSON string)

Implementation will be a seed script at `prisma/seed-python-101.ts`, run
against both local and Neon production DBs.

---

## 9. Out of Scope (explicitly)

- OOP, classes — covered in Python 201
- File IO — covered in Python 201
- Error handling (`try/except`) — covered in Python 201
- Modules and `import` — covered in Python 201
- Testing, type hints, `venv`, `pip` — covered in Python 401
- Any HTTP / API / DB work — covered in Python 501
- Video content — text + code editor only
- Audio narration — no
- Automatic lesson unlocking via UI changes — use existing `isAvailable`
  flag logic

---

## 10. Success Criteria

A student who completes Python 101 should be able to:

1. Read a short Python script (≤50 lines) and explain what it does
2. Write a function that accepts inputs, performs a computation, and returns
   a result
3. Choose the right data structure (list / dict / tuple / set) for a given
   problem
4. Use `if/elif/else`, `for`, `while` without looking up syntax
5. Debug a script with `print`-based tracing
6. Compose the above into a small CLI-style program (the capstone)

The capstone lesson's 6 unit tests define the measurable completion criterion.

---

## 11. Non-Functional Requirements

- Every lesson's theory section reads cleanly in both the lesson page's
  rendered markdown and GitHub's markdown preview (no MavenCode-proprietary
  syntax)
- All code examples pass `python -c` on Python 3.12 without warnings
- All `tests` JSON entries validate against the existing test-runner shape
  (see `src/components/lesson/runners/python-runner.ts`)
- Seed script is idempotent — re-running against a DB with existing Python
  101 data cleanly replaces it

---

## 12. Open Questions (for implementation phase)

- Should lesson 20 (capstone) show a celebration animation on completion?
  → Decide during writing-plans; low priority.
- Should we backfill XP for users who had progress on the old «Python
  Основы» course?
  → Decision during writing-plans; likely yes, credit them 600 XP total to
  compensate.
