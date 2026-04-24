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
