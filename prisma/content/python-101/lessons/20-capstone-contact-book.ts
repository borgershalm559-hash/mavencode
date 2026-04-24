import type { LessonContent } from "../types";

const lesson: LessonContent = {
  title: "Капстон: Мини-записная книжка",
  order: 20,
  type: "code",
  language: "python",
  xpReward: 300,
  content: `# Капстон: «Мини-записная книжка»

## 🎯 Что ты построишь

Ты напишешь **5 функций**, которые вместе образуют полноценную записную книжку контактов. Каждый контакт хранит имя, телефон и email. Книжка умеет добавлять, искать, удалять контакты и выводить их список.

Это не учебное упражнение — это настоящая маленькая программа с собственной архитектурой.

## 🔍 Зачем это нужно

Это финальный проект курса. Собрав его, ты:

- **Соединишь всё изученное** — функции (L17), словари (L14), списки (L12–L13), условия (L8), строки (L6–L7)
- **Почувствуешь «настоящее программирование»** — несколько функций работают с общим состоянием и вызывают друг друга
- **Получишь портфолио-ready демо** — если тебя спросят «что ты умеешь?», ты можешь показать этот код

Большинство реальных приложений устроены именно так: набор функций, которые читают и изменяют общее хранилище данных.

## 📚 Как устроен проект

**Контакт** — это словарь с тремя полями:

\`\`\`python
contact = {
    "name":  "Иван",
    "phone": "+7111",
    "email": "ivan@mail.ru"
}
\`\`\`

**Книжка** — это словарь, где ключ — имя контакта, а значение — словарь-контакт:

\`\`\`python
book = {
    "Иван": {"name": "Иван", "phone": "+7111", "email": "ivan@mail.ru"},
    "Анна": {"name": "Анна", "phone": "+7222", "email": "anna@mail.ru"},
}
\`\`\`

Такая структура позволяет мгновенно найти любой контакт по имени: \`book["Иван"]\`.

**Функции** принимают книжку как аргумент, изменяют или читают её, и возвращают результат. Это стандартный шаблон: данные + операции над данными.

## 📚 Напоминание из предыдущих уроков

**Функции (L17):** \`def name(arg1, arg2):\` объявляет функцию с параметрами. \`return\` возвращает результат. Без \`return\` функция возвращает \`None\`.

**Словари (L14):** \`d[key]\` — прямой доступ (KeyError если нет ключа). \`d.get(key)\` — безопасный (возвращает \`None\` если нет ключа). \`key in d\` — проверка наличия. \`del d[key]\` — удаление.

**Списки и sorted (L12–L13):** \`sorted(iterable)\` возвращает новый отсортированный список. Сам итерируемый объект не изменяется.

**Условия (L8):** \`if key in d:\` проверяет ключ перед удалением, чтобы избежать \`KeyError\`.

## 🧪 Разбор архитектуры

### \`add_contact(book, name, phone, email)\`

Создаёт словарь-контакт и сохраняет его в книжку под ключом \`name\`.

\`\`\`python
def add_contact(book, name, phone, email):
    book[name] = {"name": name, "phone": phone, "email": email}
    return book
\`\`\`

Мы передаём \`book\` в функцию и возвращаем его обратно — это явный контракт: «ты мне книжку, я её изменю и верну». Контакт хранит поле \`"name"\` тоже, чтобы при выводе не нужно было помнить, под каким ключом он лежит.

---

### \`find_contact(book, name)\`

Возвращает контакт-словарь, если он есть, или \`None\` если нет.

\`\`\`python
def find_contact(book, name):
    return book.get(name)
\`\`\`

Метод \`get(key)\` без второго аргумента возвращает \`None\` по умолчанию — это именно то, что нам нужно. Использовать \`book[name]\` здесь опасно: если контакта нет, получим \`KeyError\`.

---

### \`remove_contact(book, name)\`

Удаляет контакт из книжки (если он существует) и возвращает обновлённую книжку.

\`\`\`python
def remove_contact(book, name):
    if name in book:
        del book[name]
    return book
\`\`\`

Проверка \`if name in book\` обязательна перед \`del\` — иначе удаление несуществующего ключа выбросит \`KeyError\`. Функция всегда возвращает книжку, даже если ничего не удалила.

---

### \`list_contacts(book)\`

Возвращает отсортированный список имён из книжки.

\`\`\`python
def list_contacts(book):
    return sorted(book.keys())
\`\`\`

\`book.keys()\` возвращает все ключи (имена). \`sorted()\` сортирует их в алфавитном порядке и возвращает новый список. Книжка при этом не изменяется.

*Технически \`sorted(book)\` тоже работает — при итерации по словарю Python проходит по ключам. Но \`sorted(book.keys())\` читается яснее: мы явно говорим «хочу ключи».*

---

### \`format_contact(contact)\`

Форматирует контакт-словарь в удобочитаемую строку.

\`\`\`python
def format_contact(contact):
    return f"Name: {contact['name']} | Phone: {contact['phone']} | Email: {contact['email']}"
\`\`\`

f-строка позволяет вставлять выражения прямо в строку. Внутри фигурных скобок \`{}\` мы обращаемся к полям контакта. Обратите внимание: внешние кавычки f-строки двойные (\`"\`), поэтому внутри используем одинарные (\`'\`).

## ⚠️ Частые ошибки в капстоне

1. **Использовать \`book[name]\` вместо \`book.get(name)\` в \`find_contact\`** — если контакта нет, получишь \`KeyError\` вместо \`None\`.

2. **Забыть проверить \`if name in book\` перед \`del\`** — та же проблема: \`KeyError\` при удалении несуществующего ключа.

3. **Забыть \`return book\`** в \`add_contact\` или \`remove_contact\` — функция изменит словарь, но вернёт \`None\`. Тесты проверяют возвращаемое значение.

4. **Смешать кавычки в f-строке** — если снаружи двойные, то внутри \`{}\` нужны одинарные. \`f"{'name'}"\` — ошибка синтаксиса в старых версиях Python.

5. **Забыть поле \`"name"\` в словаре контакта** — \`format_contact\` обращается к \`contact['name']\`, и если этого поля нет, получишь \`KeyError\`.

## 🛠️ Задание

Напиши 5 функций для записной книжки:

- **\`add_contact(book, name, phone, email)\`** — добавляет контакт в книжку и возвращает её
- **\`find_contact(book, name)\`** — возвращает контакт-словарь или \`None\` если не найден
- **\`remove_contact(book, name)\`** — удаляет контакт (если есть) и возвращает книжку
- **\`list_contacts(book)\`** — возвращает отсортированный список имён
- **\`format_contact(contact)\`** — возвращает строку вида \`"Name: X | Phone: Y | Email: Z"\`

**Контакт** — словарь с ключами \`"name"\`, \`"phone"\`, \`"email"\`.
**Книжка** — словарь, где ключ — имя (строка), значение — контакт-словарь.`,

  starterCode: `def add_contact(book, name, phone, email):
    # TODO: добавить в book новый контакт и вернуть book
    pass


def find_contact(book, name):
    # TODO: вернуть контакт по имени или None
    pass


def remove_contact(book, name):
    # TODO: удалить контакт (если есть) и вернуть book
    pass


def list_contacts(book):
    # TODO: вернуть отсортированный список имён
    pass


def format_contact(contact):
    # TODO: вернуть строку "Name: X | Phone: Y | Email: Z"
    pass`,

  solution: `def add_contact(book, name, phone, email):
    book[name] = {"name": name, "phone": phone, "email": email}
    return book


def find_contact(book, name):
    return book.get(name)


def remove_contact(book, name):
    if name in book:
        del book[name]
    return book


def list_contacts(book):
    return sorted(book.keys())


def format_contact(contact):
    return f"Name: {contact['name']} | Phone: {contact['phone']} | Email: {contact['email']}"`,

  tests: [
    {
      input: 'add_contact({}, "Ivan", "+7111", "ivan@mail.ru")["Ivan"]["phone"]',
      expected: "+7111",
      description: "add_contact сохраняет телефон"
    },
    {
      input: 'find_contact({"Anna": {"name": "Anna", "phone": "+7222", "email": "a@b.c"}}, "Anna")["email"]',
      expected: "a@b.c",
      description: "find_contact возвращает контакт"
    },
    {
      input: 'find_contact({}, "Nobody")',
      expected: "None",
      description: "find_contact возвращает None если нет"
    },
    {
      input: 'remove_contact({"Ivan": {"name": "Ivan"}}, "Ivan")',
      expected: "{}",
      description: "remove_contact удаляет"
    },
    {
      input: 'list_contacts({"Boris": {}, "Anna": {}, "Ivan": {}})',
      expected: "['Anna', 'Boris', 'Ivan']",
      description: "list_contacts сортирует имена"
    },
    {
      input: 'format_contact({"name": "Ivan", "phone": "+7111", "email": "i@b.c"})',
      expected: "Name: Ivan | Phone: +7111 | Email: i@b.c",
      description: "format_contact форматирует"
    },
  ],

  hints: [
    "Собери всё из курса — функции (L17), словари (L14), списки (L12/13). Начни с самой простой — `find_contact`, это просто `.get()`.",
    "Подсказки по функциям: `add_contact` — присвоить `book[name] = {\"name\": name, \"phone\": phone, \"email\": email}` и вернуть book; `remove_contact` — `if name in book: del book[name]` и вернуть book; `list_contacts` — `sorted(book.keys())`; `format_contact` — f-строка с обращением к ключам контакта через одинарные кавычки.",
    "Полное решение:\n```python\ndef add_contact(book, name, phone, email):\n    book[name] = {\"name\": name, \"phone\": phone, \"email\": email}\n    return book\n\ndef find_contact(book, name):\n    return book.get(name)\n\ndef remove_contact(book, name):\n    if name in book:\n        del book[name]\n    return book\n\ndef list_contacts(book):\n    return sorted(book.keys())\n\ndef format_contact(contact):\n    return f\"Name: {contact['name']} | Phone: {contact['phone']} | Email: {contact['email']}\"\n```",
  ],

  isAvailable: true,
};

export default lesson;
