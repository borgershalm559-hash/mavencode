import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Remove old simple Python course if it exists
  const old = await prisma.course.findFirst({ where: { title: "Python Основы" } });
  if (old) {
    await prisma.progress.deleteMany({ where: { lesson: { courseId: old.id } } });
    await prisma.lesson.deleteMany({ where: { courseId: old.id } });
    await prisma.course.delete({ where: { id: old.id } });
    console.log("✓ Removed old 'Python Основы' course");
  }

  // Remove existing full course if re-running
  const existing = await prisma.course.findFirst({ where: { title: "Python: с нуля до уверенного уровня" } });
  if (existing) {
    await prisma.progress.deleteMany({ where: { lesson: { courseId: existing.id } } });
    await prisma.lesson.deleteMany({ where: { courseId: existing.id } });
    await prisma.course.delete({ where: { id: existing.id } });
    console.log("✓ Removed existing Python course (re-seeding)");
  }

  await prisma.course.create({
    data: {
      title: "Python: с нуля до уверенного уровня",
      description:
        "Полноценный курс Python для начинающих: от первого print до словарей, функций и обработки ошибок. Каждый урок — живое задание с проверкой прямо в браузере. Никакой лишней теории — только практика.",
      tags: ["PYTHON", "BEGINNER"],
      difficulty: "beginner",
      estimatedHours: 6,
      lessons: {
        create: [
          // ── Урок 1 ──────────────────────────────────────────
          {
            title: "Первый шаг: print и комментарии",
            order: 1,
            type: "code",
            language: "python",
            xpReward: 80,
            content: `# Первый шаг: print и комментарии

Добро пожаловать в Python! Первое, что должен уметь каждый Python-разработчик — вывод текста на экран.

## print()

\`\`\`python
print("Hello, World!")
print("Меня зовут Python")
print(42)
print(3.14)
\`\`\`

Можно выводить несколько значений через запятую:

\`\`\`python
print("Число:", 42)
print("a =", 1, "b =", 2)
\`\`\`

## Комментарии

Комментарии — заметки для программиста, Python их игнорирует:

\`\`\`python
# Это комментарий — одна строка
x = 5  # Комментарий после кода

"""
Это многострочный
комментарий (технически строка, но работает)
"""
\`\`\`

---

## Задание

Напишите функцию \`hello(name)\`, которая **возвращает** строку \`"Привет, {name}!"\`.`,
            starterCode: `def hello(name):
    # Верните строку "Привет, {name}!"
    pass`,
            solution: `def hello(name):
    return f"Привет, {name}!"`,
            tests: JSON.stringify([
              { input: "str(hello('Мир'))", expected: "Привет, Мир!", description: "hello('Мир') → 'Привет, Мир!'" },
              { input: "str(hello('Алиса'))", expected: "Привет, Алиса!", description: "hello('Алиса') → 'Привет, Алиса!'" },
              { input: "str(hello('Python'))", expected: "Привет, Python!", description: "hello('Python') → 'Привет, Python!'" },
            ]),
            hints: JSON.stringify([
              "Используйте f-строку: `f\"Привет, {name}!\"`",
              "Не забудьте `return`, иначе функция вернёт `None`.",
              "Готовое решение:\n```python\ndef hello(name):\n    return f\"Привет, {name}!\"\n```",
            ]),
          },

          // ── Урок 2 ──────────────────────────────────────────
          {
            title: "Переменные и типы данных",
            order: 2,
            type: "code",
            language: "python",
            xpReward: 90,
            content: `# Переменные и типы данных

## Объявление переменных

В Python не нужно указывать тип — Python сам определяет его:

\`\`\`python
name = "Alice"    # str — строка
age = 25          # int — целое число
height = 1.75     # float — дробное число
is_admin = True   # bool — булево
nothing = None    # NoneType — пусто
\`\`\`

## Функция type()

\`\`\`python
type("hello")  # <class 'str'>
type(42)       # <class 'int'>
type(3.14)     # <class 'float'>
type(True)     # <class 'bool'>
\`\`\`

## Преобразование типов

\`\`\`python
int("42")      # 42
float("3.14")  # 3.14
str(100)       # "100"
bool(0)        # False (любой "пустой" объект → False)
bool(1)        # True
\`\`\`

---

## Задание

Напишите функцию \`describe(value)\`, которая возвращает **имя типа** переданного значения в виде строки: \`"str"\`, \`"int"\`, \`"float"\` или \`"bool"\`.`,
            starterCode: `def describe(value):
    # Верните имя типа: "str", "int", "float" или "bool"
    pass`,
            solution: `def describe(value):
    return type(value).__name__`,
            tests: JSON.stringify([
              { input: "str(describe('hello'))", expected: "str", description: "describe('hello') → 'str'" },
              { input: "str(describe(42))", expected: "int", description: "describe(42) → 'int'" },
              { input: "str(describe(3.14))", expected: "float", description: "describe(3.14) → 'float'" },
              { input: "str(describe(True))", expected: "bool", description: "describe(True) → 'bool'" },
            ]),
            hints: JSON.stringify([
              "Используйте функцию `type(value)` — она вернёт класс объекта.",
              "`type(value).__name__` даёт имя типа в виде строки: `'int'`, `'str'` и т.д.",
              "Готовое решение:\n```python\ndef describe(value):\n    return type(value).__name__\n```",
            ]),
          },

          // ── Урок 3 ──────────────────────────────────────────
          {
            title: "Строки: методы и операции",
            order: 3,
            type: "code",
            language: "python",
            xpReward: 100,
            content: `# Строки: методы и операции

Строки в Python — мощный инструмент. Вот самые важные методы:

## Основные методы

\`\`\`python
s = "  Hello, World!  "

s.upper()       # "  HELLO, WORLD!  "
s.lower()       # "  hello, world!  "
s.strip()       # "Hello, World!"   (убирает пробелы)
s.replace("World", "Python")  # "  Hello, Python!  "
s.split(", ")   # ["  Hello", "World!  "]
", ".join(["a", "b", "c"])  # "a, b, c"
\`\`\`

## Проверки

\`\`\`python
"hello".startswith("he")  # True
"hello".endswith("lo")    # True
"2024".isdigit()          # True
"hello".isalpha()         # True
\`\`\`

## F-строки (форматирование)

\`\`\`python
name = "Alice"
age = 25
print(f"Меня зовут {name}, мне {age} лет")
print(f"Сумма: {2 + 2}")  # "Сумма: 4"
\`\`\`

---

## Задание

Напишите функцию \`normalize(text)\`, которая:
1. Убирает пробелы по краям (strip)
2. Переводит в нижний регистр (lower)
3. Заменяет все пробелы на нижнее подчёркивание (replace)`,
            starterCode: `def normalize(text):
    # Обработайте строку: strip → lower → replace пробелы на "_"
    pass`,
            solution: `def normalize(text):
    return text.strip().lower().replace(" ", "_")`,
            tests: JSON.stringify([
              { input: "str(normalize('  Hello World  '))", expected: "hello_world", description: "normalize('  Hello World  ') → 'hello_world'" },
              { input: "str(normalize('Python IS FUN'))", expected: "python_is_fun", description: "normalize('Python IS FUN') → 'python_is_fun'" },
              { input: "str(normalize('  abc  '))", expected: "abc", description: "normalize('  abc  ') → 'abc'" },
            ]),
            hints: JSON.stringify([
              "Методы строк можно **цепочкой**: `text.strip().lower()`",
              "Замена пробелов: `.replace(' ', '_')`",
              "Готовое решение:\n```python\ndef normalize(text):\n    return text.strip().lower().replace(' ', '_')\n```",
            ]),
          },

          // ── Урок 4 ──────────────────────────────────────────
          {
            title: "Числа и арифметика",
            order: 4,
            type: "code",
            language: "python",
            xpReward: 90,
            content: `# Числа и арифметика

## Операторы

\`\`\`python
10 + 3   # 13  — сложение
10 - 3   # 7   — вычитание
10 * 3   # 30  — умножение
10 / 3   # 3.333... — деление (float)
10 // 3  # 3   — целочисленное деление
10 % 3   # 1   — остаток от деления
2 ** 10  # 1024 — возведение в степень
\`\`\`

## Встроенные функции

\`\`\`python
abs(-5)        # 5
round(3.7)     # 4
round(3.141, 2) # 3.14
min(1, 5, 3)   # 1
max(1, 5, 3)   # 5
\`\`\`

## Модуль math

\`\`\`python
import math
math.sqrt(16)  # 4.0  — квадратный корень
math.pi        # 3.14159...
math.floor(3.9) # 3
math.ceil(3.1)  # 4
\`\`\`

---

## Задание

Напишите функцию \`bmi(weight, height)\`, которая вычисляет **Индекс массы тела** по формуле:

\`BMI = weight / height²\`

Результат округлите до **1 знака** после запятой.`,
            starterCode: `def bmi(weight, height):
    # Вычислите ИМТ: weight / height**2, округлите до 1 знака
    pass`,
            solution: `def bmi(weight, height):
    return round(weight / height ** 2, 1)`,
            tests: JSON.stringify([
              { input: "str(bmi(70, 1.75))", expected: "22.9", description: "bmi(70, 1.75) → 22.9" },
              { input: "str(bmi(90, 1.80))", expected: "27.8", description: "bmi(90, 1.80) → 27.8" },
              { input: "str(bmi(60, 1.65))", expected: "22.0", description: "bmi(60, 1.65) → 22.0" },
            ]),
            hints: JSON.stringify([
              "Возведение в степень в Python: `height ** 2`",
              "Округление: `round(value, 1)` — 1 знак после запятой.",
              "Готовое решение:\n```python\ndef bmi(weight, height):\n    return round(weight / height ** 2, 1)\n```",
            ]),
          },

          // ── Урок 5 ──────────────────────────────────────────
          {
            title: "Условия: if / elif / else",
            order: 5,
            type: "code",
            language: "python",
            xpReward: 100,
            content: `# Условия: if / elif / else

## Синтаксис

\`\`\`python
if условие:
    # код если True
elif другое_условие:
    # код если первое False, но это True
else:
    # код во всех остальных случаях
\`\`\`

## Операторы сравнения

\`\`\`python
x > y   # больше
x < y   # меньше
x >= y  # больше или равно
x <= y  # меньше или равно
x == y  # равно
x != y  # не равно
\`\`\`

## Логические операторы

\`\`\`python
x > 0 and x < 10   # оба условия True
x < 0 or x > 100   # хотя бы одно True
not (x == 5)        # инвертирует результат
\`\`\`

---

## Задание

Напишите функцию \`grade(score)\`, которая принимает оценку (0–100) и возвращает:

- \`"A"\` — 90 и выше
- \`"B"\` — 75–89
- \`"C"\` — 60–74
- \`"D"\` — 45–59
- \`"F"\` — меньше 45`,
            starterCode: `def grade(score):
    # Верните оценку: "A", "B", "C", "D" или "F"
    pass`,
            solution: `def grade(score):
    if score >= 90:
        return "A"
    elif score >= 75:
        return "B"
    elif score >= 60:
        return "C"
    elif score >= 45:
        return "D"
    else:
        return "F"`,
            tests: JSON.stringify([
              { input: "str(grade(95))", expected: "A", description: "grade(95) → 'A'" },
              { input: "str(grade(80))", expected: "B", description: "grade(80) → 'B'" },
              { input: "str(grade(65))", expected: "C", description: "grade(65) → 'C'" },
              { input: "str(grade(50))", expected: "D", description: "grade(50) → 'D'" },
              { input: "str(grade(30))", expected: "F", description: "grade(30) → 'F'" },
            ]),
            hints: JSON.stringify([
              "Начните с самого высокого порога (>= 90), иначе условия перекроются.",
              "Используйте `elif` для промежуточных значений.",
              "Готовое решение:\n```python\ndef grade(score):\n    if score >= 90:\n        return \"A\"\n    elif score >= 75:\n        return \"B\"\n    elif score >= 60:\n        return \"C\"\n    elif score >= 45:\n        return \"D\"\n    else:\n        return \"F\"\n```",
            ]),
          },

          // ── Урок 6 ──────────────────────────────────────────
          {
            title: "Цикл for и range()",
            order: 6,
            type: "code",
            language: "python",
            xpReward: 110,
            content: `# Цикл for и range()

## Основной синтаксис

\`\`\`python
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4
\`\`\`

## range() с параметрами

\`\`\`python
range(2, 7)     # 2, 3, 4, 5, 6
range(0, 10, 2) # 0, 2, 4, 6, 8 (шаг 2)
range(5, 0, -1) # 5, 4, 3, 2, 1 (обратно)
\`\`\`

## Итерация по списку

\`\`\`python
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)
\`\`\`

## enumerate() — индекс + значение

\`\`\`python
for i, fruit in enumerate(fruits):
    print(f"{i}: {fruit}")
# 0: apple
# 1: banana
# 2: cherry
\`\`\`

---

## Задание

Напишите функцию \`factorial(n)\`, которая вычисляет **факториал** числа n (n! = 1 × 2 × 3 × ... × n). Для n = 0 верните 1.`,
            starterCode: `def factorial(n):
    # Вычислите n! с помощью цикла for
    pass`,
            solution: `def factorial(n):
    result = 1
    for i in range(1, n + 1):
        result *= i
    return result`,
            tests: JSON.stringify([
              { input: "str(factorial(5))", expected: "120", description: "factorial(5) → 120" },
              { input: "str(factorial(0))", expected: "1", description: "factorial(0) → 1" },
              { input: "str(factorial(1))", expected: "1", description: "factorial(1) → 1" },
              { input: "str(factorial(10))", expected: "3628800", description: "factorial(10) → 3628800" },
            ]),
            hints: JSON.stringify([
              "Начните с `result = 1`, затем умножайте каждое число от 1 до n включительно.",
              "`range(1, n + 1)` даёт числа от 1 до n включительно.",
              "Готовое решение:\n```python\ndef factorial(n):\n    result = 1\n    for i in range(1, n + 1):\n        result *= i\n    return result\n```",
            ]),
          },

          // ── Урок 7 ──────────────────────────────────────────
          {
            title: "Цикл while и break/continue",
            order: 7,
            type: "code",
            language: "python",
            xpReward: 110,
            content: `# Цикл while и break/continue

## while — цикл с условием

\`\`\`python
count = 0
while count < 5:
    print(count)
    count += 1  # не забудьте изменять переменную!
\`\`\`

## break — досрочный выход

\`\`\`python
while True:
    user_input = input("Введите 'стоп': ")
    if user_input == "стоп":
        break  # выходим из цикла
\`\`\`

## continue — пропустить итерацию

\`\`\`python
for i in range(10):
    if i % 2 == 0:
        continue  # пропускаем чётные
    print(i)  # 1, 3, 5, 7, 9
\`\`\`

---

## Задание

Напишите функцию \`is_prime(n)\`, которая возвращает \`True\` если число простое, иначе \`False\`.

*Простое число* делится только на 1 и на само себя. Числа меньше 2 не считаются простыми.`,
            starterCode: `def is_prime(n):
    # Проверьте, является ли n простым числом
    pass`,
            solution: `def is_prime(n):
    if n < 2:
        return False
    i = 2
    while i * i <= n:
        if n % i == 0:
            return False
        i += 1
    return True`,
            tests: JSON.stringify([
              { input: "str(is_prime(2))", expected: "True", description: "is_prime(2) → True" },
              { input: "str(is_prime(17))", expected: "True", description: "is_prime(17) → True" },
              { input: "str(is_prime(1))", expected: "False", description: "is_prime(1) → False" },
              { input: "str(is_prime(15))", expected: "False", description: "is_prime(15) → False (3×5)" },
              { input: "str(is_prime(97))", expected: "True", description: "is_prime(97) → True" },
            ]),
            hints: JSON.stringify([
              "Для проверки: пробуйте делить n на числа от 2 до √n. Если делится — не простое.",
              "Проверка до √n эффективнее полного перебора: `while i * i <= n`",
              "Готовое решение:\n```python\ndef is_prime(n):\n    if n < 2:\n        return False\n    i = 2\n    while i * i <= n:\n        if n % i == 0:\n            return False\n        i += 1\n    return True\n```",
            ]),
          },

          // ── Урок 8 ──────────────────────────────────────────
          {
            title: "Списки и list comprehension",
            order: 8,
            type: "code",
            language: "python",
            xpReward: 120,
            content: `# Списки и list comprehension

## Основные операции

\`\`\`python
nums = [3, 1, 4, 1, 5]
nums.append(9)         # добавить в конец
nums.insert(0, 0)      # вставить по индексу
nums.remove(1)         # удалить первое вхождение 1
nums.pop()             # удалить и вернуть последний
nums.sort()            # сортировка на месте
sorted(nums)           # новый отсортированный список
nums.reverse()         # разворот на месте
len(nums)              # длина
sum(nums)              # сумма
\`\`\`

## List comprehension — компактный способ

\`\`\`python
# Обычный цикл
squares = []
for x in range(5):
    squares.append(x ** 2)

# То же самое одной строкой:
squares = [x ** 2 for x in range(5)]  # [0, 1, 4, 9, 16]

# С фильтрацией:
evens = [x for x in range(10) if x % 2 == 0]  # [0, 2, 4, 6, 8]
\`\`\`

---

## Задание

Напишите функцию \`only_evens(numbers)\`, которая принимает список чисел и возвращает **новый список** только из чётных чисел, каждое возведённое в квадрат.

Пример: \`[1, 2, 3, 4, 5]\` → \`[4, 16]\``,
            starterCode: `def only_evens(numbers):
    # Верните список: квадраты чётных чисел
    pass`,
            solution: `def only_evens(numbers):
    return [x ** 2 for x in numbers if x % 2 == 0]`,
            tests: JSON.stringify([
              { input: "str(only_evens([1, 2, 3, 4, 5]))", expected: "[4, 16]", description: "only_evens([1,2,3,4,5]) → [4, 16]" },
              { input: "str(only_evens([2, 4, 6]))", expected: "[4, 16, 36]", description: "only_evens([2,4,6]) → [4, 16, 36]" },
              { input: "str(only_evens([1, 3, 5]))", expected: "[]", description: "only_evens([1,3,5]) → [] (нет чётных)" },
            ]),
            hints: JSON.stringify([
              "Проверка чётности: `x % 2 == 0`",
              "List comprehension с фильтром: `[выражение for x in список if условие]`",
              "Готовое решение:\n```python\ndef only_evens(numbers):\n    return [x ** 2 for x in numbers if x % 2 == 0]\n```",
            ]),
          },

          // ── Урок 9 ──────────────────────────────────────────
          {
            title: "Словари: dict",
            order: 9,
            type: "code",
            language: "python",
            xpReward: 120,
            content: `# Словари: dict

Словарь — структура данных «ключ → значение»:

\`\`\`python
user = {
    "name": "Alice",
    "age": 25,
    "email": "alice@example.com"
}
\`\`\`

## Чтение и изменение

\`\`\`python
user["name"]              # "Alice"
user.get("phone", "—")    # "—" (ключа нет, но нет ошибки)
user["age"] = 26          # изменить
user["city"] = "Москва"   # добавить
del user["email"]         # удалить
\`\`\`

## Перебор

\`\`\`python
for key in user:           # ключи
for val in user.values():  # значения
for k, v in user.items():  # пары
\`\`\`

## Dict comprehension

\`\`\`python
squares = {x: x**2 for x in range(5)}
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}
\`\`\`

---

## Задание

Напишите функцию \`word_count(text)\`, которая принимает строку и возвращает словарь: **слово → количество вхождений**.

Регистр не учитывается. Слова разделены пробелами.`,
            starterCode: `def word_count(text):
    # Верните словарь {слово: количество}
    pass`,
            solution: `def word_count(text):
    words = text.lower().split()
    result = {}
    for word in words:
        result[word] = result.get(word, 0) + 1
    return result`,
            tests: JSON.stringify([
              { input: "str(word_count('hello world hello'))", expected: "{'hello': 2, 'world': 1}", description: "word_count('hello world hello') → {'hello': 2, 'world': 1}" },
              { input: "str(word_count('a b a b a'))", expected: "{'a': 3, 'b': 2}", description: "word_count('a b a b a') → {'a': 3, 'b': 2}" },
              { input: "str(word_count('Hi HI hi'))", expected: "{'hi': 3}", description: "word_count('Hi HI hi') → {'hi': 3}" },
            ]),
            hints: JSON.stringify([
              "Переведите в нижний регистр: `text.lower()`, затем разбейте: `.split()`",
              "`dict.get(key, 0)` вернёт 0 если ключа нет — удобно для счётчиков.",
              "Готовое решение:\n```python\ndef word_count(text):\n    words = text.lower().split()\n    result = {}\n    for word in words:\n        result[word] = result.get(word, 0) + 1\n    return result\n```",
            ]),
          },

          // ── Урок 10 ──────────────────────────────────────────
          {
            title: "Функции: продвинутые темы",
            order: 10,
            type: "code",
            language: "python",
            xpReward: 130,
            content: `# Функции: продвинутые темы

## Значения по умолчанию

\`\`\`python
def greet(name, greeting="Привет"):
    return f"{greeting}, {name}!"

greet("Alice")           # "Привет, Alice!"
greet("Bob", "Hello")    # "Hello, Bob!"
\`\`\`

## *args — произвольное число аргументов

\`\`\`python
def total(*args):
    return sum(args)

total(1, 2, 3)    # 6
total(10, 20)     # 30
\`\`\`

## **kwargs — именованные аргументы

\`\`\`python
def info(**kwargs):
    for key, val in kwargs.items():
        print(f"{key}: {val}")

info(name="Alice", age=25)
\`\`\`

## Lambda — анонимные функции

\`\`\`python
double = lambda x: x * 2
double(5)  # 10

nums = [3, 1, 4, 1, 5]
sorted(nums, key=lambda x: -x)  # [5, 4, 3, 1, 1]
\`\`\`

---

## Задание

Напишите функцию \`apply_all(numbers, *funcs)\`, которая применяет все переданные функции к каждому элементу списка и возвращает список результатов в виде кортежей.

Пример: \`apply_all([1, 2, 3], str, lambda x: x*2)\` → \`[('1', 2), ('2', 4), ('3', 6)]\``,
            starterCode: `def apply_all(numbers, *funcs):
    # Примените каждую функцию из funcs к каждому числу
    pass`,
            solution: `def apply_all(numbers, *funcs):
    return [tuple(f(n) for f in funcs) for n in numbers]`,
            tests: JSON.stringify([
              { input: "str(apply_all([1, 2, 3], str, lambda x: x*2))", expected: "[('1', 2), ('2', 4), ('3', 6)]", description: "apply_all([1,2,3], str, lambda x: x*2) → [('1', 2), ('2', 4), ('3', 6)]" },
              { input: "str(apply_all([4, 9], lambda x: x**2))", expected: "[(16,), (81,)]", description: "apply_all([4,9], lambda x: x**2) → [(16,), (81,)]" },
            ]),
            hints: JSON.stringify([
              "Используйте вложенный list comprehension: внешний по числам, внутренний по функциям.",
              "`tuple(f(n) for f in funcs)` создаёт кортеж результатов всех функций для одного числа.",
              "Готовое решение:\n```python\ndef apply_all(numbers, *funcs):\n    return [tuple(f(n) for f in funcs) for n in numbers]\n```",
            ]),
          },

          // ── Урок 11 ──────────────────────────────────────────
          {
            title: "Обработка ошибок: try / except",
            order: 11,
            type: "code",
            language: "python",
            xpReward: 120,
            content: `# Обработка ошибок: try / except

Python генерирует **исключения** при ошибках. Их можно поймать и обработать:

## Синтаксис

\`\`\`python
try:
    result = 10 / 0          # ZeroDivisionError!
except ZeroDivisionError:
    result = None
    print("Деление на ноль!")
\`\`\`

## Несколько исключений

\`\`\`python
try:
    value = int("abc")       # ValueError
except ValueError:
    print("Не число")
except TypeError:
    print("Неверный тип")
\`\`\`

## finally — выполняется всегда

\`\`\`python
try:
    f = open("file.txt")
except FileNotFoundError:
    print("Файл не найден")
finally:
    print("Это выполнится всегда")
\`\`\`

## Часто встречающиеся исключения

| Исключение | Причина |
|---|---|
| \`ValueError\` | Неверное значение |
| \`TypeError\` | Неверный тип |
| \`ZeroDivisionError\` | Деление на 0 |
| \`IndexError\` | Индекс за пределами |
| \`KeyError\` | Нет ключа в словаре |

---

## Задание

Напишите функцию \`safe_divide(a, b)\`, которая:
- Возвращает \`a / b\` если b != 0
- Возвращает \`None\` при делении на ноль
- Возвращает \`None\` если аргументы не числа (TypeError, ValueError)`,
            starterCode: `def safe_divide(a, b):
    # Безопасное деление — обработайте исключения
    pass`,
            solution: `def safe_divide(a, b):
    try:
        return a / b
    except (ZeroDivisionError, TypeError, ValueError):
        return None`,
            tests: JSON.stringify([
              { input: "str(safe_divide(10, 2))", expected: "5.0", description: "safe_divide(10, 2) → 5.0" },
              { input: "str(safe_divide(10, 0))", expected: "None", description: "safe_divide(10, 0) → None" },
              { input: "str(safe_divide('a', 2))", expected: "None", description: "safe_divide('a', 2) → None (TypeError)" },
              { input: "str(safe_divide(7, 2))", expected: "3.5", description: "safe_divide(7, 2) → 3.5" },
            ]),
            hints: JSON.stringify([
              "Используйте `try: ... except: ...` вокруг деления.",
              "Можно поймать несколько исключений сразу: `except (ZeroDivisionError, TypeError):`",
              "Готовое решение:\n```python\ndef safe_divide(a, b):\n    try:\n        return a / b\n    except (ZeroDivisionError, TypeError, ValueError):\n        return None\n```",
            ]),
          },

          // ── Урок 12 (финальный тест) ─────────────────────────
          {
            title: "Финальный тест: Python для начинающих",
            order: 12,
            type: "quiz",
            language: "python",
            xpReward: 200,
            content: `# Финальный тест

Поздравляем — вы прошли весь курс! 🎉

Этот тест проверит знания по всем пройденным темам:
переменные, строки, числа, условия, циклы, списки, словари, функции и исключения.

> Выберите правильный ответ на каждый вопрос.`,
            starterCode: null,
            solution: null,
            tests: JSON.stringify([
              {
                input: "Что вернёт type(3.14).__name__?",
                expected: "float",
                description: "str,int,float,number",
              },
              {
                input: "Какой метод удаляет и возвращает последний элемент списка?",
                expected: "pop",
                description: "remove,delete,pop,discard",
              },
              {
                input: "Что вернёт 'hello'.upper()[:3]?",
                expected: "HEL",
                description: "hel,HEL,HELLO,hello",
              },
              {
                input: "Как получить значение словаря без исключения, если ключ отсутствует?",
                expected: "dict.get(key)",
                description: "dict[key],dict.get(key),dict.find(key),dict.fetch(key)",
              },
              {
                input: "Что выведет: [x**2 for x in range(1,4)]?",
                expected: "[1, 4, 9]",
                description: "[1, 4, 9],[1, 2, 3],[2, 4, 6],[0, 1, 4]",
              },
              {
                input: "Какое исключение возникнет при делении на ноль?",
                expected: "ZeroDivisionError",
                description: "ValueError,ZeroDivisionError,ArithmeticError,MathError",
              },
            ]),
            hints: JSON.stringify([
              "Вспомните урок о типах данных: `type(value).__name__` возвращает имя типа.",
              "Методы списков: `pop()` удаляет последний, `remove()` удаляет по значению.",
              "Срезы строк: `[:3]` берёт первые 3 символа.",
            ]),
          },
        ],
      },
    },
  });

  console.log("✓ Course 'Python: с нуля до уверенного уровня' created (12 lessons)");
  console.log("\n🐍 Python course seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
