import type { CodeRunner, Test, RunResult, TestResult } from "./types";

declare global {
  interface Window {
    loadPyodide?: (config: { indexURL: string }) => Promise<PyodideInterface>;
  }
}

interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>;
  runPython: (code: string) => unknown;
  globals: { get: (key: string) => unknown };
}

let pyodideInstance: PyodideInterface | null = null;
let pyodideLoading: Promise<PyodideInterface> | null = null;

const PYODIDE_CDN = "https://cdn.jsdelivr.net/pyodide/v0.27.5/full/";

export type PyodideLoadingStatus = "loading" | "ready" | "error";

let statusCallback: ((status: PyodideLoadingStatus) => void) | null = null;

export function onPyodideLoadingStatus(cb: (status: PyodideLoadingStatus) => void) {
  statusCallback = cb;
  if (pyodideInstance) cb("ready");
}

async function loadPyodideInstance(): Promise<PyodideInterface> {
  if (pyodideInstance) return pyodideInstance;
  if (pyodideLoading) return pyodideLoading;

  pyodideLoading = (async () => {
    statusCallback?.("loading");
    // Load Pyodide script from CDN
    if (!window.loadPyodide) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = `${PYODIDE_CDN}pyodide.js`;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Pyodide"));
        document.head.appendChild(script);
      });
    }

    const pyodide = await window.loadPyodide!({ indexURL: PYODIDE_CDN });
    pyodideInstance = pyodide;
    statusCallback?.("ready");
    return pyodide;
  })().catch((e) => {
    statusCallback?.("error");
    pyodideLoading = null;
    throw e;
  });

  return pyodideLoading;
}

export class PythonRunner implements CodeRunner {
  async run(code: string, tests: Test[]): Promise<RunResult> {
    const results: TestResult[] = [];
    let output = "";
    let error: string | null = null;

    try {
      const pyodide = await Promise.race([
        loadPyodideInstance(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Pyodide загружается слишком долго. Попробуйте ещё раз.")), 30000)
        ),
      ]);

      // Capture stdout
      pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
`);

      // Run user code
      try {
        await pyodide.runPythonAsync(code);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        error = msg;
        return { output: "", error, tests: [] };
      }

      // Get stdout
      output = String(pyodide.runPython("sys.stdout.getvalue()"));

      // Run tests
      for (const test of tests) {
        try {
          const actual = String(await pyodide.runPythonAsync(test.input));
          results.push({
            description: test.description,
            passed: actual === test.expected,
            expected: test.expected,
            actual,
          });
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : String(e);
          results.push({
            description: test.description,
            passed: false,
            expected: test.expected,
            actual: "Error: " + msg,
          });
        }
      }

      // Reset stdout
      pyodide.runPython("sys.stdout = sys.__stdout__");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      error = msg;
    }

    return { output, error, tests: results };
  }

  destroy() {
    // Pyodide instance is cached globally — no cleanup needed per run
  }
}
