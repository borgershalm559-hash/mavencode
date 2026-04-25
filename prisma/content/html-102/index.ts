import type { LessonContent } from "./types";
import lesson01 from "./lessons/01-why-semantics";
import lesson02 from "./lessons/02-header";
import lesson03 from "./lessons/03-nav";
import lesson04 from "./lessons/04-main";
import lesson05 from "./lessons/05-article-section";
import lesson06 from "./lessons/06-aside-footer";
import lesson07 from "./lessons/07-figure-figcaption";
import lesson08 from "./lessons/08-form-quiz";
import lesson09 from "./lessons/09-form-input";
import lesson10 from "./lessons/10-label";
import lesson11 from "./lessons/11-button";
import lesson12 from "./lessons/12-input-types";
import lesson13 from "./lessons/13-placeholder-name";
import lesson14 from "./lessons/14-textarea";
import lesson15 from "./lessons/15-select-option";
import lesson16 from "./lessons/16-checkbox";
import lesson17 from "./lessons/17-radio";
import lesson18 from "./lessons/18-fieldset-legend";
import lesson19 from "./lessons/19-required-length";
import lesson20 from "./lessons/20-pattern-url-tel";
import lesson21 from "./lessons/21-fix-broken-form";
import lesson22 from "./lessons/22-video";
import lesson23 from "./lessons/23-audio";
import lesson24 from "./lessons/24-iframe";
import lesson25 from "./lessons/25-accessibility-quiz";
import lesson26 from "./lessons/26-final-contact-page";

export const HTML_102_LESSONS: LessonContent[] = [
  lesson01, lesson02, lesson03, lesson04, lesson05,
  lesson06, lesson07, lesson08, lesson09, lesson10,
  lesson11, lesson12, lesson13, lesson14, lesson15,
  lesson16, lesson17, lesson18, lesson19, lesson20,
  lesson21, lesson22, lesson23, lesson24, lesson25,
  lesson26,
];

export const HTML_102_COURSE = {
  title: "HTML 102 — Формы и семантика",
  description:
    "Продолжение HTML 101. За 26 уроков ты освоишь семантические теги (header, nav, main, article, section, aside, footer), формы (input всех типов, textarea, select, checkbox, radio, валидация), мультимедиа (video, audio, iframe) и базы доступности. Финал — контактная страница с формой обратной связи.",
  tags: ["HTML", "Веб", "Формы", "Семантика"],
  difficulty: "beginner",
  image: null as string | null,
};
