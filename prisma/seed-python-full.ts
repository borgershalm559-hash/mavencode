import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const t = JSON.stringify;

async function main() {
  // Remove previous Python courses
  for (const title of [
    "Python Основы",
    "Python: с нуля до уверенного уровня",
    "Python: Полный курс для начинающих",
  ]) {
    const c = await prisma.course.findFirst({ where: { title } });
    if (c) {
      await prisma.progress.deleteMany({ where: { lesson: { courseId: c.id } } });
      await prisma.lesson.deleteMany({ where: { courseId: c.id } });
      await prisma.course.delete({ where: { id: c.id } });
      console.log(`✓ Removed old course: "${title}"`);
    }
  }

  await prisma.course.create({
    data: {
      title: "Python: Полный курс для начинающих",
      description:
        "50 уроков от полного нуля до уверенного профессионального уровня. Курс для тех, кто никогда не программировал: объясняет не только КАК, но и ПОЧЕМУ. Переменные, строки, условия, циклы, функции, ООП, файлы, декораторы, генераторы, модули — всё с живой проверкой кода прямо в браузере.",
      tags: ["PYTHON", "BEGINNER", "FULL"],
      difficulty: "beginner",
      estimatedHours: 25,
      lessons: {
        create: [

          // ═══════════════════════════════════════════════════════
          // МОДУЛЬ 1: АБСОЛЮТНЫЙ СТАРТ
          // ═══════════════════════════════════════════════════════

          {
            title: "Что такое программирование?",
            order: 1,
            type: "quiz",
            language: "python",
            xpReward: 50,
            content: `# Что такое программирование?

Прежде чем писать код — разберёмся, что это вообще такое.

## Программа = инструкция для компьютера

Компьютер не умеет думать сам. Он делает только то, что ему сказали. **Программа** — это набор команд, которые компьютер выполняет строго по порядку.

Представьте рецепт блюда:
1. Налить воду в кастрюлю
2. Поставить на огонь
3. Ждать пока закипит
4. Добавить соль

Это и есть программа — пошаговая инструкция.

## Почему Python?

- **Читаемый синтаксис** — код похож на английский язык
- **Огромное сообщество** — миллионы туториалов и решений
- **Универсальный** — веб, анализ данных, ИИ, автоматизация, игры
- **Популярный на рынке труда** — один из топ-3 языков в мире

## Что мы будем изучать

В этом курсе вы научитесь:
- Работать с данными (числа, текст, списки)
- Управлять ходом программы (если/иначе, циклы)
- Писать переиспользуемый код (функции)
- Работать со структурами данных (словари, множества)
- Обрабатывать ошибки правильно

> Каждый урок — маленький шаг. Не торопитесь, практикуйтесь!`,
            starterCode: null,
            solution: null,
            tests: t([
              { input: "Что такое программа?", expected: "Набор инструкций для компьютера", description: "Набор инструкций для компьютера,Файл на диске,Картинка на экране,Процессор" },
              { input: "Python — это...?", expected: "Язык программирования", description: "Язык программирования,Операционная система,База данных,Браузер" },
              { input: "Что НЕ является преимуществом Python?", expected: "Самый быстрый язык", description: "Самый быстрый язык,Читаемый синтаксис,Большое сообщество,Универсальность" },
            ]),
            hints: t([
              "Программа — это последовательность команд, которые компьютер выполняет шаг за шагом.",
              "Python — один из самых популярных языков для начинающих: простой синтаксис и мощные возможности.",
            ]),
          },

          {
            title: "Первая программа: print()",
            order: 2,
            type: "code",
            language: "python",
            xpReward: 60,
            content: `# Первая программа: print()

## Команда print()

\`print()\` — самая первая команда, которую учат все программисты. Она выводит текст на экран.

\`\`\`python
print("Hello, World!")
print("Я учу Python!")
\`\`\`

## Правила написания строк

Текст нужно заключать в кавычки — одинарные или двойные:

\`\`\`python
print("Двойные кавычки")
print('Одинарные кавычки')
\`\`\`

## Несколько значений

\`\`\`python
print("Мне", 25, "лет")          # Мне 25 лет
print("a", "b", sep="-")          # a-b (разделитель)
print("Строка 1", end=" | ")      # без переноса строки
print("Строка 2")                 # Строка 1 | Строка 2
\`\`\`

## Комментарии — заметки программиста

\`\`\`python
# Это комментарий — Python его игнорирует
print("Это выполнится")  # а это — нет
\`\`\`

---

## Задание

Напишите функцию \`make_greeting(name, age)\`, которая **возвращает** строку вида:
\`"Привет! Я [name] и мне [age] лет."\``,
            starterCode: `def make_greeting(name, age):
    # Верните строку: "Привет! Я [name] и мне [age] лет."
    pass`,
            solution: `def make_greeting(name, age):
    return f"Привет! Я {name} и мне {age} лет."`,
            tests: t([
              { input: "str(make_greeting('Алиса', 20))", expected: "Привет! Я Алиса и мне 20 лет.", description: "make_greeting('Алиса', 20) → 'Привет! Я Алиса и мне 20 лет.'" },
              { input: "str(make_greeting('Боб', 35))", expected: "Привет! Я Боб и мне 35 лет.", description: "make_greeting('Боб', 35) → правильная строка" },
            ]),
            hints: t([
              "Используйте f-строку: `f\"Привет! Я {name} и мне {age} лет.\"`",
              "Не забудьте `return` — без него функция вернёт None.",
              "Решение: `return f\"Привет! Я {name} и мне {age} лет.\"`",
            ]),
          },

          {
            title: "Переменные: контейнеры для данных",
            order: 3,
            type: "code",
            language: "python",
            xpReward: 70,
            content: `# Переменные: контейнеры для данных

## Что такое переменная?

Переменная — это **именованное место в памяти**, где хранится значение. Думайте о ней как о коробке с наклейкой.

\`\`\`python
name = "Alice"    # строка
age = 25          # число
height = 1.75     # дробное число
is_student = True # булево
\`\`\`

## Правила именования

\`\`\`python
user_name = "Alice"   # ✓ snake_case (стиль Python)
userName = "Alice"    # ✓ работает, но не питонично
2name = "Alice"       # ✗ нельзя начинать с цифры
my-var = 5            # ✗ дефис запрещён
\`\`\`

## Переменные можно менять

\`\`\`python
score = 0
score = score + 10  # теперь 10
score += 5          # теперь 15  (то же самое)
score *= 2          # теперь 30
\`\`\`

## Несколько переменных сразу

\`\`\`python
x, y, z = 1, 2, 3        # распаковка
a = b = c = 0             # все равны 0
first, *rest = [1,2,3,4]  # first=1, rest=[2,3,4]
\`\`\`

---

## Задание

Напишите функцию \`swap(a, b)\`, которая возвращает **кортеж** \`(b, a)\` — значения поменяны местами.`,
            starterCode: `def swap(a, b):
    # Поменяйте a и b местами, верните (b, a)
    pass`,
            solution: `def swap(a, b):
    return (b, a)`,
            tests: t([
              { input: "str(swap(1, 2))", expected: "(2, 1)", description: "swap(1, 2) → (2, 1)" },
              { input: "str(swap('hello', 'world'))", expected: "('world', 'hello')", description: "swap('hello', 'world') → ('world', 'hello')" },
              { input: "str(swap(10, 20))", expected: "(20, 10)", description: "swap(10, 20) → (20, 10)" },
            ]),
            hints: t([
              "В Python можно вернуть несколько значений через запятую: `return b, a`",
              "Это создаёт кортеж: `return (b, a)` — то же самое.",
            ]),
          },

          {
            title: "Числа: арифметика и операторы",
            order: 4,
            type: "code",
            language: "python",
            xpReward: 80,
            content: `# Числа: арифметика и операторы

## Типы чисел

\`\`\`python
x = 42          # int — целое
y = 3.14        # float — дробное
z = 1 + 2j      # complex — комплексное (редко)
\`\`\`

## Арифметические операторы

\`\`\`python
10 + 3    # 13  — сложение
10 - 3    # 7   — вычитание
10 * 3    # 30  — умножение
10 / 3    # 3.333... — деление (всегда float)
10 // 3   # 3   — целочисленное деление (отбрасывает дробь)
10 % 3    # 1   — остаток от деления
2 ** 8    # 256 — возведение в степень
-5        # отрицательное
\`\`\`

## Приоритет операций

Python следует математическим правилам:
\`** > * / // % > + -\`

\`\`\`python
2 + 3 * 4      # 14 (не 20!)
(2 + 3) * 4    # 20 (скобки меняют порядок)
2 ** 3 ** 2    # 512 (правоассоциативно: 2**(3**2) = 2**9)
\`\`\`

## Встроенные функции

\`\`\`python
abs(-7)         # 7      — модуль числа
round(3.567, 2) # 3.57   — округление
round(3.5)      # 4      — до ближайшего чётного (banker's rounding!)
min(3, 1, 4, 1) # 1
max(3, 1, 4, 1) # 4
pow(2, 10)      # 1024   — то же что 2**10
divmod(17, 5)   # (3, 2) — частное и остаток вместе
\`\`\`

---

## Задание

Напишите функцию \`celsius_to_fahrenheit(c)\`, которая переводит температуру из Цельсия в Фаренгейт по формуле:

**F = C × 9/5 + 32**

Результат округлите до **1 знака** после запятой.`,
            starterCode: `def celsius_to_fahrenheit(c):
    # Переведите градусы Цельсия в Фаренгейт
    pass`,
            solution: `def celsius_to_fahrenheit(c):
    return round(c * 9 / 5 + 32, 1)`,
            tests: t([
              { input: "str(celsius_to_fahrenheit(0))", expected: "32.0", description: "0°C → 32.0°F" },
              { input: "str(celsius_to_fahrenheit(100))", expected: "212.0", description: "100°C → 212.0°F" },
              { input: "str(celsius_to_fahrenheit(37))", expected: "98.6", description: "37°C → 98.6°F (температура тела)" },
              { input: "str(celsius_to_fahrenheit(-40))", expected: "-40.0", description: "-40°C → -40.0°F (совпадают!)" },
            ]),
            hints: t([
              "Формула: `c * 9 / 5 + 32`",
              "Округление: `round(value, 1)` — 1 знак после запятой.",
              "Решение: `return round(c * 9 / 5 + 32, 1)`",
            ]),
          },

          // ═══════════════════════════════════════════════════════
          // МОДУЛЬ 2: СТРОКИ
          // ═══════════════════════════════════════════════════════

          {
            title: "Строки: основы текста",
            order: 5,
            type: "code",
            language: "python",
            xpReward: 80,
            content: `# Строки: основы текста

## Создание строк

\`\`\`python
s1 = "Двойные кавычки"
s2 = 'Одинарные кавычки'
s3 = """Многострочная
строка"""
\`\`\`

## Спецсимволы

\`\`\`python
"Новая\\nстрока"      # \\n — перенос строки
"Таб\\tотступ"        # \\t — табуляция
"Кавычка: \\""        # \\" — экранирование
r"C:\\Users\\file"    # r"..." — raw строка (без экранирования)
\`\`\`

## Конкатенация и повторение

\`\`\`python
"Hello" + " " + "World"  # "Hello World"
"ha" * 3                  # "hahaha"
\`\`\`

## Индексирование и срезы

\`\`\`python
s = "Python"
s[0]      # "P"  — первый символ
s[-1]     # "n"  — последний
s[1:4]    # "yth" — с 1 по 3 включительно
s[:3]     # "Pyt" — с начала по 2
s[3:]     # "hon" — с 3 до конца
s[::-1]   # "nohtyP" — строка наоборот!
\`\`\`

## Длина строки

\`\`\`python
len("Python")  # 6
len("")         # 0
\`\`\`

---

## Задание

Напишите функцию \`reverse_words(sentence)\`, которая переворачивает **порядок слов** в строке (не символы внутри слова).

Пример: \`"Hello World Python"\` → \`"Python World Hello"\``,
            starterCode: `def reverse_words(sentence):
    # Переверните порядок слов в строке
    pass`,
            solution: `def reverse_words(sentence):
    return " ".join(sentence.split()[::-1])`,
            tests: t([
              { input: "str(reverse_words('Hello World Python'))", expected: "Python World Hello", description: "reverse_words('Hello World Python') → 'Python World Hello'" },
              { input: "str(reverse_words('one two three'))", expected: "three two one", description: "reverse_words('one two three') → 'three two one'" },
              { input: "str(reverse_words('solo'))", expected: "solo", description: "reverse_words('solo') → 'solo' (одно слово)" },
            ]),
            hints: t([
              "`str.split()` разбивает строку по пробелам: `'a b c'.split()` → `['a', 'b', 'c']`",
              "Срез `[::-1]` переворачивает список: `['a','b','c'][::-1]` → `['c','b','a']`",
              "`' '.join(list)` соединяет список в строку через пробел.",
              "Решение: `return ' '.join(sentence.split()[::-1])`",
            ]),
          },

          {
            title: "Строки: методы и операции",
            order: 6,
            type: "code",
            language: "python",
            xpReward: 90,
            content: `# Строки: методы и операции

Строки в Python имеют десятки встроенных методов. Вот самые важные:

## Регистр

\`\`\`python
"hello".upper()        # "HELLO"
"HELLO".lower()        # "hello"
"hello world".title()  # "Hello World"
"hElLo".swapcase()     # "HeLlO"
\`\`\`

## Поиск и проверки

\`\`\`python
"hello".startswith("he")   # True
"hello".endswith("lo")     # True
"hello".find("ll")         # 2 (индекс) или -1
"hello".count("l")         # 2 (число вхождений)
"hello" in "say hello"     # True (оператор in)
\`\`\`

## Обработка

\`\`\`python
"  hello  ".strip()           # "hello" (пробелы по краям)
"  hello  ".lstrip()          # "hello  " (только слева)
"hello world".replace("o","0") # "hell0 w0rld"
"a,b,c".split(",")            # ["a", "b", "c"]
",".join(["a","b","c"])       # "a,b,c"
\`\`\`

## Проверки типа содержимого

\`\`\`python
"123".isdigit()     # True — только цифры
"abc".isalpha()     # True — только буквы
"abc123".isalnum()  # True — буквы и цифры
"   ".isspace()     # True — только пробелы
\`\`\`

---

## Задание

Напишите функцию \`is_palindrome(word)\`, которая проверяет, является ли слово **палиндромом** (читается одинаково слева и справа). Регистр игнорировать.

Примеры: \`"racecar"\` → True, \`"level"\` → True, \`"hello"\` → False`,
            starterCode: `def is_palindrome(word):
    # Проверьте, является ли слово палиндромом (без учёта регистра)
    pass`,
            solution: `def is_palindrome(word):
    cleaned = word.lower()
    return cleaned == cleaned[::-1]`,
            tests: t([
              { input: "str(is_palindrome('racecar'))", expected: "True", description: "is_palindrome('racecar') → True" },
              { input: "str(is_palindrome('level'))", expected: "True", description: "is_palindrome('level') → True" },
              { input: "str(is_palindrome('Madam'))", expected: "True", description: "is_palindrome('Madam') → True (регистр не важен)" },
              { input: "str(is_palindrome('hello'))", expected: "False", description: "is_palindrome('hello') → False" },
            ]),
            hints: t([
              "Сначала приведите к нижнему регистру: `word.lower()`",
              "Срез `[::-1]` разворачивает строку.",
              "Решение: `cleaned = word.lower(); return cleaned == cleaned[::-1]`",
            ]),
          },

          {
            title: "F-строки: форматирование текста",
            order: 7,
            type: "code",
            language: "python",
            xpReward: 80,
            content: `# F-строки: форматирование текста

**F-строки** (formatted string literals) — самый удобный способ вставить переменную в текст.

## Базовый синтаксис

\`\`\`python
name = "Alice"
age = 25
print(f"Меня зовут {name}, мне {age} лет")
# Меня зовут Alice, мне 25 лет
\`\`\`

## Выражения внутри {}

\`\`\`python
x = 10
print(f"x = {x}, x² = {x**2}, x/3 = {x/3:.2f}")
# x = 10, x² = 100, x/3 = 3.33
\`\`\`

## Форматирование чисел

\`\`\`python
pi = 3.14159
f"{pi:.2f}"       # "3.14"     — 2 знака после запятой
f"{pi:.0f}"       # "3"        — без дробной части
f"{1000000:,}"    # "1,000,000" — с разделителем тысяч
f"{0.456:.1%}"    # "45.6%"    — проценты
f"{42:05d}"       # "00042"    — с нулями спереди, ширина 5
f"{42:>10}"       # "        42" — выравнивание вправо
f"{42:<10}"       # "42        " — выравнивание влево
f"{'hi':^10}"     # "    hi    " — центрирование
\`\`\`

---

## Задание

Напишите функцию \`format_price(amount, currency="₽")\`, которая форматирует сумму: число с **2 знаками** после запятой и символом валюты.

Пример: \`format_price(1999.9)\` → \`"1999.90 ₽"\`
Пример: \`format_price(50, "$")\` → \`"50.00 $"\``,
            starterCode: `def format_price(amount, currency="₽"):
    # Верните строку вида "1999.90 ₽"
    pass`,
            solution: `def format_price(amount, currency="₽"):
    return f"{amount:.2f} {currency}"`,
            tests: t([
              { input: "str(format_price(1999.9))", expected: "1999.90 ₽", description: "format_price(1999.9) → '1999.90 ₽'" },
              { input: "str(format_price(50, '$'))", expected: "50.00 $", description: "format_price(50, '$') → '50.00 $'" },
              { input: "str(format_price(0.5))", expected: "0.50 ₽", description: "format_price(0.5) → '0.50 ₽'" },
            ]),
            hints: t([
              "Форматирование числа: `f\"{amount:.2f}\"` — 2 знака после запятой.",
              "Решение: `return f\"{amount:.2f} {currency}\"`",
            ]),
          },

          {
            title: "Типы данных и преобразование",
            order: 8,
            type: "code",
            language: "python",
            xpReward: 90,
            content: `# Типы данных и преобразование

## Основные типы Python

| Тип | Пример | Назначение |
|-----|--------|-----------|
| \`int\` | \`42\`, \`-7\`, \`0\` | Целые числа |
| \`float\` | \`3.14\`, \`-0.5\` | Дробные числа |
| \`str\` | \`"hello"\` | Текст |
| \`bool\` | \`True\`, \`False\` | Логические значения |
| \`NoneType\` | \`None\` | Отсутствие значения |
| \`list\` | \`[1, 2, 3]\` | Изменяемый список |
| \`tuple\` | \`(1, 2, 3)\` | Неизменяемый список |
| \`dict\` | \`{"a": 1}\` | Словарь ключ-значение |
| \`set\` | \`{1, 2, 3}\` | Множество уникальных значений |

## Проверка типа

\`\`\`python
type(42)           # <class 'int'>
type(42).__name__  # 'int'
isinstance(42, int)    # True
isinstance(42, (int, float))  # True
\`\`\`

## Явное преобразование

\`\`\`python
int("42")      # 42
int(3.99)      # 3 (отбрасывает дробь!)
float("3.14")  # 3.14
float(42)      # 42.0
str(100)       # "100"
str(True)      # "True"
bool(0)        # False
bool("")       # False
bool([])       # False
bool(None)     # False
bool(1)        # True
bool("any")    # True
\`\`\`

> **Правило**: Любое "пустое" или нулевое значение — False. Всё остальное — True.

---

## Задание

Напишите функцию \`safe_int(value, default=0)\`, которая пытается преобразовать \`value\` в \`int\`. Если не получается — возвращает \`default\`.`,
            starterCode: `def safe_int(value, default=0):
    # Попробуйте int(value), при ошибке верните default
    pass`,
            solution: `def safe_int(value, default=0):
    try:
        return int(value)
    except (ValueError, TypeError):
        return default`,
            tests: t([
              { input: "str(safe_int('42'))", expected: "42", description: "safe_int('42') → 42" },
              { input: "str(safe_int('abc'))", expected: "0", description: "safe_int('abc') → 0 (default)" },
              { input: "str(safe_int('abc', -1))", expected: "-1", description: "safe_int('abc', -1) → -1 (custom default)" },
              { input: "str(safe_int(3.9))", expected: "3", description: "safe_int(3.9) → 3" },
            ]),
            hints: t([
              "Используйте `try: int(value) except (ValueError, TypeError): return default`",
              "ValueError — когда нельзя конвертировать строку ('abc'). TypeError — когда тип вообще несовместим.",
            ]),
          },

          // ═══════════════════════════════════════════════════════
          // МОДУЛЬ 3: БУЛЕВА ЛОГИКА И УСЛОВИЯ
          // ═══════════════════════════════════════════════════════

          {
            title: "Булева логика: True и False",
            order: 9,
            type: "code",
            language: "python",
            xpReward: 80,
            content: `# Булева логика: True и False

## Операторы сравнения

\`\`\`python
5 > 3       # True
5 < 3       # False
5 >= 5      # True
5 <= 4      # False
5 == 5      # True  (равно — ДВОЙНОЙ знак!)
5 != 3      # True  (не равно)
"a" == "a"  # True  (строки тоже сравниваются)
\`\`\`

## Логические операторы

\`\`\`python
True and True    # True  — оба должны быть True
True and False   # False
True or False    # True  — хотя бы один True
False or False   # False
not True         # False — инверсия
not False        # True
\`\`\`

## Таблица истинности AND

| A | B | A and B |
|---|---|---------|
| True | True | True |
| True | False | False |
| False | True | False |
| False | False | False |

## Цепочки сравнений (только в Python!)

\`\`\`python
1 < x < 10      # проверяет x > 1 И x < 10
0 <= age <= 120  # допустимый возраст
\`\`\`

## Короткое замыкание (short-circuit)

\`\`\`python
# and: если первое False — второе не вычисляется
False and (1/0)  # False (деление не случится)
# or: если первое True — второе не вычисляется
True or (1/0)    # True
\`\`\`

---

## Задание

Напишите функцию \`can_vote(age, citizen)\`, которая возвращает \`True\` если человек может голосовать (возраст >= 18 И гражданин).`,
            starterCode: `def can_vote(age, citizen):
    # Верните True если age >= 18 И citizen == True
    pass`,
            solution: `def can_vote(age, citizen):
    return age >= 18 and citizen`,
            tests: t([
              { input: "str(can_vote(20, True))", expected: "True", description: "can_vote(20, True) → True" },
              { input: "str(can_vote(16, True))", expected: "False", description: "can_vote(16, True) → False (молод)" },
              { input: "str(can_vote(25, False))", expected: "False", description: "can_vote(25, False) → False (не гражданин)" },
              { input: "str(can_vote(17, False))", expected: "False", description: "can_vote(17, False) → False (оба False)" },
            ]),
            hints: t([
              "Комбинируйте условия через `and`: `age >= 18 and citizen`",
              "Нет нужды писать `citizen == True` — `citizen` уже является True/False.",
            ]),
          },

          {
            title: "Условия: if / elif / else",
            order: 10,
            type: "code",
            language: "python",
            xpReward: 100,
            content: `# Условия: if / elif / else

## Синтаксис

\`\`\`python
if условие_1:
    # выполняется если условие_1 True
elif условие_2:
    # выполняется если условие_1 False, но условие_2 True
elif условие_3:
    # ...можно добавить сколько угодно elif
else:
    # выполняется если все условия False
\`\`\`

**Важно**: Python использует **отступы** (4 пробела или Tab) вместо скобок!

## Пример: классификация чисел

\`\`\`python
def classify(n):
    if n > 0:
        return "положительное"
    elif n < 0:
        return "отрицательное"
    else:
        return "ноль"
\`\`\`

## Тернарный оператор (однострочный if)

\`\`\`python
result = "чётное" if n % 2 == 0 else "нечётное"
\`\`\`

## Вложенные if

\`\`\`python
if age >= 18:
    if has_id:
        print("Можно войти")
    else:
        print("Нужно удостоверение")
else:
    print("Нельзя")
\`\`\`

---

## Задание

Напишите функцию \`season(month)\`, которая принимает номер месяца (1-12) и возвращает время года:
- 12, 1, 2 → \`"Зима"\`
- 3, 4, 5 → \`"Весна"\`
- 6, 7, 8 → \`"Лето"\`
- 9, 10, 11 → \`"Осень"\``,
            starterCode: `def season(month):
    # Верните время года по номеру месяца (1-12)
    pass`,
            solution: `def season(month):
    if month in [12, 1, 2]:
        return "Зима"
    elif month in [3, 4, 5]:
        return "Весна"
    elif month in [6, 7, 8]:
        return "Лето"
    else:
        return "Осень"`,
            tests: t([
              { input: "str(season(1))", expected: "Зима", description: "season(1) → 'Зима' (январь)" },
              { input: "str(season(12))", expected: "Зима", description: "season(12) → 'Зима' (декабрь)" },
              { input: "str(season(5))", expected: "Весна", description: "season(5) → 'Весна'" },
              { input: "str(season(7))", expected: "Лето", description: "season(7) → 'Лето'" },
              { input: "str(season(10))", expected: "Осень", description: "season(10) → 'Осень'" },
            ]),
            hints: t([
              "Оператор `in` проверяет вхождение: `month in [12, 1, 2]`",
              "Декабрь (12) — зима, не забудьте добавить его в зимний список.",
            ]),
          },

          {
            title: "Вложенные условия и match",
            order: 11,
            type: "code",
            language: "python",
            xpReward: 90,
            content: `# Вложенные условия и match

## Сложные условия

\`\`\`python
# Плохо — слишком вложено:
if a:
    if b:
        if c:
            do_something()

# Лучше — один if с and:
if a and b and c:
    do_something()
\`\`\`

## match/case (Python 3.10+)

Аналог switch в других языках — удобен для многих вариантов:

\`\`\`python
def http_status(code):
    match code:
        case 200:
            return "OK"
        case 404:
            return "Not Found"
        case 500:
            return "Server Error"
        case _:      # _ — любое значение (default)
            return "Unknown"
\`\`\`

## match с несколькими значениями

\`\`\`python
match command:
    case "quit" | "exit" | "q":
        return "Выход"
    case "help" | "h" | "?":
        return "Справка"
\`\`\`

## Условные выражения в match

\`\`\`python
match point:
    case (x, y) if x == y:
        print("Диагональ")
    case (x, y):
        print(f"Точка ({x}, {y})")
\`\`\`

---

## Задание

Напишите функцию \`day_type(day)\`, которая принимает день недели (строку) и возвращает:
- \`"Рабочий день"\` для Mon, Tue, Wed, Thu, Fri
- \`"Выходной"\` для Sat, Sun
- \`"Неизвестный день"\` для всего остального`,
            starterCode: `def day_type(day):
    # Используйте if/elif или match/case
    pass`,
            solution: `def day_type(day):
    if day in ["Mon", "Tue", "Wed", "Thu", "Fri"]:
        return "Рабочий день"
    elif day in ["Sat", "Sun"]:
        return "Выходной"
    else:
        return "Неизвестный день"`,
            tests: t([
              { input: "str(day_type('Mon'))", expected: "Рабочий день", description: "day_type('Mon') → 'Рабочий день'" },
              { input: "str(day_type('Fri'))", expected: "Рабочий день", description: "day_type('Fri') → 'Рабочий день'" },
              { input: "str(day_type('Sat'))", expected: "Выходной", description: "day_type('Sat') → 'Выходной'" },
              { input: "str(day_type('Sun'))", expected: "Выходной", description: "day_type('Sun') → 'Выходной'" },
              { input: "str(day_type('xyz'))", expected: "Неизвестный день", description: "day_type('xyz') → 'Неизвестный день'" },
            ]),
            hints: t([
              "Оператор `in` удобен для проверки на несколько значений: `day in ['Mon', 'Tue', ...]`",
            ]),
          },

          // ═══════════════════════════════════════════════════════
          // МОДУЛЬ 4: ЦИКЛЫ
          // ═══════════════════════════════════════════════════════

          {
            title: "Цикл for: перебор последовательностей",
            order: 12,
            type: "code",
            language: "python",
            xpReward: 100,
            content: `# Цикл for: перебор последовательностей

## Базовый синтаксис

\`\`\`python
for переменная in последовательность:
    # тело цикла
\`\`\`

## Перебор строки

\`\`\`python
for char in "Python":
    print(char)  # P, y, t, h, o, n
\`\`\`

## Перебор списка

\`\`\`python
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)
\`\`\`

## enumerate() — индекс + значение

\`\`\`python
for i, fruit in enumerate(fruits):
    print(f"{i + 1}. {fruit}")
# 1. apple
# 2. banana
# 3. cherry
\`\`\`

## zip() — несколько списков одновременно

\`\`\`python
names = ["Alice", "Bob", "Charlie"]
scores = [95, 80, 70]
for name, score in zip(names, scores):
    print(f"{name}: {score}")
\`\`\`

## Вложенные циклы

\`\`\`python
for i in range(3):
    for j in range(3):
        print(f"({i},{j})", end=" ")
# (0,0) (0,1) (0,2) (1,0) ...
\`\`\`

---

## Задание

Напишите функцию \`count_vowels(text)\`, которая считает количество **гласных букв** (a, e, i, o, u) в тексте. Регистр не важен.`,
            starterCode: `def count_vowels(text):
    # Посчитайте количество гласных (a, e, i, o, u)
    pass`,
            solution: `def count_vowels(text):
    count = 0
    for char in text.lower():
        if char in "aeiou":
            count += 1
    return count`,
            tests: t([
              { input: "str(count_vowels('hello'))", expected: "2", description: "count_vowels('hello') → 2 (e, o)" },
              { input: "str(count_vowels('Python'))", expected: "1", description: "count_vowels('Python') → 1 (только o)" },
              { input: "str(count_vowels('AEIOU'))", expected: "5", description: "count_vowels('AEIOU') → 5 (регистр не важен)" },
              { input: "str(count_vowels('bcdf'))", expected: "0", description: "count_vowels('bcdf') → 0 (нет гласных)" },
            ]),
            hints: t([
              "Переберите каждый символ: `for char in text.lower()`",
              "Проверяйте вхождение: `if char in 'aeiou'`",
              "Решение:\n```python\ncount = 0\nfor char in text.lower():\n    if char in 'aeiou':\n        count += 1\nreturn count\n```",
            ]),
          },

          {
            title: "range(): числовые последовательности",
            order: 13,
            type: "code",
            language: "python",
            xpReward: 90,
            content: `# range(): числовые последовательности

\`range()\` — встроенная функция для генерации числовых последовательностей.

## Варианты вызова

\`\`\`python
range(5)          # 0, 1, 2, 3, 4        (5 элементов от 0)
range(2, 7)       # 2, 3, 4, 5, 6        (от 2 до 6)
range(0, 10, 2)   # 0, 2, 4, 6, 8        (каждый второй)
range(10, 0, -1)  # 10, 9, 8, ..., 1     (обратный отсчёт)
range(10, 0, -2)  # 10, 8, 6, 4, 2       (каждый второй обратно)
\`\`\`

## Преобразование в список

\`\`\`python
list(range(5))          # [0, 1, 2, 3, 4]
list(range(1, 11))      # [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
\`\`\`

## Практические примеры

\`\`\`python
# Сумма 1..100
total = sum(range(1, 101))  # 5050

# Чётные от 0 до 20
evens = list(range(0, 21, 2))

# Обратный отсчёт
for i in range(5, 0, -1):
    print(i, end=" ")  # 5 4 3 2 1
\`\`\`

---

## Задание

Напишите функцию \`sum_divisible(n, divisor)\`, которая возвращает **сумму всех чисел** от 1 до n (включительно), которые делятся на \`divisor\` без остатка.`,
            starterCode: `def sum_divisible(n, divisor):
    # Сумма чисел от 1 до n, делящихся на divisor
    pass`,
            solution: `def sum_divisible(n, divisor):
    return sum(i for i in range(1, n + 1) if i % divisor == 0)`,
            tests: t([
              { input: "str(sum_divisible(10, 2))", expected: "30", description: "sum_divisible(10, 2) → 30 (2+4+6+8+10)" },
              { input: "str(sum_divisible(15, 3))", expected: "45", description: "sum_divisible(15, 3) → 45 (3+6+9+12+15)" },
              { input: "str(sum_divisible(7, 7))", expected: "7", description: "sum_divisible(7, 7) → 7" },
            ]),
            hints: t([
              "`range(1, n + 1)` даёт числа от 1 до n включительно.",
              "Используйте `sum()` с генератором: `sum(i for i in range(1, n+1) if i % divisor == 0)`",
            ]),
          },

          {
            title: "Цикл while и break/continue",
            order: 14,
            type: "code",
            language: "python",
            xpReward: 100,
            content: `# Цикл while и break/continue

## while — цикл с условием

\`\`\`python
while условие:
    # тело цикла (выполняется пока условие True)
\`\`\`

\`\`\`python
count = 0
while count < 5:
    print(count)
    count += 1  # ОБЯЗАТЕЛЬНО изменяйте переменную!
\`\`\`

## Бесконечный цикл + break

\`\`\`python
while True:
    text = input("Введите 'стоп': ")
    if text == "стоп":
        break  # выходим из цикла
    print(f"Вы написали: {text}")
\`\`\`

## continue — пропустить итерацию

\`\`\`python
for i in range(10):
    if i % 2 == 0:
        continue  # пропускаем чётные, идём к следующей итерации
    print(i)  # 1, 3, 5, 7, 9
\`\`\`

## else в цикле (редкая фича Python)

\`\`\`python
for i in range(5):
    print(i)
else:
    print("Цикл завершился нормально")  # выполняется если не было break
\`\`\`

## Типичный паттерн: накопитель

\`\`\`python
total = 0
i = 1
while i <= 100:
    total += i
    i += 1
# total == 5050
\`\`\`

---

## Задание

Напишите функцию \`collatz(n)\`, которая реализует **последовательность Коллатца**:
- Если n чётное → делить на 2
- Если n нечётное → умножить на 3 и прибавить 1
- Повторять пока n != 1
Верните количество шагов до достижения 1.`,
            starterCode: `def collatz(n):
    # Посчитайте количество шагов последовательности Коллатца
    pass`,
            solution: `def collatz(n):
    steps = 0
    while n != 1:
        if n % 2 == 0:
            n = n // 2
        else:
            n = n * 3 + 1
        steps += 1
    return steps`,
            tests: t([
              { input: "str(collatz(1))", expected: "0", description: "collatz(1) → 0 (уже равно 1)" },
              { input: "str(collatz(6))", expected: "8", description: "collatz(6) → 8 шагов" },
              { input: "str(collatz(27))", expected: "111", description: "collatz(27) → 111 шагов" },
            ]),
            hints: t([
              "Используйте `while n != 1` и считайте шаги.",
              "Чётность: `if n % 2 == 0: n //= 2` else `n = n * 3 + 1`",
            ]),
          },

          // ═══════════════════════════════════════════════════════
          // МОДУЛЬ 5: СПИСКИ
          // ═══════════════════════════════════════════════════════

          {
            title: "Списки: создание и основы",
            order: 15,
            type: "code",
            language: "python",
            xpReward: 100,
            content: `# Списки: создание и основы

**Список** (list) — упорядоченная коллекция элементов. Элементы могут быть любого типа.

## Создание

\`\`\`python
nums = [1, 2, 3, 4, 5]
mixed = [1, "hello", True, 3.14, None]
empty = []
nested = [[1, 2], [3, 4], [5, 6]]  # список списков
\`\`\`

## Индексирование

\`\`\`python
nums = [10, 20, 30, 40, 50]
nums[0]     # 10 (первый)
nums[-1]    # 50 (последний)
nums[-2]    # 40 (предпоследний)
\`\`\`

## Срезы (slices)

\`\`\`python
nums = [10, 20, 30, 40, 50]
nums[1:3]    # [20, 30]  (с 1 до 2 включительно)
nums[:2]     # [10, 20]  (первые два)
nums[2:]     # [30, 40, 50] (с 3-го до конца)
nums[::2]    # [10, 30, 50] (каждый второй)
nums[::-1]   # [50, 40, 30, 20, 10] (разворот)
\`\`\`

## Изменение списка

\`\`\`python
nums[0] = 100       # замена по индексу
nums[1:3] = [21, 31] # замена среза
\`\`\`

## Проверка и поиск

\`\`\`python
3 in [1, 2, 3, 4]   # True
[1,2,3].index(2)    # 1 (индекс первого вхождения)
[1,2,1].count(1)    # 2 (количество вхождений)
\`\`\`

---

## Задание

Напишите функцию \`flatten(matrix)\`, которая преобразует **двумерный список** (список списков) в **одномерный**.

Пример: \`[[1,2],[3,4],[5,6]]\` → \`[1,2,3,4,5,6]\``,
            starterCode: `def flatten(matrix):
    # Превратите список списков в плоский список
    pass`,
            solution: `def flatten(matrix):
    result = []
    for row in matrix:
        for item in row:
            result.append(item)
    return result`,
            tests: t([
              { input: "str(flatten([[1,2],[3,4],[5,6]]))", expected: "[1, 2, 3, 4, 5, 6]", description: "flatten([[1,2],[3,4],[5,6]]) → [1, 2, 3, 4, 5, 6]" },
              { input: "str(flatten([[1],[2,3,4]]))", expected: "[1, 2, 3, 4]", description: "flatten([[1],[2,3,4]]) → [1, 2, 3, 4]" },
              { input: "str(flatten([]))", expected: "[]", description: "flatten([]) → []" },
            ]),
            hints: t([
              "Используйте вложенный цикл: внешний по строкам, внутренний по элементам.",
              "Или list comprehension: `[item for row in matrix for item in row]`",
            ]),
          },

          {
            title: "Списки: методы и трансформации",
            order: 16,
            type: "code",
            language: "python",
            xpReward: 110,
            content: `# Списки: методы и трансформации

## Добавление и удаление

\`\`\`python
lst = [1, 2, 3]
lst.append(4)         # [1, 2, 3, 4]
lst.insert(1, 99)     # [1, 99, 2, 3, 4] (по индексу)
lst.extend([5, 6])    # [1, 99, 2, 3, 4, 5, 6] (добавить много)
lst.pop()             # удаляет и возвращает последний
lst.pop(0)            # удаляет и возвращает по индексу
lst.remove(99)        # удаляет первое вхождение значения
lst.clear()           # очистить весь список
\`\`\`

## Сортировка

\`\`\`python
nums = [3, 1, 4, 1, 5, 9]
nums.sort()               # сортировка на месте [1,1,3,4,5,9]
nums.sort(reverse=True)   # обратная [9,5,4,3,1,1]
sorted(nums)              # НОВЫЙ список (оригинал не меняется)
sorted(nums, key=abs)     # по абсолютному значению
\`\`\`

## Полезные функции

\`\`\`python
sum([1, 2, 3])         # 6
min([3, 1, 4])         # 1
max([3, 1, 4])         # 4
len([1, 2, 3])         # 3
list(reversed([1,2,3])) # [3, 2, 1]
\`\`\`

## map() и filter()

\`\`\`python
list(map(str, [1, 2, 3]))        # ["1", "2", "3"]
list(filter(lambda x: x>0, [-1, 0, 1, 2]))  # [1, 2]
\`\`\`

---

## Задание

Напишите функцию \`top_n(numbers, n)\`, которая возвращает **n наибольших** элементов списка, **отсортированных по убыванию**.`,
            starterCode: `def top_n(numbers, n):
    # Верните n наибольших элементов, отсортированных по убыванию
    pass`,
            solution: `def top_n(numbers, n):
    return sorted(numbers, reverse=True)[:n]`,
            tests: t([
              { input: "str(top_n([3,1,4,1,5,9,2,6], 3))", expected: "[9, 6, 5]", description: "top_n([3,1,4,1,5,9,2,6], 3) → [9, 6, 5]" },
              { input: "str(top_n([10, 5, 20], 2))", expected: "[20, 10]", description: "top_n([10,5,20], 2) → [20, 10]" },
              { input: "str(top_n([1], 1))", expected: "[1]", description: "top_n([1], 1) → [1]" },
            ]),
            hints: t([
              "`sorted(numbers, reverse=True)` даёт список от большего к меньшему.",
              "Срез `[:n]` берёт первые n элементов.",
            ]),
          },

          {
            title: "List comprehension: элегантный код",
            order: 17,
            type: "code",
            language: "python",
            xpReward: 110,
            content: `# List comprehension: элегантный код

**List comprehension** — питонический способ создать список в одну строку.

## Базовый синтаксис

\`\`\`python
# Обычный цикл:
squares = []
for x in range(5):
    squares.append(x ** 2)

# List comprehension:
squares = [x ** 2 for x in range(5)]
# [0, 1, 4, 9, 16]
\`\`\`

## С условием (фильтрация)

\`\`\`python
# Только чётные квадраты:
[x**2 for x in range(10) if x % 2 == 0]
# [0, 4, 16, 36, 64]
\`\`\`

## Вложенные

\`\`\`python
# Все пары (i, j):
[(i, j) for i in range(3) for j in range(3)]
# [(0,0), (0,1), (0,2), (1,0), ...]

# Транспонирование матрицы:
matrix = [[1,2,3],[4,5,6]]
transposed = [[row[i] for row in matrix] for i in range(3)]
\`\`\`

## Dict и set comprehension

\`\`\`python
# Dict:
{x: x**2 for x in range(5)}
# {0:0, 1:1, 2:4, 3:9, 4:16}

# Set:
{x % 3 for x in range(10)}
# {0, 1, 2}
\`\`\`

---

## Задание

Напишите функцию \`fizzbuzz_list(n)\`, которая возвращает список строк от 1 до n:
- \`"FizzBuzz"\` для кратных 15
- \`"Fizz"\` для кратных 3
- \`"Buzz"\` для кратных 5
- Строку с числом для остальных`,
            starterCode: `def fizzbuzz_list(n):
    # Верните список FizzBuzz от 1 до n включительно
    pass`,
            solution: `def fizzbuzz_list(n):
    return [
        "FizzBuzz" if i % 15 == 0
        else "Fizz" if i % 3 == 0
        else "Buzz" if i % 5 == 0
        else str(i)
        for i in range(1, n + 1)
    ]`,
            tests: t([
              { input: "str(fizzbuzz_list(5))", expected: "['1', '2', 'Fizz', '4', 'Buzz']", description: "fizzbuzz_list(5) → ['1','2','Fizz','4','Buzz']" },
              { input: "str(fizzbuzz_list(15)[14])", expected: "FizzBuzz", description: "fizzbuzz_list(15)[14] → 'FizzBuzz'" },
              { input: "str(fizzbuzz_list(1))", expected: "['1']", description: "fizzbuzz_list(1) → ['1']" },
            ]),
            hints: t([
              "В list comprehension можно использовать тернарный оператор: `'Fizz' if ... else ...`",
              "Цепочка тернарных: `'FB' if x%15==0 else 'F' if x%3==0 else 'B' if x%5==0 else str(x)`",
            ]),
          },

          // ═══════════════════════════════════════════════════════
          // МОДУЛЬ 6: КОРТЕЖИ И МНОЖЕСТВА
          // ═══════════════════════════════════════════════════════

          {
            title: "Кортежи (tuple): неизменяемые списки",
            order: 18,
            type: "code",
            language: "python",
            xpReward: 90,
            content: `# Кортежи (tuple): неизменяемые списки

**Кортеж** похож на список, но **нельзя изменить** после создания.

## Создание

\`\`\`python
point = (3, 4)
rgb = (255, 128, 0)
single = (42,)    # одноэлементный кортеж — обязательна запятая!
empty = ()
\`\`\`

## Операции

\`\`\`python
t = (1, 2, 3, 4, 5)
t[0]        # 1
t[-1]       # 5
t[1:3]      # (2, 3)
len(t)      # 5
t.count(1)  # 1
t.index(3)  # 2
\`\`\`

## Распаковка (очень важно!)

\`\`\`python
x, y = (3, 4)             # x=3, y=4
a, b, c = (1, 2, 3)
first, *rest = (1, 2, 3, 4)  # first=1, rest=[2,3,4]

# Обмен переменных:
a, b = b, a               # питонично и элегантно!
\`\`\`

## Когда использовать tuple vs list?

| | list | tuple |
|---|---|---|
| Изменяемость | Да | Нет |
| Производительность | Чуть медленнее | Быстрее |
| Использование | Когда нужно менять | Фиксированные данные |
| В качестве ключа dict | Нельзя | Можно |

---

## Задание

Напишите функцию \`minmax(numbers)\`, которая возвращает **кортеж** \`(минимум, максимум)\` из списка чисел.`,
            starterCode: `def minmax(numbers):
    # Верните кортеж (min, max) из списка
    pass`,
            solution: `def minmax(numbers):
    return (min(numbers), max(numbers))`,
            tests: t([
              { input: "str(minmax([3, 1, 4, 1, 5, 9]))", expected: "(1, 9)", description: "minmax([3,1,4,1,5,9]) → (1, 9)" },
              { input: "str(minmax([42]))", expected: "(42, 42)", description: "minmax([42]) → (42, 42)" },
              { input: "str(minmax([-5, 0, 5]))", expected: "(-5, 5)", description: "minmax([-5,0,5]) → (-5, 5)" },
            ]),
            hints: t([
              "Встроенные функции `min()` и `max()` принимают список.",
              "Возвращайте кортеж: `return (min(numbers), max(numbers))`",
            ]),
          },

          {
            title: "Множества (set): уникальные элементы",
            order: 19,
            type: "code",
            language: "python",
            xpReward: 100,
            content: `# Множества (set): уникальные элементы

**Множество** — коллекция **уникальных** элементов без определённого порядка.

## Создание

\`\`\`python
s = {1, 2, 3, 4, 5}
s2 = set([1, 2, 2, 3, 3])  # {1, 2, 3} — дубликаты удаляются
empty = set()               # НЕ {} — это пустой dict!
\`\`\`

## Основные операции

\`\`\`python
s = {1, 2, 3}
s.add(4)         # {1, 2, 3, 4}
s.remove(2)      # {1, 3, 4} — ошибка если нет
s.discard(99)    # {1, 3, 4} — без ошибки если нет
s.pop()          # удаляет случайный элемент
\`\`\`

## Теория множеств

\`\`\`python
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

a | b   # {1,2,3,4,5,6}  — объединение
a & b   # {3, 4}          — пересечение
a - b   # {1, 2}          — разность (в a, нет в b)
a ^ b   # {1,2,5,6}       — симметричная разность
\`\`\`

## Проверки

\`\`\`python
3 in {1, 2, 3}             # True
{1, 2}.issubset({1, 2, 3}) # True (подмножество)
{1,2,3}.issuperset({1,2})  # True (надмножество)
{1,2}.isdisjoint({3,4})    # True (нет общих)
\`\`\`

---

## Задание

Напишите функцию \`unique_chars(s)\`, которая возвращает **количество уникальных символов** в строке (без учёта регистра).`,
            starterCode: `def unique_chars(s):
    # Верните количество уникальных символов (без учёта регистра)
    pass`,
            solution: `def unique_chars(s):
    return len(set(s.lower()))`,
            tests: t([
              { input: "str(unique_chars('hello'))", expected: "4", description: "unique_chars('hello') → 4 (h,e,l,o)" },
              { input: "str(unique_chars('aAbBcC'))", expected: "3", description: "unique_chars('aAbBcC') → 3 (a,b,c)" },
              { input: "str(unique_chars('abc'))", expected: "3", description: "unique_chars('abc') → 3" },
            ]),
            hints: t([
              "`set(s.lower())` создаёт множество уникальных символов нижнего регистра.",
              "`len(set(s.lower()))` — количество уникальных символов.",
            ]),
          },

          // ═══════════════════════════════════════════════════════
          // МОДУЛЬ 7: СЛОВАРИ
          // ═══════════════════════════════════════════════════════

          {
            title: "Словари (dict): пары ключ-значение",
            order: 20,
            type: "code",
            language: "python",
            xpReward: 110,
            content: `# Словари (dict): пары ключ-значение

**Словарь** — структура данных, которая хранит пары «ключ → значение». Быстрый поиск по ключу.

## Создание

\`\`\`python
user = {
    "name": "Alice",
    "age": 25,
    "city": "Москва"
}
empty = {}
from_keys = dict(name="Bob", age=30)  # через ключевые аргументы
\`\`\`

## Чтение

\`\`\`python
user["name"]           # "Alice" (ошибка если нет ключа)
user.get("name")       # "Alice"
user.get("phone")      # None (нет ключа — нет ошибки)
user.get("phone", "—") # "—" (значение по умолчанию)
\`\`\`

## Изменение

\`\`\`python
user["age"] = 26            # изменить
user["email"] = "a@b.com"   # добавить
del user["city"]             # удалить
user.update({"age": 27, "city": "СПб"})  # обновить несколько
\`\`\`

## Перебор

\`\`\`python
for key in user:              # ключи
for val in user.values():     # значения
for key, val in user.items(): # пары
\`\`\`

## Полезные методы

\`\`\`python
user.keys()    # dict_keys(["name", "age"])
user.values()  # dict_values(["Alice", 25])
"name" in user # True (проверка ключа)
user.pop("age")           # удалить и вернуть значение
user.setdefault("score", 0)  # добавить если нет
\`\`\`

---

## Задание

Напишите функцию \`invert_dict(d)\`, которая **инвертирует** словарь: ключи становятся значениями, значения — ключами.

Пример: \`{"a": 1, "b": 2}\` → \`{1: "a", 2: "b"}\``,
            starterCode: `def invert_dict(d):
    # Поменяйте ключи и значения местами
    pass`,
            solution: `def invert_dict(d):
    return {v: k for k, v in d.items()}`,
            tests: t([
              { input: "str(invert_dict({'a': 1, 'b': 2}))", expected: "{1: 'a', 2: 'b'}", description: "invert_dict({'a':1,'b':2}) → {1:'a', 2:'b'}" },
              { input: "str(invert_dict({'x': 'y'}))", expected: "{'y': 'x'}", description: "invert_dict({'x':'y'}) → {'y':'x'}" },
              { input: "str(invert_dict({}))", expected: "{}", description: "invert_dict({}) → {}" },
            ]),
            hints: t([
              "Dict comprehension: `{v: k for k, v in d.items()}`",
              "`.items()` возвращает пары (ключ, значение).",
            ]),
          },

          {
            title: "Словари: продвинутые операции",
            order: 21,
            type: "code",
            language: "python",
            xpReward: 110,
            content: `# Словари: продвинутые операции

## defaultdict из collections

\`\`\`python
from collections import defaultdict

# Словарь, автоматически создающий значения по умолчанию:
counter = defaultdict(int)
for char in "abracadabra":
    counter[char] += 1
# defaultdict: {'a': 5, 'b': 2, 'r': 2, 'c': 1, 'd': 1}
\`\`\`

## Counter — подсчёт элементов

\`\`\`python
from collections import Counter

c = Counter("abracadabra")
c.most_common(2)  # [('a', 5), ('b', 2)]
\`\`\`

## Слияние словарей (Python 3.9+)

\`\`\`python
d1 = {"a": 1, "b": 2}
d2 = {"b": 3, "c": 4}
merged = d1 | d2    # {"a":1, "b":3, "c":4} — d2 перезаписывает
d1 |= d2            # d1 обновляется на месте
\`\`\`

## Сортировка словаря

\`\`\`python
d = {"b": 2, "a": 1, "c": 3}
sorted_by_key = dict(sorted(d.items()))          # {"a":1, "b":2, "c":3}
sorted_by_val = dict(sorted(d.items(), key=lambda x: x[1]))  # {"a":1, "b":2, "c":3}
\`\`\`

---

## Задание

Напишите функцию \`group_by_length(words)\`, которая группирует список слов по длине. Возвращает словарь \`{длина: [слова такой длины]}\`.

Пример: \`["cat", "dog", "elephant", "hi"]\` → \`{3: ["cat","dog"], 8: ["elephant"], 2: ["hi"]}\``,
            starterCode: `def group_by_length(words):
    # Сгруппируйте слова по длине
    pass`,
            solution: `def group_by_length(words):
    result = {}
    for word in words:
        key = len(word)
        if key not in result:
            result[key] = []
        result[key].append(word)
    return result`,
            tests: t([
              { input: "str(group_by_length(['cat', 'dog', 'hi']))", expected: "{3: ['cat', 'dog'], 2: ['hi']}", description: "group_by_length(['cat','dog','hi']) → {3:['cat','dog'], 2:['hi']}" },
              { input: "str(group_by_length(['a', 'bb', 'ccc']))", expected: "{1: ['a'], 2: ['bb'], 3: ['ccc']}", description: "все разные длины" },
              { input: "str(group_by_length([]))", expected: "{}", description: "group_by_length([]) → {}" },
            ]),
            hints: t([
              "Итерируйте по словам, используйте `len(word)` как ключ.",
              "Создавайте список при первом вхождении: `if key not in result: result[key] = []`",
            ]),
          },

          // ═══════════════════════════════════════════════════════
          // МОДУЛЬ 8: ФУНКЦИИ
          // ═══════════════════════════════════════════════════════

          {
            title: "Функции: определение и вызов",
            order: 22,
            type: "code",
            language: "python",
            xpReward: 100,
            content: `# Функции: определение и вызов

**Функция** — именованный блок кода, который можно вызвать много раз. Функции делают код **читаемым и переиспользуемым**.

## Синтаксис

\`\`\`python
def имя_функции(параметр1, параметр2):
    """Docstring: описание функции"""
    # тело функции
    return результат
\`\`\`

## Пример

\`\`\`python
def greet(name):
    """Возвращает приветствие."""
    return f"Привет, {name}!"

result = greet("Alice")  # вызов
print(result)            # Привет, Alice!
\`\`\`

## Параметры по умолчанию

\`\`\`python
def power(base, exp=2):
    return base ** exp

power(3)    # 9  (exp=2 по умолчанию)
power(3, 3) # 27
\`\`\`

## Именованные аргументы

\`\`\`python
def info(name, age, city="Москва"):
    return f"{name}, {age}, {city}"

info("Alice", 25)                    # "Alice, 25, Москва"
info(age=30, name="Bob")             # порядок не важен
info("Charlie", city="СПб", age=20)  # мешаем
\`\`\`

## Функции без return

\`\`\`python
def say_hello(name):
    print(f"Hello, {name}!")
# Неявно возвращает None
\`\`\`

---

## Задание

Напишите функцию \`clamp(value, min_val, max_val)\`, которая ограничивает значение диапазоном [min_val, max_val]:
- Если value < min_val → вернуть min_val
- Если value > max_val → вернуть max_val
- Иначе → вернуть value`,
            starterCode: `def clamp(value, min_val, max_val):
    # Ограничьте value диапазоном [min_val, max_val]
    pass`,
            solution: `def clamp(value, min_val, max_val):
    return max(min_val, min(value, max_val))`,
            tests: t([
              { input: "str(clamp(5, 0, 10))", expected: "5", description: "clamp(5, 0, 10) → 5 (в диапазоне)" },
              { input: "str(clamp(-5, 0, 10))", expected: "0", description: "clamp(-5, 0, 10) → 0 (ниже min)" },
              { input: "str(clamp(15, 0, 10))", expected: "10", description: "clamp(15, 0, 10) → 10 (выше max)" },
              { input: "str(clamp(0, 0, 10))", expected: "0", description: "clamp(0, 0, 10) → 0 (граница)" },
            ]),
            hints: t([
              "Элегантное решение: `max(min_val, min(value, max_val))`",
              "Или через if: `if value < min_val: return min_val` и т.д.",
            ]),
          },

          {
            title: "Функции: *args, **kwargs и lambda",
            order: 23,
            type: "code",
            language: "python",
            xpReward: 120,
            content: `# Функции: *args, **kwargs и lambda

## *args — произвольное число позиционных аргументов

\`\`\`python
def total(*numbers):
    return sum(numbers)

total(1, 2, 3)       # 6
total(10, 20, 30, 40) # 100
\`\`\`

## **kwargs — произвольное число именованных аргументов

\`\`\`python
def profile(**info):
    for key, val in info.items():
        print(f"{key}: {val}")

profile(name="Alice", age=25, city="Москва")
\`\`\`

## Комбинирование

\`\`\`python
def func(required, *args, **kwargs):
    print(required, args, kwargs)

func(1, 2, 3, x=10, y=20)
# 1 (2, 3) {'x': 10, 'y': 20}
\`\`\`

## Lambda — анонимные функции

\`\`\`python
square = lambda x: x ** 2
square(5)  # 25

# Полезно для sorted, map, filter:
names = ["Charlie", "Alice", "Bob"]
sorted(names, key=lambda s: len(s))  # ["Bob", "Alice", "Charlie"]

numbers = [1, -2, 3, -4]
list(filter(lambda x: x > 0, numbers))  # [1, 3]
list(map(lambda x: x * 2, [1, 2, 3]))   # [2, 4, 6]
\`\`\`

---

## Задание

Напишите функцию \`weighted_average(*pairs)\`, которая принимает пары \`(значение, вес)\` и возвращает взвешенное среднее.

Формула: \`сумма(значение × вес) / сумма(весов)\`

Пример: \`weighted_average((80, 3), (90, 2), (70, 5))\` = (80×3 + 90×2 + 70×5) / (3+2+5)`,
            starterCode: `def weighted_average(*pairs):
    # Вычислите взвешенное среднее из пар (значение, вес)
    pass`,
            solution: `def weighted_average(*pairs):
    total = sum(v * w for v, w in pairs)
    weight_sum = sum(w for _, w in pairs)
    return total / weight_sum`,
            tests: t([
              { input: "str(weighted_average((80, 3), (90, 2), (70, 5)))", expected: "77.0", description: "weighted_average((80,3),(90,2),(70,5)) → 77.0" },
              { input: "str(weighted_average((100, 1)))", expected: "100.0", description: "weighted_average((100,1)) → 100.0" },
              { input: "str(round(weighted_average((60, 1), (90, 3)), 2))", expected: "82.5", description: "weighted_average((60,1),(90,3)) → 82.5" },
            ]),
            hints: t([
              "`*pairs` — кортеж пар. Распаковывайте: `for v, w in pairs`",
              "Числитель: `sum(v * w for v, w in pairs)`, знаменатель: `sum(w for _, w in pairs)`",
            ]),
          },

          {
            title: "Область видимости: local и global",
            order: 24,
            type: "quiz",
            language: "python",
            xpReward: 80,
            content: `# Область видимости: local и global

## Что такое область видимости (scope)?

Переменные существуют только в определённой области — там, где они были созданы.

## LEGB: правило поиска имён

Python ищет переменную в таком порядке:
1. **L** — Local (локальная — внутри функции)
2. **E** — Enclosing (объемлющая — в функции-контейнере)
3. **G** — Global (глобальная — на уровне модуля)
4. **B** — Built-in (встроенная — len, print, etc.)

\`\`\`python
x = "global"  # G

def outer():
    x = "enclosing"  # E

    def inner():
        x = "local"  # L
        print(x)     # "local" — найден на уровне L

    inner()
    print(x)  # "enclosing"

outer()
print(x)  # "global"
\`\`\`

## global и nonlocal

\`\`\`python
count = 0  # глобальная

def increment():
    global count  # объявляем что используем глобальную
    count += 1

# nonlocal — для объемлющей функции:
def make_counter():
    n = 0
    def inc():
        nonlocal n
        n += 1
        return n
    return inc
\`\`\`

> **Совет**: Избегайте global. Передавайте данные через параметры и return — это надёжнее.`,
            starterCode: null,
            solution: null,
            tests: t([
              { input: "Где Python ищет переменную в первую очередь?", expected: "Local (локальная)", description: "Local (локальная),Global (глобальная),Built-in (встроенная),Enclosing (объемлющая)" },
              { input: "Что делает ключевое слово global внутри функции?", expected: "Позволяет изменять глобальную переменную", description: "Позволяет изменять глобальную переменную,Создаёт новую переменную,Удаляет переменную,Копирует переменную" },
              { input: "Что вернёт функция без explicit return?", expected: "None", description: "None,0,False,Ошибку" },
            ]),
            hints: t([
              "LEGB: Local → Enclosing → Global → Built-in — порядок поиска переменных.",
              "Функция без `return` возвращает `None` — специальный тип отсутствия значения.",
            ]),
          },

          {
            title: "Рекурсия: функции вызывают себя",
            order: 25,
            type: "code",
            language: "python",
            xpReward: 130,
            content: `# Рекурсия: функции вызывают себя

**Рекурсия** — это когда функция вызывает саму себя для решения задачи.

## Обязательные части рекурсии

1. **Базовый случай** — условие остановки (иначе бесконечный цикл!)
2. **Рекурсивный случай** — функция вызывает себя с упрощённой задачей

## Пример: факториал

\`\`\`python
def factorial(n):
    if n <= 1:      # базовый случай
        return 1
    return n * factorial(n - 1)  # рекурсивный вызов

# factorial(5) = 5 * factorial(4)
#              = 5 * 4 * factorial(3)
#              = 5 * 4 * 3 * 2 * 1
#              = 120
\`\`\`

## Пример: числа Фибоначчи

\`\`\`python
def fib(n):
    if n <= 1:
        return n
    return fib(n-1) + fib(n-2)

# fib(0)=0, fib(1)=1, fib(2)=1, fib(3)=2, fib(4)=3, fib(5)=5
\`\`\`

## Ограничения рекурсии

\`\`\`python
import sys
sys.getrecursionlimit()  # обычно 1000

# Для глубокой рекурсии лучше использовать цикл!
\`\`\`

---

## Задание

Напишите рекурсивную функцию \`power(base, exp)\`, которая вычисляет \`base ** exp\` **без использования оператора ****.

Подсказка: \`base^n = base × base^(n-1)\`, а \`base^0 = 1\``,
            starterCode: `def power(base, exp):
    # Вычислите base**exp рекурсивно (без оператора **)
    pass`,
            solution: `def power(base, exp):
    if exp == 0:
        return 1
    return base * power(base, exp - 1)`,
            tests: t([
              { input: "str(power(2, 10))", expected: "1024", description: "power(2, 10) → 1024" },
              { input: "str(power(3, 0))", expected: "1", description: "power(3, 0) → 1 (любое число в степени 0)" },
              { input: "str(power(5, 3))", expected: "125", description: "power(5, 3) → 125" },
            ]),
            hints: t([
              "Базовый случай: `if exp == 0: return 1`",
              "Рекурсивный: `return base * power(base, exp - 1)`",
            ]),
          },

          // ═══════════════════════════════════════════════════════
          // МОДУЛЬ 9: ОБРАБОТКА ОШИБОК
          // ═══════════════════════════════════════════════════════

          {
            title: "Исключения: try / except / finally",
            order: 26,
            type: "code",
            language: "python",
            xpReward: 120,
            content: `# Исключения: try / except / finally

Ошибки в программировании неизбежны. Python позволяет их **поймать и обработать**.

## Базовый синтаксис

\`\`\`python
try:
    # код который может упасть
    result = 10 / 0
except ZeroDivisionError:
    # что делать при ошибке
    result = None
    print("Деление на ноль!")
\`\`\`

## Несколько except

\`\`\`python
try:
    value = int(input_str)
    result = 100 / value
except ValueError:
    print("Не число!")
except ZeroDivisionError:
    print("Не ноль!")
except Exception as e:
    print(f"Неизвестная ошибка: {e}")
\`\`\`

## finally и else

\`\`\`python
try:
    result = int("42")
except ValueError:
    print("Ошибка")
else:
    print("Успех!")        # если не было исключения
finally:
    print("Всегда!")       # выполняется всегда
\`\`\`

## Таблица исключений

| Исключение | Причина |
|---|---|
| \`ValueError\` | Неверное значение |
| \`TypeError\` | Неверный тип |
| \`ZeroDivisionError\` | Деление на 0 |
| \`IndexError\` | Индекс за пределами |
| \`KeyError\` | Нет ключа в словаре |
| \`FileNotFoundError\` | Файл не найден |
| \`AttributeError\` | Нет атрибута |

## Своё исключение

\`\`\`python
raise ValueError("Значение должно быть положительным!")
\`\`\`

---

## Задание

Напишите функцию \`safe_get(lst, index, default=None)\`, которая безопасно возвращает элемент списка по индексу. При любой ошибке — возвращает \`default\`.`,
            starterCode: `def safe_get(lst, index, default=None):
    # Безопасный доступ к элементу списка
    pass`,
            solution: `def safe_get(lst, index, default=None):
    try:
        return lst[index]
    except (IndexError, TypeError):
        return default`,
            tests: t([
              { input: "str(safe_get([1,2,3], 1))", expected: "2", description: "safe_get([1,2,3], 1) → 2" },
              { input: "str(safe_get([1,2,3], 10))", expected: "None", description: "safe_get([1,2,3], 10) → None (IndexError)" },
              { input: "str(safe_get([1,2,3], 10, -1))", expected: "-1", description: "safe_get([1,2,3], 10, -1) → -1 (default)" },
              { input: "str(safe_get(None, 0))", expected: "None", description: "safe_get(None, 0) → None (TypeError)" },
            ]),
            hints: t([
              "Оберните `lst[index]` в `try/except (IndexError, TypeError):`",
            ]),
          },

          // ═══════════════════════════════════════════════════════
          // МОДУЛЬ 10: МОДУЛИ
          // ═══════════════════════════════════════════════════════

          {
            title: "Модуль math: математические функции",
            order: 27,
            type: "code",
            language: "python",
            xpReward: 100,
            content: `# Модуль math: математические функции

**Модуль** — файл с готовым кодом, который можно подключить.

## Импорт

\`\`\`python
import math              # весь модуль
from math import sqrt    # конкретная функция
from math import *       # всё (не рекомендуется)
import math as m         # псевдоним
\`\`\`

## Модуль math

\`\`\`python
import math

math.pi         # 3.14159...
math.e          # 2.71828...  (число Эйлера)
math.inf        # бесконечность
math.nan        # Not a Number

math.sqrt(16)   # 4.0   — квадратный корень
math.pow(2, 10) # 1024.0 — степень (возвращает float)
math.floor(3.9) # 3     — округление вниз
math.ceil(3.1)  # 4     — округление вверх
math.abs(-5)    # ← нет! используйте встроенный abs(-5) = 5
math.factorial(5) # 120 — факториал
math.log(100, 10) # 2.0  — логарифм
math.sin(math.pi / 2)  # 1.0 — синус (аргумент в радианах)
math.degrees(math.pi)  # 180.0 — радианы → градусы
math.radians(180)      # 3.14... — градусы → радианы
math.gcd(12, 8)        # 4 — наибольший общий делитель
math.isclose(0.1+0.2, 0.3, rel_tol=1e-9)  # True — сравнение float
\`\`\`

---

## Задание

Напишите функцию \`hypotenuse(a, b)\`, которая вычисляет **гипотенузу** прямоугольного треугольника по теореме Пифагора:

**c = √(a² + b²)**

Результат округлите до 4 знаков.`,
            starterCode: `import math

def hypotenuse(a, b):
    # Вычислите гипотенузу прямоугольного треугольника
    pass`,
            solution: `import math

def hypotenuse(a, b):
    return round(math.sqrt(a**2 + b**2), 4)`,
            tests: t([
              { input: "str(hypotenuse(3, 4))", expected: "5.0", description: "hypotenuse(3, 4) → 5.0 (египетский треугольник)" },
              { input: "str(hypotenuse(5, 12))", expected: "13.0", description: "hypotenuse(5, 12) → 13.0" },
              { input: "str(hypotenuse(1, 1))", expected: "1.4142", description: "hypotenuse(1, 1) → 1.4142 (√2)" },
            ]),
            hints: t([
              "Используйте `math.sqrt(a**2 + b**2)`",
              "Или `math.hypot(a, b)` — встроенная функция для этого!",
            ]),
          },

          {
            title: "Модуль random: случайные числа",
            order: 28,
            type: "code",
            language: "python",
            xpReward: 100,
            content: `# Модуль random: случайные числа

Модуль \`random\` нужен для генерации случайных чисел и выборок.

## Основные функции

\`\`\`python
import random

random.random()           # float в [0, 1)
random.uniform(1.0, 5.0)  # float в [1.0, 5.0]
random.randint(1, 10)     # int в [1, 10] включительно
random.randrange(0, 10, 2) # случайное чётное 0,2,4,6,8

# Работа с последовательностями:
random.choice([1, 2, 3, 4])          # случайный элемент
random.choices([1,2,3], weights=[5,3,2], k=3)  # k случайных (с повторами, взвешенно)
random.sample([1,2,3,4,5], 3)       # 3 уникальных элемента
random.shuffle([1,2,3,4,5])         # перемешать список на месте

# Воспроизводимость:
random.seed(42)  # фиксируем генератор (для тестов)
\`\`\`

## Практическое применение

\`\`\`python
# Симуляция броска кубика
def roll_die(sides=6):
    return random.randint(1, sides)

# Случайный пароль из букв
import string
def random_password(length=8):
    chars = string.ascii_letters + string.digits
    return ''.join(random.choices(chars, k=length))
\`\`\`

---

## Задание

Напишите функцию \`simulate_dice(n_rolls, seed=42)\`, которая симулирует \`n_rolls\` бросков шестигранного кубика и возвращает словарь с **частотой** каждого значения (1-6).`,
            starterCode: `import random

def simulate_dice(n_rolls, seed=42):
    # Симулируйте n_rolls бросков кубика, верните {1:count, 2:count, ...}
    pass`,
            solution: `import random

def simulate_dice(n_rolls, seed=42):
    random.seed(seed)
    result = {i: 0 for i in range(1, 7)}
    for _ in range(n_rolls):
        roll = random.randint(1, 6)
        result[roll] += 1
    return result`,
            tests: t([
              { input: "str(sum(simulate_dice(100).values()))", expected: "100", description: "Сумма всех бросков = 100" },
              { input: "str(len(simulate_dice(100)))", expected: "6", description: "6 значений кубика" },
              { input: "str(all(v >= 0 for v in simulate_dice(60).values()))", expected: "True", description: "Все значения неотрицательны" },
            ]),
            hints: t([
              "Инициализируйте словарь: `{i: 0 for i in range(1, 7)}`",
              "Используйте `random.seed(seed)` для воспроизводимости.",
            ]),
          },

          {
            title: "Модуль collections: мощные структуры",
            order: 29,
            type: "code",
            language: "python",
            xpReward: 120,
            content: `# Модуль collections: мощные структуры данных

\`collections\` — стандартная библиотека с расширенными структурами данных.

## Counter — подсчёт элементов

\`\`\`python
from collections import Counter

words = ["apple", "banana", "apple", "cherry", "banana", "apple"]
count = Counter(words)
# Counter({'apple': 3, 'banana': 2, 'cherry': 1})

count.most_common(2)   # [('apple', 3), ('banana', 2)]
count["apple"]         # 3
count["missing"]       # 0 (не KeyError!)
count + Counter(["apple"])  # можно складывать
\`\`\`

## defaultdict — словарь с default-значением

\`\`\`python
from collections import defaultdict

groups = defaultdict(list)
for name, group in [("Alice", "A"), ("Bob", "B"), ("Charlie", "A")]:
    groups[group].append(name)
# {'A': ['Alice', 'Charlie'], 'B': ['Bob']}
\`\`\`

## deque — двусторонняя очередь

\`\`\`python
from collections import deque

d = deque([1, 2, 3])
d.appendleft(0)   # deque([0, 1, 2, 3])
d.append(4)       # deque([0, 1, 2, 3, 4])
d.popleft()       # 0
d.rotate(1)       # [4, 1, 2, 3] — сдвиг вправо
\`\`\`

## namedtuple — именованный кортеж

\`\`\`python
from collections import namedtuple

Point = namedtuple("Point", ["x", "y"])
p = Point(3, 4)
p.x   # 3
p.y   # 4
\`\`\`

---

## Задание

Напишите функцию \`top_words(text, n=3)\`, которая возвращает список **n самых частых слов** в тексте (без учёта регистра). Возвращайте список пар \`[(слово, count), ...]\`.`,
            starterCode: `from collections import Counter

def top_words(text, n=3):
    # Верните n самых частых слов из текста
    pass`,
            solution: `from collections import Counter

def top_words(text, n=3):
    words = text.lower().split()
    counter = Counter(words)
    return counter.most_common(n)`,
            tests: t([
              { input: "str(top_words('the quick brown fox jumps over the lazy dog the', 2))", expected: "[('the', 3), ('quick', 1)]", description: "top_words(..., 2) → [('the',3), ('quick',1)]" },
              { input: "str(top_words('a b a b a', 1))", expected: "[('a', 3)]", description: "top_words('a b a b a', 1) → [('a', 3)]" },
            ]),
            hints: t([
              "`Counter(words).most_common(n)` возвращает n самых частых элементов.",
              "Сначала разбейте строку: `text.lower().split()`",
            ]),
          },

          // ═══════════════════════════════════════════════════════
          // МОДУЛЬ 11: ООП — ОБЪЕКТНО-ОРИЕНТИРОВАННОЕ ПРОГРАММИРОВАНИЕ
          // ═══════════════════════════════════════════════════════

          {
            title: "ООП: Классы и объекты",
            order: 31,
            type: "code",
            language: "python",
            xpReward: 80,
            content: `# ООП: Классы и объекты

## Что такое класс?

**Класс** — шаблон для создания объектов. Как чертёж дома: по одному чертежу строят много домов.
**Объект** — конкретный экземпляр класса.

\`\`\`python
class Dog:
    def __init__(self, name, age):
        self.name = name   # атрибут объекта
        self.age = age

    def bark(self):
        return f"{self.name} говорит: Гав!"

rex = Dog("Rex", 3)
print(rex.bark())   # Rex говорит: Гав!
print(rex.age)      # 3
\`\`\`

## Ключевые понятия

- **\`__init__\`** — конструктор, вызывается при создании объекта
- **\`self\`** — ссылка на сам объект
- **Атрибут** — переменная объекта: \`self.name\`
- **Метод** — функция внутри класса`,
            starterCode: `class Dog:
    def __init__(self, name, age):
        # Сохрани name и age как атрибуты
        pass

    def bark(self):
        # Вернуть строку: "{name} говорит: Гав!"
        pass

    def is_puppy(self):
        # Вернуть True если age < 2, иначе False
        pass`,
            solution: `class Dog:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def bark(self):
        return f"{self.name} говорит: Гав!"

    def is_puppy(self):
        return self.age < 2`,
            tests: t([
              { input: "str(Dog('Rex', 3).bark())", expected: "Rex говорит: Гав!", description: "bark() → строка с именем" },
              { input: "str(Dog('Buddy', 5).age)", expected: "5", description: "Атрибут age сохраняется" },
              { input: "str(Dog('Puppy', 1).is_puppy())", expected: "True", description: "is_puppy() → True если age < 2" },
              { input: "str(Dog('Old', 3).is_puppy())", expected: "False", description: "is_puppy() → False если age >= 2" },
            ]),
            hints: t([
              "В __init__ используй self.name = name для сохранения атрибута.",
              "В методах обращайся к атрибутам через self: f\"{self.name} говорит: Гав!\"",
            ]),
          },

          {
            title: "ООП: Атрибуты класса и методы",
            order: 32,
            type: "code",
            language: "python",
            xpReward: 80,
            content: `# ООП: Атрибуты класса и методы

## Два вида атрибутов

\`\`\`python
class Circle:
    PI = 3.14159  # атрибут КЛАССА — общий для всех объектов

    def __init__(self, radius):
        self.radius = radius  # атрибут ЭКЗЕМПЛЯРА — свой у каждого

    def area(self):
        return round(Circle.PI * self.radius ** 2, 2)

    def perimeter(self):
        return round(2 * Circle.PI * self.radius, 2)
\`\`\`

**Атрибут класса** (\`PI\`) — одно значение для всего класса.
**Атрибут экземпляра** (\`radius\`) — у каждого объекта свой.

\`\`\`python
c1 = Circle(5)
c2 = Circle(10)
print(c1.area())   # 78.54
print(c2.area())   # 314.16
print(Circle.PI)   # 3.14159
\`\`\``,
            starterCode: `class Circle:
    PI = 3.14159

    def __init__(self, radius):
        # Сохрани radius как атрибут экземпляра
        pass

    def area(self):
        # PI * radius^2, округлить до 2 знаков после запятой
        pass

    def perimeter(self):
        # 2 * PI * radius, округлить до 2 знаков
        pass`,
            solution: `class Circle:
    PI = 3.14159

    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return round(Circle.PI * self.radius ** 2, 2)

    def perimeter(self):
        return round(2 * Circle.PI * self.radius, 2)`,
            tests: t([
              { input: "str(Circle(5).area())", expected: "78.54", description: "area(5) → 78.54" },
              { input: "str(Circle(1).perimeter())", expected: "6.28", description: "perimeter(1) → 6.28" },
              { input: "str(Circle(10).area())", expected: "314.16", description: "area(10) → 314.16" },
            ]),
            hints: t([
              "Обращайся к атрибуту класса через Circle.PI.",
              "round(value, 2) округляет до 2 знаков после запятой.",
            ]),
          },

          {
            title: "ООП: Наследование",
            order: 33,
            type: "code",
            language: "python",
            xpReward: 90,
            content: `# ООП: Наследование

Наследование позволяет создать новый класс на основе существующего — получить все его методы и атрибуты.

\`\`\`python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return "..."

class Cat(Animal):        # Cat наследует Animal
    def speak(self):      # переопределяем метод
        return f"{self.name} говорит: Мяу!"

class Dog(Animal):
    def speak(self):
        return f"{self.name} говорит: Гав!"
\`\`\`

## super() — вызов родителя

\`\`\`python
class PoliceDog(Dog):
    def __init__(self, name, badge):
        super().__init__(name)  # вызываем __init__ родителя
        self.badge = badge
\`\`\`

\`isinstance(obj, Class)\` — True если obj является экземпляром Class.`,
            starterCode: `class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return "..."

class Cat(Animal):
    def speak(self):
        # Вернуть: "{name} говорит: Мяу!"
        pass

class Dog(Animal):
    def speak(self):
        # Вернуть: "{name} говорит: Гав!"
        pass

class PoliceDog(Dog):
    def __init__(self, name, badge):
        # Вызвать super().__init__(name) и сохранить badge
        pass

    def speak(self):
        # Вернуть: "{name} (значок {badge}) говорит: Гав!"
        pass`,
            solution: `class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return "..."

class Cat(Animal):
    def speak(self):
        return f"{self.name} говорит: Мяу!"

class Dog(Animal):
    def speak(self):
        return f"{self.name} говорит: Гав!"

class PoliceDog(Dog):
    def __init__(self, name, badge):
        super().__init__(name)
        self.badge = badge

    def speak(self):
        return f"{self.name} (значок {self.badge}) говорит: Гав!"`,
            tests: t([
              { input: "str(Cat('Мурка').speak())", expected: "Мурка говорит: Мяу!", description: "Cat.speak()" },
              { input: "str(Dog('Рекс').speak())", expected: "Рекс говорит: Гав!", description: "Dog.speak()" },
              { input: "str(isinstance(Cat('X'), Animal))", expected: "True", description: "Cat является подтипом Animal" },
              { input: "str(PoliceDog('Рекс', 42).speak())", expected: "Рекс (значок 42) говорит: Гав!", description: "PoliceDog.speak()" },
            ]),
            hints: t([
              "class Cat(Animal): — так объявляется наследование.",
              "super().__init__(name) вызывает конструктор родительского класса.",
            ]),
          },

          {
            title: "ООП: Инкапсуляция и @property",
            order: 34,
            type: "code",
            language: "python",
            xpReward: 90,
            content: `# ООП: Инкапсуляция и @property

**Инкапсуляция** — скрытие внутренних данных объекта, защита от некорректного изменения.

\`\`\`python
class BankAccount:
    def __init__(self, balance):
        self._balance = balance  # _ = "приватный" (соглашение)

    @property
    def balance(self):           # геттер
        return self._balance

    @balance.setter
    def balance(self, value):    # сеттер с проверкой
        if value >= 0:
            self._balance = value

acc = BankAccount(100)
print(acc.balance)   # 100 — читаем через @property
acc.balance = 200    # устанавливаем через setter
\`\`\`

**Зачем?** Нельзя случайно поставить отрицательный баланс.`,
            starterCode: `class BankAccount:
    def __init__(self, balance):
        self._balance = balance

    @property
    def balance(self):
        # Вернуть _balance
        pass

    def deposit(self, amount):
        # Прибавить amount к балансу, вернуть self
        pass

    def withdraw(self, amount):
        # Если amount <= _balance → вычесть, вернуть True
        # Иначе вернуть False
        pass`,
            solution: `class BankAccount:
    def __init__(self, balance):
        self._balance = balance

    @property
    def balance(self):
        return self._balance

    def deposit(self, amount):
        self._balance += amount
        return self

    def withdraw(self, amount):
        if amount <= self._balance:
            self._balance -= amount
            return True
        return False`,
            tests: t([
              { input: "str(BankAccount(100).balance)", expected: "100", description: "@property balance возвращает значение" },
              { input: "str(BankAccount(100).deposit(50).balance)", expected: "150", description: "deposit(50) увеличивает баланс" },
              { input: "str(BankAccount(100).withdraw(30))", expected: "True", description: "withdraw при достаточном балансе → True" },
              { input: "str(BankAccount(100).withdraw(200))", expected: "False", description: "withdraw при недостатке → False" },
            ]),
            hints: t([
              "@property превращает метод в атрибут: acc.balance (без скобок).",
              "Возврат self позволяет цепочку вызовов: acc.deposit(50).deposit(30).",
            ]),
          },

          {
            title: "ООП: Магические методы",
            order: 35,
            type: "code",
            language: "python",
            xpReward: 90,
            content: `# ООП: Магические методы

Магические методы (dunder) начинаются с __ и определяют поведение объекта.

| Метод | Когда вызывается |
|-------|-----------------|
| \`__str__\` | \`str(obj)\`, \`print(obj)\` |
| \`__add__\` | \`a + b\` |
| \`__eq__\` | \`a == b\` |
| \`__len__\` | \`len(obj)\` |

\`\`\`python
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):
        return f"Vector({self.x}, {self.y})"

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

v1 = Vector(1, 2)
v2 = Vector(3, 4)
print(str(v1))       # Vector(1, 2)
print(str(v1 + v2))  # Vector(4, 6)
\`\`\``,
            starterCode: `class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):
        # Вернуть: "Vector(x, y)"
        pass

    def __add__(self, other):
        # Вернуть новый Vector с суммой координат
        pass

    def __eq__(self, other):
        # True если x и y равны у обоих векторов
        pass`,
            solution: `class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):
        return f"Vector({self.x}, {self.y})"

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y`,
            tests: t([
              { input: "str(Vector(1, 2))", expected: "Vector(1, 2)", description: "__str__ → 'Vector(1, 2)'" },
              { input: "str(Vector(1, 2) + Vector(3, 4))", expected: "Vector(4, 6)", description: "__add__ складывает координаты" },
              { input: "str(Vector(1, 2) == Vector(1, 2))", expected: "True", description: "__eq__ → True при одинаковых координатах" },
              { input: "str(Vector(1, 2) == Vector(1, 3))", expected: "False", description: "__eq__ → False при разных" },
            ]),
            hints: t([
              "__str__ должен вернуть строку: f\"Vector({self.x}, {self.y})\"",
              "__add__ должен вернуть НОВЫЙ объект Vector: Vector(self.x + other.x, self.y + other.y)",
            ]),
          },

          {
            title: "ООП: Полиморфизм",
            order: 36,
            type: "code",
            language: "python",
            xpReward: 90,
            content: `# ООП: Полиморфизм

**Полиморфизм** — один интерфейс, разные реализации.

\`\`\`python
class Shape:
    def area(self):
        return 0

class Rectangle(Shape):
    def __init__(self, w, h):
        self.w, self.h = w, h
    def area(self):
        return self.w * self.h

class Circle(Shape):
    def __init__(self, r):
        self.r = r
    def area(self):
        return round(3.14159 * self.r ** 2, 2)

# Полиморфизм: один код работает с любой фигурой
shapes = [Rectangle(4, 5), Circle(3)]
for s in shapes:
    print(s.area())   # вызывается нужный area()
\`\`\`

Функция \`total_area\` не знает тип фигуры — просто вызывает \`.area()\`.`,
            starterCode: `class Shape:
    def area(self):
        return 0

class Rectangle(Shape):
    def __init__(self, width, height):
        pass
    def area(self):
        # ширина * высота
        pass

class Triangle(Shape):
    def __init__(self, base, height):
        pass
    def area(self):
        # 0.5 * основание * высота
        pass

def total_area(shapes):
    # Вернуть сумму area() всех фигур в списке
    pass`,
            solution: `class Shape:
    def area(self):
        return 0

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height
    def area(self):
        return self.width * self.height

class Triangle(Shape):
    def __init__(self, base, height):
        self.base = base
        self.height = height
    def area(self):
        return 0.5 * self.base * self.height

def total_area(shapes):
    return sum(s.area() for s in shapes)`,
            tests: t([
              { input: "str(Rectangle(4, 5).area())", expected: "20", description: "Rectangle(4,5).area() → 20" },
              { input: "str(Triangle(6, 4).area())", expected: "12.0", description: "Triangle(6,4).area() → 12.0" },
              { input: "str(total_area([Rectangle(2, 3), Triangle(4, 2)]))", expected: "10.0", description: "total_area → 10.0" },
            ]),
            hints: t([
              "В __init__ сохраняй параметры: self.width = width, self.height = height.",
              "sum(s.area() for s in shapes) — генераторное выражение для суммы.",
            ]),
          },

          // ═══════════════════════════════════════════════════════
          // МОДУЛЬ 12: ФАЙЛЫ, CSV, JSON
          // ═══════════════════════════════════════════════════════

          {
            title: "Файлы: открытие, чтение, запись",
            order: 37,
            type: "code",
            language: "python",
            xpReward: 80,
            content: `# Файлы: открытие, чтение, запись

## Работа с файлами

\`\`\`python
# Запись в файл
with open('notes.txt', 'w') as f:
    f.write("Строка 1\\n")
    f.write("Строка 2\\n")

# Чтение всего файла
with open('notes.txt', 'r') as f:
    content = f.read()

# Чтение построчно
with open('notes.txt', 'r') as f:
    for line in f:
        print(line.strip())
\`\`\`

## Режимы открытия

| Режим | Описание |
|-------|----------|
| \`'r'\` | чтение (по умолчанию) |
| \`'w'\` | запись (перезаписывает) |
| \`'a'\` | добавление в конец |

## Конструкция with

\`with open(...) as f:\` — файл закрывается автоматически, даже при ошибке.

В этом уроке мы практикуемся с \`io.StringIO\` — это файл в памяти, который работает точно так же как обычный файл.`,
            starterCode: `import io

def count_lines(content):
    """Подсчитать количество строк в тексте"""
    f = io.StringIO(content)
    # Прочитать все строки и вернуть их количество
    pass

def get_first_line(content):
    """Вернуть первую строку текста (без \\n)"""
    f = io.StringIO(content)
    # Прочитать и вернуть первую строку
    pass

def get_long_lines(content, min_length):
    """Вернуть список строк длиннее min_length символов (без \\n)"""
    f = io.StringIO(content)
    # Вернуть только длинные строки
    pass`,
            solution: `import io

def count_lines(content):
    f = io.StringIO(content)
    return len(f.readlines())

def get_first_line(content):
    f = io.StringIO(content)
    return f.readline().rstrip('\\n')

def get_long_lines(content, min_length):
    f = io.StringIO(content)
    return [line.rstrip('\\n') for line in f if len(line.rstrip('\\n')) > min_length]`,
            tests: t([
              { input: "str(count_lines('line1\\nline2\\nline3\\n'))", expected: "3", description: "count_lines → 3" },
              { input: "str(get_first_line('Hello\\nWorld'))", expected: "Hello", description: "get_first_line → 'Hello'" },
              { input: "str(get_long_lines('hi\\nhello\\nyo', 3))", expected: "['hello']", description: "get_long_lines(>3) → ['hello']" },
            ]),
            hints: t([
              "f.readlines() возвращает список всех строк включая \\n.",
              "f.readline() читает одну строку. .rstrip('\\n') убирает символ переноса.",
            ]),
          },

          {
            title: "Модуль csv: таблицы и данные",
            order: 38,
            type: "code",
            language: "python",
            xpReward: 80,
            content: `# Модуль csv: таблицы и данные

CSV (Comma-Separated Values) — формат таблиц в текстовом виде. Открывается в Excel.

\`\`\`python
import csv, io

# Чтение CSV
text = "name,age,city\\nAlice,30,Moscow\\nBob,25,SPb"
reader = csv.reader(io.StringIO(text))
for row in reader:
    print(row)  # ['name', 'age', 'city'], ['Alice', '30', 'Moscow'], ...

# Чтение в словари
reader = csv.DictReader(io.StringIO(text))
for row in reader:
    print(row['name'], row['age'])  # Alice 30
\`\`\`

\`\`\`python
# Запись CSV
output = io.StringIO()
writer = csv.writer(output)
writer.writerow(['name', 'score'])
writer.writerow(['Alice', 95])
print(output.getvalue())  # name,score\\r\\nAlice,95\\r\\n
\`\`\``,
            starterCode: `import csv, io

def parse_csv(text):
    """Распарсить CSV текст, вернуть список списков"""
    pass

def get_column(text, column_name):
    """Вернуть список значений указанной колонки (без заголовка)"""
    pass

def csv_row_count(text):
    """Вернуть количество строк данных (без заголовка)"""
    pass`,
            solution: `import csv, io

def parse_csv(text):
    reader = csv.reader(io.StringIO(text))
    return list(reader)

def get_column(text, column_name):
    reader = csv.DictReader(io.StringIO(text))
    return [row[column_name] for row in reader]

def csv_row_count(text):
    reader = csv.DictReader(io.StringIO(text))
    return sum(1 for _ in reader)`,
            tests: t([
              { input: "str(parse_csv('a,b\\n1,2\\n3,4')[0])", expected: "['a', 'b']", description: "Первая строка — заголовок" },
              { input: "str(get_column('name,age\\nAlice,30\\nBob,25', 'name'))", expected: "['Alice', 'Bob']", description: "get_column('name') → ['Alice', 'Bob']" },
              { input: "str(csv_row_count('x,y\\n1,2\\n3,4\\n5,6'))", expected: "3", description: "csv_row_count → 3 (без заголовка)" },
            ]),
            hints: t([
              "csv.reader возвращает итератор — оберни в list() для получения всех строк.",
              "csv.DictReader читает первую строку как заголовки и возвращает словари.",
            ]),
          },

          {
            title: "Модуль json: сериализация данных",
            order: 39,
            type: "code",
            language: "python",
            xpReward: 80,
            content: `# Модуль json: сериализация данных

JSON (JavaScript Object Notation) — самый популярный формат обмена данными в интернете.

\`\`\`python
import json

# Python → JSON строка
data = {"name": "Alice", "age": 30, "active": True}
text = json.dumps(data)
print(text)  # {"name": "Alice", "age": 30, "active": true}

# JSON строка → Python
parsed = json.loads(text)
print(parsed["name"])  # Alice
print(type(parsed))    # <class 'dict'>
\`\`\`

## Типы данных

| Python | JSON |
|--------|------|
| dict | object \`{}\` |
| list | array \`[]\` |
| str | string |
| int/float | number |
| True/False | true/false |
| None | null |`,
            starterCode: `import json

def to_json(data):
    """Конвертировать Python объект в JSON строку"""
    pass

def from_json(text):
    """Конвертировать JSON строку в Python объект"""
    pass

def get_value(json_text, key):
    """Извлечь значение по ключу из JSON строки"""
    pass`,
            solution: `import json

def to_json(data):
    return json.dumps(data, ensure_ascii=False)

def from_json(text):
    return json.loads(text)

def get_value(json_text, key):
    return json.loads(json_text)[key]`,
            tests: t([
              { input: "str(from_json('{\"a\": 1, \"b\": 2}')[\"a\"])", expected: "1", description: "from_json → парсит в словарь" },
              { input: "str(type(from_json('[1, 2, 3]')).__name__)", expected: "list", description: "JSON массив → Python list" },
              { input: "str(get_value('{\"score\": 99}', 'score'))", expected: "99", description: "get_value извлекает по ключу" },
            ]),
            hints: t([
              "json.dumps(data) → строка JSON. json.loads(text) → Python объект.",
              "После json.loads ты получаешь обычный Python dict, list, и т.д.",
            ]),
          },

          // ═══════════════════════════════════════════════════════
          // МОДУЛЬ 13: ФУНКЦИОНАЛЬНЫЙ PYTHON
          // ═══════════════════════════════════════════════════════

          {
            title: "map(), filter(), zip()",
            order: 40,
            type: "code",
            language: "python",
            xpReward: 80,
            content: `# map(), filter(), zip()

Встроенные функции высшего порядка — принимают другую функцию как аргумент.

## map() — применить функцию к каждому элементу

\`\`\`python
numbers = [1, 2, 3, 4]
squares = list(map(lambda x: x**2, numbers))
print(squares)  # [1, 4, 9, 16]
\`\`\`

## filter() — оставить только подходящие элементы

\`\`\`python
numbers = [1, 2, 3, 4, 5, 6]
evens = list(filter(lambda x: x % 2 == 0, numbers))
print(evens)  # [2, 4, 6]
\`\`\`

## zip() — объединить два списка в пары

\`\`\`python
names = ["Alice", "Bob"]
scores = [95, 87]
pairs = list(zip(names, scores))
print(pairs)  # [('Alice', 95), ('Bob', 87)]
\`\`\``,
            starterCode: `def square_all(numbers):
    """Вернуть список квадратов всех чисел — используй map()"""
    pass

def only_positive(numbers):
    """Вернуть только положительные числа — используй filter()"""
    pass

def combine(keys, values):
    """Объединить два списка в список кортежей — используй zip()"""
    pass`,
            solution: `def square_all(numbers):
    return list(map(lambda x: x**2, numbers))

def only_positive(numbers):
    return list(filter(lambda x: x > 0, numbers))

def combine(keys, values):
    return list(zip(keys, values))`,
            tests: t([
              { input: "str(square_all([1, 2, 3, 4]))", expected: "[1, 4, 9, 16]", description: "square_all → [1, 4, 9, 16]" },
              { input: "str(only_positive([-1, 2, -3, 4, 0]))", expected: "[2, 4]", description: "only_positive → [2, 4]" },
              { input: "str(combine(['a', 'b', 'c'], [1, 2, 3]))", expected: "[('a', 1), ('b', 2), ('c', 3)]", description: "combine → список кортежей" },
            ]),
            hints: t([
              "map(func, list) — применяет func к каждому элементу. Оберни в list().",
              "filter(func, list) — оставляет элементы, для которых func возвращает True.",
            ]),
          },

          {
            title: "enumerate(), sorted() с key, any(), all()",
            order: 41,
            type: "code",
            language: "python",
            xpReward: 80,
            content: `# enumerate(), sorted() с key, any(), all()

## enumerate() — индекс + значение

\`\`\`python
fruits = ["apple", "banana", "cherry"]
for i, fruit in enumerate(fruits):
    print(f"{i}: {fruit}")  # 0: apple, 1: banana, ...
\`\`\`

## sorted() с ключом сортировки

\`\`\`python
words = ["banana", "apple", "fig"]
by_length = sorted(words, key=len)
print(by_length)  # ['fig', 'apple', 'banana']

# Сортировка в обратном порядке:
by_length_desc = sorted(words, key=len, reverse=True)
\`\`\`

## any() и all()

\`\`\`python
numbers = [1, 2, 3, -1]
print(all(x > 0 for x in numbers))  # False (есть -1)
print(any(x < 0 for x in numbers))  # True (есть -1)
\`\`\``,
            starterCode: `def indexed_list(items):
    """Вернуть список строк вида '0: item', '1: item', ..."""
    pass

def sort_by_length(words):
    """Отсортировать слова по длине (от короткого к длинному)"""
    pass

def has_negative(numbers):
    """True если хотя бы одно число отрицательное"""
    pass

def all_even(numbers):
    """True если все числа чётные"""
    pass`,
            solution: `def indexed_list(items):
    return [f"{i}: {item}" for i, item in enumerate(items)]

def sort_by_length(words):
    return sorted(words, key=len)

def has_negative(numbers):
    return any(x < 0 for x in numbers)

def all_even(numbers):
    return all(x % 2 == 0 for x in numbers)`,
            tests: t([
              { input: "str(indexed_list(['a', 'b', 'c']))", expected: "['0: a', '1: b', '2: c']", description: "indexed_list → ['0: a', ...]" },
              { input: "str(sort_by_length(['banana', 'apple', 'fig']))", expected: "['fig', 'apple', 'banana']", description: "sort_by_length → по длине" },
              { input: "str(has_negative([1, -2, 3]))", expected: "True", description: "has_negative → True" },
              { input: "str(all_even([2, 4, 6]))", expected: "True", description: "all_even([2,4,6]) → True" },
            ]),
            hints: t([
              "enumerate(items) возвращает пары (индекс, значение) — распакуй: for i, item in enumerate(items)",
              "sorted(words, key=len) сортирует по длине строки.",
            ]),
          },

          // ═══════════════════════════════════════════════════════
          // МОДУЛЬ 14: ГЕНЕРАТОРЫ
          // ═══════════════════════════════════════════════════════

          {
            title: "Генераторы и yield",
            order: 42,
            type: "code",
            language: "python",
            xpReward: 90,
            content: `# Генераторы и yield

**Генератор** — функция, которая возвращает значения по одному, не создавая весь список сразу. Экономит память.

\`\`\`python
def countdown(n):
    while n > 0:
        yield n   # "вернуть и поставить на паузу"
        n -= 1

for x in countdown(3):
    print(x)  # 3, 2, 1
\`\`\`

## Генераторные выражения

\`\`\`python
# Обычный список — всё в памяти сразу:
squares_list = [x**2 for x in range(1000000)]

# Генератор — вычисляет по одному:
squares_gen = (x**2 for x in range(1000000))
print(next(squares_gen))  # 0
print(next(squares_gen))  # 1
\`\`\`

Ключевое слово \`yield\` превращает функцию в генератор.`,
            starterCode: `def countdown(n):
    """Генератор чисел от n до 1"""
    pass

def fibonacci(limit):
    """Генератор чисел Фибоначчи, не превышающих limit"""
    pass

def even_numbers(start, end):
    """Генератор чётных чисел в диапазоне [start, end]"""
    pass`,
            solution: `def countdown(n):
    while n > 0:
        yield n
        n -= 1

def fibonacci(limit):
    a, b = 0, 1
    while a <= limit:
        yield a
        a, b = b, a + b

def even_numbers(start, end):
    for n in range(start, end + 1):
        if n % 2 == 0:
            yield n`,
            tests: t([
              { input: "str(list(countdown(5)))", expected: "[5, 4, 3, 2, 1]", description: "countdown(5) → [5,4,3,2,1]" },
              { input: "str(list(fibonacci(20)))", expected: "[0, 1, 1, 2, 3, 5, 8, 13]", description: "fibonacci(20) → [0,1,1,2,3,5,8,13]" },
              { input: "str(list(even_numbers(1, 8)))", expected: "[2, 4, 6, 8]", description: "even_numbers(1,8) → [2,4,6,8]" },
            ]),
            hints: t([
              "yield возвращает значение и приостанавливает функцию до следующего вызова.",
              "list(generator) — собирает все значения генератора в список.",
            ]),
          },

          // ═══════════════════════════════════════════════════════
          // МОДУЛЬ 15: DATETIME
          // ═══════════════════════════════════════════════════════

          {
            title: "Модуль datetime: даты и время",
            order: 43,
            type: "code",
            language: "python",
            xpReward: 80,
            content: `# Модуль datetime: даты и время

\`\`\`python
from datetime import date, datetime, timedelta

# Создание дат
today = date.today()
birthday = date(1995, 6, 15)

# Форматирование
print(birthday.strftime("%d.%m.%Y"))  # 15.06.1995
print(birthday.strftime("%Y-%m-%d"))  # 1995-06-15

# Разница между датами
delta = date.today() - birthday
print(delta.days)  # количество дней

# Арифметика дат
in_week = date.today() + timedelta(days=7)
\`\`\`

## Коды форматирования

| Код | Значение |
|-----|----------|
| \`%d\` | день (01-31) |
| \`%m\` | месяц (01-12) |
| \`%Y\` | год (2024) |
| \`%H:%M\` | часы:минуты |`,
            starterCode: `from datetime import date, timedelta

def format_date(d):
    """Форматировать date объект как строку ДД.ММ.ГГГГ"""
    pass

def days_between(date1, date2):
    """Количество дней между двумя датами (абсолютное значение)"""
    pass

def add_days(d, n):
    """Вернуть дату через n дней от d"""
    pass`,
            solution: `from datetime import date, timedelta

def format_date(d):
    return d.strftime("%d.%m.%Y")

def days_between(date1, date2):
    return abs((date2 - date1).days)

def add_days(d, n):
    return d + timedelta(days=n)`,
            tests: t([
              { input: "str(format_date(date(2024, 3, 15)))", expected: "15.03.2024", description: "format_date → '15.03.2024'" },
              { input: "str(days_between(date(2024, 1, 1), date(2024, 1, 11)))", expected: "10", description: "days_between → 10" },
              { input: "str(add_days(date(2024, 1, 25), 7))", expected: "2024-02-01", description: "add_days(25 jan, 7) → 2024-02-01" },
            ]),
            hints: t([
              "d.strftime('%d.%m.%Y') форматирует дату: %d=день, %m=месяц, %Y=год.",
              "(date2 - date1).days возвращает разницу в днях (может быть отрицательной, используй abs()).",
            ]),
          },

          // ═══════════════════════════════════════════════════════
          // МОДУЛЬ 16: OS И PATHLIB
          // ═══════════════════════════════════════════════════════

          {
            title: "Модули os и pathlib: файловая система",
            order: 44,
            type: "quiz",
            language: "python",
            xpReward: 60,
            content: `# Модули os и pathlib: файловая система

Модули \`os\` и \`pathlib\` позволяют работать с файловой системой.

## os — классический подход

\`\`\`python
import os

os.getcwd()           # текущая директория
os.listdir('.')       # список файлов в папке
os.mkdir('new_dir')   # создать папку
os.path.exists('file.txt')  # проверить существование
os.path.join('folder', 'file.txt')  # соединить части пути
\`\`\`

## pathlib — современный подход (Python 3.4+)

\`\`\`python
from pathlib import Path

p = Path('/home/user/docs/report.txt')

print(p.name)      # report.txt
print(p.stem)      # report (без расширения)
print(p.suffix)    # .txt
print(p.parent)    # /home/user/docs
print(p.exists())  # True/False

# Создание пути
new_path = Path('folder') / 'subfolder' / 'file.txt'
\`\`\`

> **Рекомендация:** используй \`pathlib\` — он работает одинаково на Windows, Mac и Linux.`,
            starterCode: null,
            solution: null,
            tests: t([
              { input: "Какая функция os возвращает текущую директорию?", expected: "os.getcwd()", description: "os.getcwd(),os.pwd(),os.dir(),os.current()" },
              { input: "Что вернёт Path('/home/user/file.txt').suffix?", expected: ".txt", description: ".txt,txt,file,file.txt" },
              { input: "Как соединить части пути в pathlib?", expected: "Path('a') / 'b' / 'c'", description: "Path('a') / 'b' / 'c',Path.join('a','b','c'),os.join('a','b'),path.concat('a','b','c')" },
              { input: "Что такое p.stem для Path('report.txt')?", expected: "report", description: "report,report.txt,.txt,txt" },
            ]),
            hints: t([
              "os.getcwd() — get current working directory (текущая рабочая директория).",
              "pathlib.Path поддерживает оператор / для соединения частей пути: Path('dir') / 'file.txt'",
            ]),
          },

          // ═══════════════════════════════════════════════════════
          // МОДУЛЬ 17: ДЕКОРАТОРЫ
          // ═══════════════════════════════════════════════════════

          {
            title: "Декораторы: основы",
            order: 45,
            type: "code",
            language: "python",
            xpReward: 100,
            content: `# Декораторы: основы

**Декоратор** — функция, которая обёртывает другую функцию, добавляя поведение.

\`\`\`python
def my_decorator(func):
    def wrapper(*args, **kwargs):
        print("До вызова")
        result = func(*args, **kwargs)
        print("После вызова")
        return result
    return wrapper

@my_decorator
def say_hello():
    print("Привет!")

say_hello()
# До вызова
# Привет!
# После вызова
\`\`\`

\`@my_decorator\` — это сокращение для \`say_hello = my_decorator(say_hello)\`.

## Применения декораторов

- Логирование вызовов
- Измерение времени выполнения
- Проверка прав доступа
- Кэширование результатов`,
            starterCode: `def uppercase(func):
    """Декоратор: переводит результат функции в верхний регистр"""
    def wrapper(*args, **kwargs):
        # Вызвать func, результат перевести в .upper() и вернуть
        pass
    return wrapper

def add_exclamation(func):
    """Декоратор: добавляет '!' в конец результата"""
    def wrapper(*args, **kwargs):
        pass
    return wrapper

@uppercase
def greet(name):
    return f"hello, {name}"

@add_exclamation
def farewell(name):
    return f"goodbye, {name}"`,
            solution: `def uppercase(func):
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        return result.upper()
    return wrapper

def add_exclamation(func):
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        return result + "!"
    return wrapper

@uppercase
def greet(name):
    return f"hello, {name}"

@add_exclamation
def farewell(name):
    return f"goodbye, {name}"`,
            tests: t([
              { input: "str(greet('alice'))", expected: "HELLO, ALICE", description: "@uppercase → верхний регистр" },
              { input: "str(farewell('bob'))", expected: "goodbye, bob!", description: "@add_exclamation → добавляет '!'" },
              { input: "str(uppercase(lambda: 'test')())", expected: "TEST", description: "uppercase как функция" },
            ]),
            hints: t([
              "Внутри wrapper: result = func(*args, **kwargs), затем return result.upper()",
              "*args, **kwargs в wrapper позволяют принимать любые аргументы.",
            ]),
          },

          {
            title: "Декораторы с аргументами",
            order: 46,
            type: "code",
            language: "python",
            xpReward: 100,
            content: `# Декораторы с аргументами

Декоратор может сам принимать аргументы — тогда нужен ещё один уровень вложенности.

\`\`\`python
def repeat(times):       # 1-й уровень: аргумент декоратора
    def decorator(func): # 2-й уровень: принимает функцию
        def wrapper(*args, **kwargs):  # 3-й уровень: обёртка
            for _ in range(times):
                func(*args, **kwargs)
        return wrapper
    return decorator

@repeat(3)
def hello():
    print("Привет!")

hello()  # Привет! Привет! Привет!
\`\`\`

## functools.wraps

Сохраняет имя и docstring оригинальной функции:

\`\`\`python
from functools import wraps

def my_dec(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper
\`\`\``,
            starterCode: `def repeat(times):
    """Декоратор: повторяет функцию times раз, возвращает список результатов"""
    def decorator(func):
        def wrapper(*args, **kwargs):
            # Вызвать func times раз, собрать результаты в список
            pass
        return wrapper
    return decorator

def prefix(text):
    """Декоратор: добавляет text в начало результата функции"""
    def decorator(func):
        def wrapper(*args, **kwargs):
            pass
        return wrapper
    return decorator

@repeat(3)
def say_hi():
    return "Привет"

@prefix(">>> ")
def message(text):
    return text`,
            solution: `def repeat(times):
    def decorator(func):
        def wrapper(*args, **kwargs):
            return [func(*args, **kwargs) for _ in range(times)]
        return wrapper
    return decorator

def prefix(text):
    def decorator(func):
        def wrapper(*args, **kwargs):
            return text + func(*args, **kwargs)
        return wrapper
    return decorator

@repeat(3)
def say_hi():
    return "Привет"

@prefix(">>> ")
def message(text):
    return text`,
            tests: t([
              { input: "str(say_hi())", expected: "['Привет', 'Привет', 'Привет']", description: "@repeat(3) → список из 3 элементов" },
              { input: "str(message('Hello'))", expected: ">>> Hello", description: "@prefix('>>> ') → добавляет префикс" },
              { input: "str(repeat(2)(lambda: 'ok')())", expected: "['ok', 'ok']", description: "repeat(2) применяется к лямбде" },
            ]),
            hints: t([
              "return [func(*args, **kwargs) for _ in range(times)] — вызов times раз через list comprehension.",
              "prefix + func(...) соединяет строки.",
            ]),
          },

          // ═══════════════════════════════════════════════════════
          // МОДУЛЬ 18: АННОТАЦИИ ТИПОВ
          // ═══════════════════════════════════════════════════════

          {
            title: "Аннотации типов (Type Hints)",
            order: 47,
            type: "quiz",
            language: "python",
            xpReward: 60,
            content: `# Аннотации типов (Type Hints)

С Python 3.5+ можно указывать типы переменных и параметров. Это **не обязательно** — Python всё равно не проверяет типы во время выполнения, но помогает IDE и разработчикам.

\`\`\`python
# Аннотации переменных
name: str = "Alice"
age: int = 30
scores: list[int] = [95, 87, 92]
info: dict[str, int] = {"score": 100}

# Аннотации функций
def greet(name: str) -> str:
    return f"Hello, {name}!"

def add(a: int, b: int) -> int:
    return a + b

# Необязательные значения
from typing import Optional

def find_user(id: int) -> Optional[str]:
    if id == 1:
        return "Alice"
    return None   # может вернуть None
\`\`\`

## Union и другие типы (Python 3.10+)

\`\`\`python
# Вместо Optional[str] можно писать:
def find(id: int) -> str | None:
    ...
\`\`\``,
            starterCode: null,
            solution: null,
            tests: t([
              { input: "Что означает -> str в def greet() -> str:?", expected: "Функция возвращает строку", description: "Функция возвращает строку,Параметр типа str,Аргумент по умолчанию,Это комментарий" },
              { input: "Как аннотировать список целых чисел?", expected: "list[int]", description: "list[int],int[],List(int),array[int]" },
              { input: "Что такое Optional[str]?", expected: "str или None", description: "str или None,Только str,Список строк,Строка или число" },
              { input: "Проверяет ли Python аннотации типов во время выполнения?", expected: "Нет, только для IDE и читаемости", description: "Нет, только для IDE и читаемости,Да, всегда,Только в режиме debug,Только для встроенных типов" },
            ]),
            hints: t([
              "Type hints — подсказки, а не ограничения. Python их не проверяет в runtime.",
              "Optional[str] = str | None — значение может быть строкой или None.",
            ]),
          },

          // ═══════════════════════════════════════════════════════
          // МОДУЛЬ 19: МИНИ-ПРОЕКТЫ
          // ═══════════════════════════════════════════════════════

          {
            title: "Проект: Менеджер задач",
            order: 48,
            type: "code",
            language: "python",
            xpReward: 150,
            content: `# Проект: Менеджер задач

Применим ООП, списки, словари, и всё что узнали — создадим полноценный менеджер задач.

\`\`\`python
class TaskManager:
    def __init__(self):
        self.tasks = []

    def add_task(self, title, priority="normal"):
        self.tasks.append({
            "title": title,
            "priority": priority,
            "done": False
        })
        return self   # для цепочки вызовов

    def complete(self, title):
        for task in self.tasks:
            if task["title"] == title:
                task["done"] = True
        return self

    def get_pending(self):
        return [t["title"] for t in self.tasks if not t["done"]]

    def get_by_priority(self, priority):
        return [t["title"] for t in self.tasks if t["priority"] == priority]
\`\`\`

Обрати внимание на \`return self\` — это позволяет цепочку вызовов:

\`\`\`python
tm = TaskManager()
tm.add_task("Учить Python").add_task("Практиковаться").complete("Учить Python")
\`\`\``,
            starterCode: `class TaskManager:
    def __init__(self):
        self.tasks = []

    def add_task(self, title, priority="normal"):
        """Добавить задачу. Вернуть self для цепочки вызовов."""
        pass

    def complete(self, title):
        """Отметить задачу как выполненную. Вернуть self."""
        pass

    def get_pending(self):
        """Вернуть список названий незавершённых задач"""
        pass

    def done_count(self):
        """Вернуть количество выполненных задач"""
        pass

    def get_by_priority(self, priority):
        """Вернуть названия задач с указанным приоритетом"""
        pass`,
            solution: `class TaskManager:
    def __init__(self):
        self.tasks = []

    def add_task(self, title, priority="normal"):
        self.tasks.append({"title": title, "priority": priority, "done": False})
        return self

    def complete(self, title):
        for task in self.tasks:
            if task["title"] == title:
                task["done"] = True
        return self

    def get_pending(self):
        return [t["title"] for t in self.tasks if not t["done"]]

    def done_count(self):
        return sum(1 for t in self.tasks if t["done"])

    def get_by_priority(self, priority):
        return [t["title"] for t in self.tasks if t["priority"] == priority]`,
            tests: t([
              { input: "str(TaskManager().add_task('A').add_task('B').get_pending())", expected: "['A', 'B']", description: "Добавить A и B → оба в pending" },
              { input: "str(TaskManager().add_task('A').add_task('B').complete('A').done_count())", expected: "1", description: "После complete('A') → done_count = 1" },
              { input: "str(TaskManager().add_task('A').add_task('B').complete('A').get_pending())", expected: "['B']", description: "После complete('A') → pending = ['B']" },
              { input: "str(TaskManager().add_task('X', 'high').add_task('Y', 'low').get_by_priority('high'))", expected: "['X']", description: "get_by_priority('high') → ['X']" },
            ]),
            hints: t([
              "return self в конце методов add_task и complete позволяет цепочку: tm.add_task('A').add_task('B')",
              "List comprehension: [t['title'] for t in self.tasks if not t['done']]",
            ]),
          },

          {
            title: "Проект: Анализатор текста",
            order: 49,
            type: "code",
            language: "python",
            xpReward: 150,
            content: `# Проект: Анализатор текста

Финальный практический проект — применим строки, коллекции, функции, генераторы и модули.

\`\`\`python
from collections import Counter
import re

text = "Python is great. Python is popular. Use Python!"

words = re.findall(r"[a-zA-Zа-яёА-ЯЁ]+", text.lower())
counter = Counter(words)
most_common = counter.most_common(3)
print(most_common)  # [('python', 3), ('is', 2), ('great', 1)]
\`\`\`

## Что будем строить

- Подсчёт слов и предложений
- Нахождение самого частого слова
- Средняя длина слова
- Уникальные слова`,
            starterCode: `import re
from collections import Counter

def word_count(text):
    """Количество слов в тексте"""
    pass

def sentence_count(text):
    """Количество предложений (по . ! ?)"""
    pass

def most_frequent_word(text):
    """Самое частое слово (нижний регистр, только буквы)"""
    pass

def unique_word_count(text):
    """Количество уникальных слов (нижний регистр)"""
    pass

def avg_word_length(text):
    """Средняя длина слова, округлить до 1 знака"""
    pass`,
            solution: `import re
from collections import Counter

def word_count(text):
    return len(re.findall(r"[a-zA-Zа-яёА-ЯЁ]+", text))

def sentence_count(text):
    return len(re.findall(r"[.!?]", text))

def most_frequent_word(text):
    words = re.findall(r"[a-zA-Zа-яёА-ЯЁ]+", text.lower())
    return Counter(words).most_common(1)[0][0] if words else ""

def unique_word_count(text):
    words = re.findall(r"[a-zA-Zа-яёА-ЯЁ]+", text.lower())
    return len(set(words))

def avg_word_length(text):
    words = re.findall(r"[a-zA-Zа-яёА-ЯЁ]+", text)
    return round(sum(len(w) for w in words) / len(words), 1) if words else 0`,
            tests: t([
              { input: "str(word_count('Hello world this is Python'))", expected: "5", description: "word_count → 5" },
              { input: "str(sentence_count('Hello! How are you? Fine.'))", expected: "3", description: "sentence_count → 3" },
              { input: "str(most_frequent_word('the cat and the dog and the'))", expected: "the", description: "most_frequent_word → 'the'" },
              { input: "str(unique_word_count('a b a b c'))", expected: "3", description: "unique_word_count → 3" },
            ]),
            hints: t([
              "re.findall(r'[a-zA-Zа-яёА-ЯЁ]+', text) извлекает только слова без пунктуации.",
              "Counter(words).most_common(1)[0][0] — самое частое слово.",
            ]),
          },

          // ═══════════════════════════════════════════════════════
          // ФИНАЛЬНЫЙ ТЕСТ
          // ═══════════════════════════════════════════════════════

          {
            title: "Финальный тест: все темы курса",
            order: 50,
            type: "quiz",
            language: "python",
            xpReward: 300,
            content: `# Финальный тест: все темы курса 🏆

Поздравляем — вы прошли весь курс **Python: Полный курс для начинающих**!

Этот финальный тест охватывает **все 19 модулей**:

- Основы: print, переменные, числа
- Строки, f-строки, методы
- Булева логика, условия, циклы
- Списки, кортежи, множества, словари
- Функции, lambda, рекурсия
- Исключения, модули
- ООП: классы, наследование, декораторы
- Файлы, CSV, JSON
- map/filter/zip, генераторы, datetime
- Декораторы, аннотации типов

> Вы прошли полный путь от нуля до уверенного уровня Python 🐍`,
            starterCode: null,
            solution: null,
            tests: t([
              { input: "Что вернёт 'hello'[::-1]?", expected: "olleh", description: "olleh,hello,helo,ello" },
              { input: "Какая структура данных хранит уникальные элементы?", expected: "set", description: "list,tuple,set,dict" },
              { input: "Что такое __init__ в классе?", expected: "Конструктор — вызывается при создании объекта", description: "Конструктор — вызывается при создании объекта,Деструктор,Метод для строкового представления,Статический метод" },
              { input: "Что такое self в методах класса?", expected: "Ссылка на текущий объект", description: "Ссылка на текущий объект,Ключевое слово Python,Статический атрибут,Имя класса" },
              { input: "Что делает yield в функции?", expected: "Превращает функцию в генератор", description: "Превращает функцию в генератор,Возвращает значение и завершает функцию,Вызывает исключение,Создаёт список" },
              { input: "Какой формат используется для обмена данными в API?", expected: "JSON", description: "JSON,CSV,XML,TXT" },
              { input: "Что делает @property?", expected: "Превращает метод в атрибут (без скобок)", description: "Превращает метод в атрибут (без скобок),Делает метод статическим,Запрещает изменение атрибута,Кэширует результат метода" },
              { input: "Что такое list comprehension?", expected: "Компактный способ создания списка", description: "Компактный способ создания списка,Тип данных,Встроенная функция,Метод списка" },
              { input: "Что делает super().__init__()?", expected: "Вызывает конструктор родительского класса", description: "Вызывает конструктор родительского класса,Создаёт новый класс,Удаляет объект,Копирует атрибуты" },
              { input: "Что делает filter(func, list)?", expected: "Оставляет элементы, для которых func → True", description: "Оставляет элементы, для которых func → True,Применяет func к каждому элементу,Сортирует список,Возвращает индексы" },
            ]),
            hints: t([
              "Срез [::-1] разворачивает строку или список.",
              "yield отличается от return: функция с yield — это генератор, который можно итерировать.",
              "super() — обращение к родительскому классу, используется для вызова его методов.",
            ]),
          },
        ],
      },
    },
  });

  console.log("✓ Course 'Python: Полный курс для начинающих' created (50 lessons)");
  console.log("\n🐍 Full Python course seed complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
