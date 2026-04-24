import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "Параметры по умолчанию и именованные аргументы",
  order: 18,
  type: "code",
  language: "python",
  xpReward: 150,
  content: `# Параметры по умолчанию и именованные аргументы

## 🎯 Что научишься делать
- Объявлять параметры со значениями по умолчанию
- Вызывать функции с позиционными и именованными аргументами
- Понимать правило: обязательные параметры до необязательных

## 🔍 Зачем это нужно
Не все параметры одинаково важны. Когда ты заказываешь кофе, ты обязан указать размер стакана — без этого бариста не знает, что делать. Но добавлять ли карамельный сироп — это опционально: если не сказал, подадут без него. Параметры по умолчанию работают ровно так же: для необязательных параметров Python подставляет заготовленное значение, если его не передали. Это делает функции гибкими и удобными в использовании.

## 📚 Теория

### Метафора: форма заказа

Представь форму заказа кофе. В ней есть поля:
- **Размер** (обязательное) — без него заказ невозможен
- **Сироп** (необязательное) — если не указал, значит «без сиропа»
- **Молоко** (необязательное) — если не указал, значит «обычное»

Функция с параметрами по умолчанию — это та же форма. Обязательные параметры — поля, которые должны быть заполнены при каждом вызове. Необязательные — поля с готовыми значениями, которые используются, если ты ничего не указал.

### Параметр по умолчанию

Добавить значение по умолчанию просто — пишешь \`= значение\` после имени параметра:

\`\`\`python
def greet(name, greeting="Привет"):
    return greeting + ", " + name + "!"
\`\`\`

Теперь функцию можно вызвать двумя способами:

\`\`\`python
print(greet("Алиса"))             # Привет, Алиса!  — greeting не передан, взяли дефолт
print(greet("Борис", "Здравствуй"))  # Здравствуй, Борис!  — передали своё значение
\`\`\`

Если аргумент передан — используется он. Если не передан — используется значение по умолчанию. Просто и предсказуемо.

### Правило расположения: обязательные параметры сначала

Python требует жёсткого порядка: **сначала все параметры без умолчания, потом все с умолчанием**. Нарушение этого правила — синтаксическая ошибка:

\`\`\`python
# Правильно:
def make_coffee(size, syrup="no", milk="regular"):
    ...

# Ошибка! SyntaxError: non-default argument follows default argument
def make_coffee(size, syrup="no", milk):
    ...
\`\`\`

Логика простая: если бы необязательный параметр был до обязательного, Python не мог бы понять, какой аргумент к чему относится.

### Позиционные аргументы

До сих пор мы передавали аргументы **позиционно** — первый аргумент идёт в первый параметр, второй — во второй:

\`\`\`python
def describe(name, age, city):
    return f"{name}, {age} лет, из {city}"

print(describe("Анна", 25, "Москва"))   # Анна, 25 лет, из Москва
\`\`\`

Порядок имеет значение. Если перепутать — получишь логически неверный результат без ошибки:

\`\`\`python
print(describe("Москва", 25, "Анна"))   # Москва, 25 лет, из Анна — неверно!
\`\`\`

### Именованные аргументы (keyword arguments)

Именованные аргументы позволяют указать, какой аргумент к какому параметру относится:

\`\`\`python
def describe(name, age, city):
    return f"{name}, {age} лет, из {city}"

# С именованными аргументами порядок можно менять:
print(describe(age=25, city="Москва", name="Анна"))   # Анна, 25 лет, из Москва
\`\`\`

Результат тот же, несмотря на другой порядок. Это особенно полезно, когда у функции много параметров — именованные аргументы делают вызов самодокументирующимся.

### Смешанный вызов

Можно комбинировать позиционные и именованные аргументы. Правило: **позиционные сначала, именованные потом**:

\`\`\`python
def make_coffee(size, syrup="no", milk="regular"):
    return f"Кофе: {size}, сироп: {syrup}, молоко: {milk}"

# Позиционный + именованный:
print(make_coffee("large", syrup="карамель"))
# Кофе: large, сироп: карамель, молоко: regular

# Только позиционные:
print(make_coffee("small", "ваниль", "соевое"))
# Кофе: small, сироп: ваниль, молоко: соевое

# Только именованные (кроме обязательного первого):
print(make_coffee("medium", milk="обезжиренное"))
# Кофе: medium, сироп: no, молоко: обезжиренное
\`\`\`

Это даёт большую гибкость: пользователь функции может указать только то, что отличается от умолчаний.

### None как значение по умолчанию

Если параметр может быть «отсутствующим» (а не просто иметь заготовленное значение), хорошая практика — использовать \`None\` как дефолт, а потом проверять:

\`\`\`python
def send_message(text, recipient=None):
    if recipient is None:
        return f"Сообщение себе: {text}"
    return f"Сообщение для {recipient}: {text}"

print(send_message("Привет!"))               # Сообщение себе: Привет!
print(send_message("Как дела?", "Алиса"))    # Сообщение для Алиса: Как дела?
\`\`\`

Почему не просто \`recipient=""\` (пустая строка)? Потому что пустая строка может быть валидным значением в некоторых задачах. \`None\` означает «не передано» однозначно. Это общепринятая конвенция в Python.

### Мимоходом: *args и **kwargs

Ты можешь встретить в чужом коде такие объявления:

\`\`\`python
def log(*args, **kwargs):
    ...
\`\`\`

- **\`*args\`** — позволяет передать любое количество позиционных аргументов (они попадут в кортеж)
- **\`**kwargs\`** — позволяет передать любое количество именованных аргументов (они попадут в словарь)

Это продвинутые возможности Python — подробно разберём в Python 301. Пока достаточно знать, что они существуют.

## 🧪 Примеры

\`\`\`python
# Функция приветствия с настраиваемым языком
def hello(name, lang="ru"):
    if lang == "ru":
        return "Привет, " + name + "!"
    elif lang == "en":
        return "Hello, " + name + "!"
    else:
        return "Hi, " + name + "!"

print(hello("Анна"))          # Привет, Анна!
print(hello("Alice", "en"))   # Hello, Alice!
print(hello("Bob", lang="en"))# Hello, Bob!
\`\`\`

\`\`\`python
# Функция с несколькими опциональными параметрами
def create_user(username, role="user", active=True):
    return {
        "username": username,
        "role": role,
        "active": active,
    }

admin = create_user("admin_user", role="admin")
guest = create_user("guest123", active=False)
regular = create_user("john_doe")

print(admin)    # {'username': 'admin_user', 'role': 'admin', 'active': True}
print(guest)    # {'username': 'guest123', 'role': 'user', 'active': False}
print(regular)  # {'username': 'john_doe', 'role': 'user', 'active': True}
\`\`\`

## ⚠️ Частые ошибки новичков

1. **Ставить параметр с умолчанием перед параметром без умолчания.** \`def f(a=1, b):\` — это \`SyntaxError\`. Обязательные параметры всегда идут первыми.

2. **Использовать изменяемый объект как умолчание.** \`def f(items=[]):\` — ловушка! В Python умолчания вычисляются один раз при объявлении функции, а не при каждом вызове. Если функция изменяет \`items\`, следующий вызов получит уже изменённый список. Безопасный вариант: \`def f(items=None):  # и внутри: if items is None: items = []\`.

3. **Передавать именованный аргумент до позиционного.** \`f(a=1, 2)\` — \`SyntaxError\`. Позиционные всегда идут до именованных при вызове.

4. **Передать один аргумент дважды.** \`f(1, a=1)\` — \`TypeError\`: параметр получил значение и позиционно, и именованно.

## 💡 Мини-тест самопроверки

1. Что вернёт \`greet("Маша")\` при \`def greet(name, text="Привет"):\`? (Ответ: \`"Привет, Маша"\` — текст взят из умолчания)
2. Можно ли написать \`def f(a=1, b, c=3):\`? (Ответ: нет, \`SyntaxError\` — \`b\` без умолчания стоит после \`a\` с умолчанием)
3. Что значит вызов \`f(x=5, y=10)\`? (Ответ: именованные аргументы — аргументы переданы с указанием имён параметров)

## 🛠️ Задание

Напиши функцию \`describe_pizza(size, crust="thin", extra=None)\`, которая возвращает строку-описание заказа пиццы.

Правила формирования строки:
- Всегда: \`"<size> pizza, <crust> crust"\`
- Если \`extra\` не \`None\`, добавить \`", + <extra>"\` в конце

Примеры вызовов:
\`\`\`python
describe_pizza("large")
# "large pizza, thin crust"

describe_pizza("small", crust="thick")
# "small pizza, thick crust"

describe_pizza("medium", extra="pepperoni")
# "medium pizza, thin crust, + pepperoni"

describe_pizza("large", crust="stuffed", extra="olives")
# "large pizza, stuffed crust, + olives"
\`\`\``,

  starterCode: `def describe_pizza(size, crust="thin", extra=None):
    # Начни с базовой строки: "<size> pizza, <crust> crust"
    # Если extra не None — добавь ", + <extra>"
    # Верни результат через return
    pass`,

  solution: `def describe_pizza(size, crust="thin", extra=None):
    base = f"{size} pizza, {crust} crust"
    if extra is not None:
        return base + f", + {extra}"
    return base`,

  tests: [
    {
      input: 'describe_pizza("large")',
      expected: "large pizza, thin crust",
      description: "Только обязательный параметр",
    },
    {
      input: 'describe_pizza("small", crust="thick")',
      expected: "small pizza, thick crust",
      description: "Именованный аргумент crust",
    },
    {
      input: 'describe_pizza("medium", extra="pepperoni")',
      expected: "medium pizza, thin crust, + pepperoni",
      description: "extra через именованный аргумент",
    },
    {
      input: 'describe_pizza("large", crust="stuffed", extra="olives")',
      expected: "large pizza, stuffed crust, + olives",
      description: "Все параметры переданы",
    },
    {
      input: 'describe_pizza("large", "crispy")',
      expected: "large pizza, crispy crust",
      description: "crust позиционно",
    },
  ],

  hints: [
    "Начни с формирования базовой строки: \`base = f\"{size} pizza, {crust} crust\"\`. Потом проверь: \`if extra is not None:\` — если да, добавь \`f\", + {extra}\"\` к base и верни результат. Если extra не передан — верни base как есть.",
    "Структура: \`base = f\"{size} pizza, {crust} crust\"\`, потом \`if extra is not None: return base + f\", + {extra}\"\`, иначе \`return base\`. Помни что параметры по умолчанию (\`crust=\"thin\"\`, \`extra=None\`) не нужно передавать при вызове — Python подставит их автоматически.",
    "Полное решение:\n```python\ndef describe_pizza(size, crust=\"thin\", extra=None):\n    base = f\"{size} pizza, {crust} crust\"\n    if extra is not None:\n        return base + f\", + {extra}\"\n    return base\n```",
  ],

  isAvailable: true,
};

export default lesson;
