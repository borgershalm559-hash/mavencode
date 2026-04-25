import type { LessonContent } from "./types";
import lesson01 from "./lessons/01-what-is-css";
import lesson02 from "./lessons/02-how-to-connect";
import lesson03 from "./lessons/03-tag-selector";
import lesson04 from "./lessons/04-class-selector";
import lesson05 from "./lessons/05-id-selector";
import lesson06 from "./lessons/06-descendant";
import lesson07 from "./lessons/07-child";
import lesson08 from "./lessons/08-adjacent";
import lesson09 from "./lessons/09-attribute";
import lesson10 from "./lessons/10-pseudo-classes";
import lesson11 from "./lessons/11-cascade-quiz";
import lesson12 from "./lessons/12-specificity";
import lesson13 from "./lessons/13-colors-named-hex";
import lesson14 from "./lessons/14-colors-rgb-hsl";
import lesson15 from "./lessons/15-opacity";
import lesson16 from "./lessons/16-font-family";
import lesson17 from "./lessons/17-font-size";
import lesson18 from "./lessons/18-font-weight-style";
import lesson19 from "./lessons/19-line-height-spacing";
import lesson20 from "./lessons/20-text-decoration";
import lesson21 from "./lessons/21-units-px-em-rem";
import lesson22 from "./lessons/22-units-quiz";
import lesson23 from "./lessons/23-margin";
import lesson24 from "./lessons/24-padding";
import lesson25 from "./lessons/25-border";
import lesson26 from "./lessons/26-box-sizing";
import lesson27 from "./lessons/27-background";
import lesson28 from "./lessons/28-display";
import lesson29 from "./lessons/29-display-none";
import lesson30 from "./lessons/30-final-recipe-style";

export const CSS_101_LESSONS: LessonContent[] = [
  lesson01, lesson02, lesson03, lesson04, lesson05,
  lesson06, lesson07, lesson08, lesson09, lesson10,
  lesson11, lesson12, lesson13, lesson14, lesson15,
  lesson16, lesson17, lesson18, lesson19, lesson20,
  lesson21, lesson22, lesson23, lesson24, lesson25,
  lesson26, lesson27, lesson28, lesson29, lesson30,
];

export const CSS_101_COURSE = {
  title: "CSS 101 — Внешний вид",
  description:
    "Делаем сайты красивыми. За 30 уроков ты освоишь подключение CSS, селекторы (тег/класс/id/комбинаторы/псевдо), каскад и специфичность, цвета, типографику, юниты, box-model и базовые display. Финал — стилизация рецепта из HTML 101.",
  tags: ["CSS", "Веб", "Дизайн"],
  difficulty: "beginner",
  image: null as string | null,
};
