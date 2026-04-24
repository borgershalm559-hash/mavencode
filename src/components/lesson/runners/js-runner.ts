import type { CodeRunner, Test, RunResult, TestResult } from "./types";

export class JsRunner implements CodeRunner {
  private iframe: HTMLIFrameElement | null = null;

  async run(code: string, tests: Test[]): Promise<RunResult> {
    this.destroy();

    return new Promise<RunResult>((resolve) => {
      const iframe = document.createElement("iframe");
      iframe.sandbox.add("allow-scripts");
      iframe.style.display = "none";
      document.body.appendChild(iframe);
      this.iframe = iframe;

      const timeout = setTimeout(() => {
        resolve({
          output: "",
          error: "Превышено время выполнения (5 секунд)",
          tests: [],
        });
        this.destroy();
      }, 5000);

      const handler = (event: MessageEvent) => {
        if (event.source !== iframe.contentWindow) return;
        const data = event.data;
        if (data?.type === "result") {
          clearTimeout(timeout);
          window.removeEventListener("message", handler);
          resolve({
            output: data.output || "",
            error: data.error || null,
            tests: data.tests || [],
          });
        }
      };

      window.addEventListener("message", handler);

      const testsJson = JSON.stringify(tests);

      const srcdoc = `<!DOCTYPE html><html><body><script>
(function() {
  const logs = [];
  const origLog = console.log;
  console.log = function(...args) {
    logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
  };

  const tests = ${testsJson};
  const userCode = ${JSON.stringify(code)};
  const results = [];
  let error = null;

  // Sanity-check: run user code once to catch syntax errors early
  try {
    new Function(userCode)();
  } catch (e) {
    error = e.message;
  }

  if (!error) {
    for (const test of tests) {
      try {
        // Run user code + test expression in the SAME scope so user's
        // functions/variables are accessible inside the test expression.
        const combined = userCode + '\\n;return (' + test.input + ');';
        const actual = new Function(combined)();
        const actualStr = typeof actual === 'object' && actual !== null
          ? JSON.stringify(actual)
          : String(actual);
        results.push({
          description: test.description,
          passed: actualStr === test.expected,
          expected: test.expected,
          actual: actualStr,
        });
      } catch (e) {
        results.push({
          description: test.description,
          passed: false,
          expected: test.expected,
          actual: 'Error: ' + e.message,
        });
      }
    }
  }

  parent.postMessage({ type: 'result', output: logs.join('\\n'), error, tests: results }, '*');
})();
<\/script></body></html>`;

      iframe.srcdoc = srcdoc;
    });
  }

  destroy() {
    if (this.iframe) {
      this.iframe.remove();
      this.iframe = null;
    }
  }
}
