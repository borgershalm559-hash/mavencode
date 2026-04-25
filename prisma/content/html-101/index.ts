import type { LessonContent } from "./types";
import lesson01 from "./lessons/01-what-is-web";
import lesson02 from "./lessons/02-how-browser-reads";
import lesson03 from "./lessons/03-tag-and-attribute";
import lesson04 from "./lessons/04-h1";
import lesson05 from "./lessons/05-headings-hierarchy";
import lesson06 from "./lessons/06-paragraph";
import lesson07 from "./lessons/07-br-hr";
import lesson08 from "./lessons/08-strong-em";
import lesson09 from "./lessons/09-blockquote";
import lesson10 from "./lessons/10-fix-broken-markup";
import lesson11 from "./lessons/11-links";
import lesson12 from "./lessons/12-target-rel";
import lesson13 from "./lessons/13-anchor-links";
import lesson14 from "./lessons/14-img";
import lesson15 from "./lessons/15-image-formats";
import lesson16 from "./lessons/16-picture-srcset";
import lesson17 from "./lessons/17-ul";
import lesson18 from "./lessons/18-ol";
import lesson19 from "./lessons/19-nested-lists";
import lesson20 from "./lessons/20-table-basics";
import lesson21 from "./lessons/21-thead-tbody";
import lesson22 from "./lessons/22-colspan-rowspan";
import lesson23 from "./lessons/23-fix-broken-table";
import lesson24 from "./lessons/24-document-structure";
import lesson25 from "./lessons/25-head-meta";
import lesson26 from "./lessons/26-lang-description";
import lesson27 from "./lessons/27-code-pre-kbd";
import lesson28 from "./lessons/28-details-summary";
import lesson29 from "./lessons/29-time-abbr-mark";
import lesson30 from "./lessons/30-final-recipe";

export const HTML_101_LESSONS: LessonContent[] = [
  lesson01, lesson02, lesson03, lesson04, lesson05,
  lesson06, lesson07, lesson08, lesson09, lesson10,
  lesson11, lesson12, lesson13, lesson14, lesson15,
  lesson16, lesson17, lesson18, lesson19, lesson20,
  lesson21, lesson22, lesson23, lesson24, lesson25,
  lesson26, lesson27, lesson28, lesson29, lesson30,
];

export const HTML_101_COURSE = {
  title: "HTML 101 — Скелет страницы",
  description:
    "Курс для тех, кто никогда не делал сайтов. За 30 уроков ты пройдёшь от «что такое тег» до полностью свёрстанной страницы рецепта. После курса умеешь использовать все базовые HTML-элементы: текст, ссылки, картинки, списки и таблицы.",
  tags: ["HTML", "Веб", "С нуля"],
  difficulty: "beginner",
  image: null as string | null,
};
