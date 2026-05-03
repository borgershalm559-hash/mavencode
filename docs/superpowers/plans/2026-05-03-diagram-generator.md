# MavenCode Diagram Generator - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create 8 process flowchart diagrams in JSON format for MavenCode project

**Architecture:** Direct JSON generation - analyze code, manually create diagram JSON files based on the reference format

**Tech Stack:** Node.js for JSON generation, reference diagram (3).json for format

---

## Task 1: Registration Diagram

**Files:**
- Create: `C:\Users\david\Desktop\Отчёт\mavencode-registration.json`

- [ ] **Step 1: Create registration diagram JSON**

Based on `src/app/api/register/route.ts`, create flowchart with these blocks:
- Start
- Input: email, password, name
- Condition: agree to terms?
- Condition: age 14+?
- Condition: email valid?
- Check: email exists in DB?
- Hash password
- Create user in DB
- Create PvpRating
- End

```json
{
  "blocks": [
    {"x": 260, "y": -20, "text": "Начало", "width": 100, "height": 30, "type": "Начало / конец", "isMenuBlock": false, "fontSize": 14, "textHeight": 14, "isBold": false, "isItalic": false, "textAlign": "center", "labelsPosition": 1},
    {"x": 260, "y": 60, "text": "Регистрация", "width": 100, "height": 40, "type": "Блок", "isMenuBlock": false, "fontSize": 14, "textHeight": 14, "isBold": false, "isItalic": false, "textAlign": "center", "labelsPosition": 1},
    {"x": 260, "y": 140, "text": "Email, пароль,\nимя", "width": 120, "height": 60, "type": "Ввод / вывод", "isMenuBlock": false, "fontSize": 14, "textHeight": 14, "isBold": false, "isItalic": false, "textAlign": "center", "labelsPosition": 1},
    {"x": 260, "y": 240, "text": "Согласие с\nусловиями?", "width": 120, "height": 60, "type": "Условие", "isMenuBlock": false, "fontSize": 14, "textHeight": 14, "isBold": false, "isItalic": false, "textAlign": "center", "labelsPosition": 1},
    {"x": 260, "y": 340, "text": "Возраст 14+?", "width": 120, "height": 60, "type": "Условие", "isMenuBlock": false, "fontSize": 14, "textHeight": 14, "isBold": false, "isItalic": false, "textAlign": "center", "labelsPosition": 1},
    {"x": 260, "y": 440, "text": "Email валиден?", "width": 120, "height": 60, "type": "Условие", "isMenuBlock": false, "fontSize": 14, "textHeight": 14, "isBold": false, "isItalic": false, "textAlign": "center", "labelsPosition": 1},
    {"x": 260, "y": 540, "text": "Email уже\nсуществует?", "width": 120, "height": 60, "type": "Условие", "isMenuBlock": false, "fontSize": 14, "textHeight": 14, "isBold": false, "isItalic": false, "textAlign": "center", "labelsPosition": 1},
    {"x": 260, "y": 640, "text": "Хеширование\nпароля", "width": 120, "height": 40, "type": "Блок", "isMenuBlock": false, "fontSize": 14, "textHeight": 14, "isBold": false, "isItalic": false, "textAlign": "center", "labelsPosition": 1},
    {"x": 260, "y": 720, "text": "Создание\nпользователя", "width": 120, "height": 40, "type": "Блок", "isMenuBlock": false, "fontSize": 14, "textHeight": 14, "isBold": false, "isItalic": false, "textAlign": "center", "labelsPosition": 1},
    {"x": 260, "y": 800, "text": "Создание\nPvpRating", "width": 120, "height": 40, "type": "Блок", "isMenuBlock": false, "fontSize": 14, "textHeight": 14, "isBold": false, "isItalic": false, "textAlign": "center", "labelsPosition": 1},
    {"x": 260, "y": 880, "text": "Конец", "width": 100, "height": 30, "type": "Начало / конец", "isMenuBlock": false, "fontSize": 14, "textHeight": 14, "isBold": false, "isItalic": false, "textAlign": "center", "labelsPosition": 1},
    {"x": 440, "y": 240, "text": "Ошибка:\nтребуется согласие", "width": 140, "height": 60, "type": "Блок", "isMenuBlock": false, "fontSize": 14, "textHeight": 14, "isBold": false, "isItalic": false, "textAlign": "center", "labelsPosition": 1},
    {"x": 440, "y": 340, "text": "Ошибка:\nтребуется 14+", "width": 140, "height": 60, "type": "Блок", "isMenuBlock": false, "fontSize": 14, "textHeight": 14, "isBold": false, "isItalic": false, "textAlign": "center", "labelsPosition": 1},
    {"x": 440, "y": 440, "text": "Ошибка:\nневалидный email", "width": 140, "height": 60, "type": "Блок", "isMenuBlock": false, "fontSize": 14, "textHeight": 14, "isBold": false, "isItalic": false, "textAlign": "center", "labelsPosition": 1},
    {"x": 440, "y": 540, "text": "Ошибка:\nemail занят", "width": 140, "height": 60, "type": "Блок", "isMenuBlock": false, "fontSize": 14, "textHeight": 14, "isBold": false, "isItalic": false, "textAlign": "center", "labelsPosition": 1}
  ],
  "arrows": [
    {"startIndex": 0, "endIndex": 1, "startConnectorIndex": 2, "endConnectorIndex": 0},
    {"startIndex": 1, "endIndex": 2, "startConnectorIndex": 2, "endConnectorIndex": 0},
    {"startIndex": 2, "endIndex": 3, "startConnectorIndex": 2, "endConnectorIndex": 0},
    {"startIndex": 3, "endIndex": 4, "startConnectorIndex": 2, "endConnectorIndex": 0},
    {"startIndex": 3, "endIndex": 11, "startConnectorIndex": 1, "endConnectorIndex": 3},
    {"startIndex": 4, "endIndex": 5, "startConnectorIndex": 2, "endConnectorIndex": 0},
    {"startIndex": 4, "endIndex": 12, "startConnectorIndex": 1, "endConnectorIndex": 3},
    {"startIndex": 5, "endIndex": 6, "startConnectorIndex": 2, "endConnectorIndex": 0},
    {"startIndex": 5, "endIndex": 13, "startConnectorIndex": 1, "endConnectorIndex": 3},
    {"startIndex": 6, "endIndex": 7, "startConnectorIndex": 2, "endConnectorIndex": 0},
    {"startIndex": 6, "endIndex": 14, "startConnectorIndex": 1, "endConnectorIndex": 3},
    {"startIndex": 7, "endIndex": 8, "startConnectorIndex": 2, "endConnectorIndex": 0},
    {"startIndex": 8, "endIndex": 9, "startConnectorIndex": 2, "endConnectorIndex": 0},
    {"startIndex": 9, "endIndex": 10, "startConnectorIndex": 2, "endConnectorIndex": 0}
  ]
}
```

Save to `C:\Users\david\Desktop\Отчёт\mavencode-registration.json`

- [ ] **Step 2: Commit**

```bash
git add "C:\Users\david\Desktop\Отчёт\mavencode-registration.json"
git commit -m "feat: add registration process diagram"
```

---

## Task 2-8: Create Remaining Diagrams

Create similar JSON files for:
- `mavencode-login.json` - based on `src/lib/auth.ts`
- `mavencode-lesson-flow.json` - based on `src/app/api/lessons/[id]/route.ts` and submit
- `mavencode-achievements.json` - based on `src/lib/gamification.ts`
- `mavencode-admin-course.json` - based on `src/app/api/admin/courses/route.ts`
- `mavencode-admin-lessons.json` - based on `src/app/api/admin/courses/[id]/lessons/route.ts`
- `mavencode-admin-users.json` - based on `src/app/api/admin/users/[id]/route.ts`
- `mavencode-admin-news.json` - based on `src/app/api/admin/news/route.ts`

Each follows same pattern: analyze code → create blocks → create arrows → save JSON → commit.
