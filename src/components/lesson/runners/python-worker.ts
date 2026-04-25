/// <reference lib="webworker" />
// Runs in a dedicated Web Worker — no DOM, no main-thread access.
// Pyodide is loaded once and reused across all run() calls.

import type { Test, IoTest, RunResult } from "./types";

interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>;
  runPython: (code: string) => unknown;
}

// importScripts is the standard way to load scripts inside a Worker.
declare function importScripts(...urls: string[]): void;
declare function loadPyodide(config: { indexURL: string }): Promise<PyodideInterface>;

const PYODIDE_CDN = "https://cdn.jsdelivr.net/pyodide/v0.27.5/full/";

let pyodideInstance: PyodideInterface | null = null;

async function getPyodide(): Promise<PyodideInterface> {
  if (pyodideInstance) return pyodideInstance;
  importScripts(`${PYODIDE_CDN}pyodide.js`);
  pyodideInstance = await loadPyodide({ indexURL: PYODIDE_CDN });
  return pyodideInstance;
}

self.onmessage = async (event: MessageEvent) => {
  const { id, code, tests } = event.data as { id: number; code: string; tests: Test[] };
  // Python runner only handles IoTest-shaped tests.
  const ioTests = tests as IoTest[];
  let result: RunResult;

  try {
    const pyodide = await getPyodide();

    pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
`);

    try {
      await pyodide.runPythonAsync(code);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      self.postMessage({ id, result: { output: "", error: msg, tests: [] } });
      return;
    }

    const output = String(pyodide.runPython("sys.stdout.getvalue()"));
    const testResults = [];

    for (const test of ioTests) {
      try {
        const actual = String(await pyodide.runPythonAsync(test.input));
        testResults.push({
          description: test.description,
          passed: actual === test.expected,
          expected: test.expected,
          actual,
        });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        testResults.push({
          description: test.description,
          passed: false,
          expected: test.expected,
          actual: "Error: " + msg,
        });
      }
    }

    pyodide.runPython("sys.stdout = sys.__stdout__");
    result = { output, error: null, tests: testResults };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    result = { output: "", error: msg, tests: [] };
  }

  self.postMessage({ id, result });
};
