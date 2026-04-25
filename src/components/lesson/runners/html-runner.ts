import type { CodeRunner, RunResult, Test, HtmlAssertion, TestResult } from "./types";

function isHtmlAssertion(t: Test): t is HtmlAssertion {
  return typeof (t as HtmlAssertion).kind === "string";
}

function describeExpected(a: HtmlAssertion): string {
  switch (a.kind) {
    case "exists":        return `${a.selector} существует`;
    case "count":         return `${a.selector} × ${a.n}`;
    case "text":          return `${a.selector} = "${a.equals}"`;
    case "textContains":  return `${a.selector} ⊃ "${a.contains}"`;
    case "attr":          return `${a.selector}[${a.name}="${a.equals}"]`;
    case "attrExists":    return `${a.selector}[${a.name}]`;
    case "style":         return `${a.selector} { ${a.property}: ${a.equals} }`;
    case "styleContains": return `${a.selector} { ${a.property}: ⊃${a.contains} }`;
  }
}

/**
 * Normalize a CSS value for comparison. Computed style returns rgb()/rgba()
 * for colors; raw inputs may be hex, named, or rgb. We normalize both sides
 * by parsing with the browser's CSS parser via a temp element.
 */
function normalizeCssValue(window: Window, doc: Document, property: string, value: string): string {
  const probe = doc.createElement("span");
  probe.style.setProperty(property, value);
  doc.body.appendChild(probe);
  const computed = window.getComputedStyle(probe).getPropertyValue(property).trim();
  probe.remove();
  return computed;
}

function runAssertion(window: Window, doc: Document, a: HtmlAssertion): { passed: boolean; actual: string } {
  switch (a.kind) {
    case "exists": {
      const el = doc.querySelector(a.selector);
      return { passed: !!el, actual: el ? "найден" : "не найден" };
    }
    case "count": {
      const n = doc.querySelectorAll(a.selector).length;
      return { passed: n === a.n, actual: `${n} шт.` };
    }
    case "text": {
      const el = doc.querySelector(a.selector);
      const text = el?.textContent?.trim() ?? "";
      return { passed: text === a.equals, actual: el ? `"${text}"` : "не найден" };
    }
    case "textContains": {
      const el = doc.querySelector(a.selector);
      const text = el?.textContent ?? "";
      return { passed: text.includes(a.contains), actual: el ? `"${text.slice(0, 80)}"` : "не найден" };
    }
    case "attr": {
      const el = doc.querySelector(a.selector);
      const v = el?.getAttribute(a.name);
      return { passed: v === a.equals, actual: el ? (v === null ? "(нет атрибута)" : `"${v}"`) : "не найден" };
    }
    case "attrExists": {
      const el = doc.querySelector(a.selector);
      return { passed: !!el?.hasAttribute(a.name), actual: el ? (el.hasAttribute(a.name) ? "есть" : "нет атрибута") : "не найден" };
    }
    case "style": {
      const el = doc.querySelector(a.selector);
      if (!el) return { passed: false, actual: "не найден" };
      const actualComputed = window.getComputedStyle(el).getPropertyValue(a.property).trim();
      const expectedComputed = normalizeCssValue(window, doc, a.property, a.equals);
      return {
        passed: actualComputed === expectedComputed,
        actual: actualComputed || "(пусто)",
      };
    }
    case "styleContains": {
      const el = doc.querySelector(a.selector);
      if (!el) return { passed: false, actual: "не найден" };
      const actualComputed = window.getComputedStyle(el).getPropertyValue(a.property).trim();
      return {
        passed: actualComputed.toLowerCase().includes(a.contains.toLowerCase()),
        actual: actualComputed || "(пусто)",
      };
    }
  }
}

/**
 * Runs HTML lessons. Renders the user's code into a sandboxed iframe
 * (no allow-scripts → no JS execution from user code), then evaluates
 * each DOM assertion against the parsed document.
 */
export class HtmlRunner implements CodeRunner {
  private iframe: HTMLIFrameElement | null = null;

  async run(code: string, tests: Test[]): Promise<RunResult> {
    const assertions = tests.filter(isHtmlAssertion);

    return new Promise<RunResult>((resolve) => {
      const iframe = document.createElement("iframe");
      iframe.setAttribute("sandbox", "allow-same-origin");
      iframe.style.cssText = "position:absolute;left:-9999px;top:-9999px;width:800px;height:600px;border:0;visibility:hidden;";
      this.iframe = iframe;

      let settled = false;
      const finish = (result: RunResult) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        try { iframe.remove(); } catch { /* noop */ }
        this.iframe = null;
        resolve(result);
      };

      const timeout = setTimeout(() => {
        finish({
          output: "",
          error: "Не удалось отрендерить страницу за отведённое время.",
          tests: assertions.map((a): TestResult => ({
            description: a.description,
            passed: false,
            expected: describeExpected(a),
            actual: "таймаут",
          })),
        });
      }, 3000);

      iframe.onload = () => {
        try {
          const doc = iframe.contentDocument;
          if (!doc) {
            finish({
              output: "",
              error: "Не удалось получить доступ к документу превью.",
              tests: assertions.map((a) => ({
                description: a.description,
                passed: false,
                expected: describeExpected(a),
                actual: "—",
              })),
            });
            return;
          }

          const win = iframe.contentWindow;
          if (!win) {
            finish({
              output: "",
              error: "Не удалось получить окно превью.",
              tests: assertions.map((a) => ({
                description: a.description,
                passed: false,
                expected: describeExpected(a),
                actual: "—",
              })),
            });
            return;
          }

          const results: TestResult[] = assertions.map((a) => {
            const { passed, actual } = runAssertion(win, doc, a);
            return {
              description: a.description,
              passed,
              expected: describeExpected(a),
              actual,
            };
          });

          finish({ output: "", error: null, tests: results });
        } catch (e) {
          finish({
            output: "",
            error: e instanceof Error ? e.message : "Ошибка при проверке разметки.",
            tests: assertions.map((a) => ({
              description: a.description,
              passed: false,
              expected: describeExpected(a),
              actual: "ошибка",
            })),
          });
        }
      };

      iframe.srcdoc = code;
      document.body.appendChild(iframe);
    });
  }

  destroy(): void {
    if (this.iframe) {
      try { this.iframe.remove(); } catch { /* noop */ }
      this.iframe = null;
    }
  }
}
