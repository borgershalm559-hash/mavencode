// Test shape for I/O-based lessons (Python, JS, quiz).
export interface IoTest {
  input: string;
  expected: string;
  description: string;
}

// DOM assertion for HTML lessons.
export type HtmlAssertion =
  | { kind: "exists";       selector: string;                                 description: string }
  | { kind: "count";        selector: string; n: number;                      description: string }
  | { kind: "text";         selector: string; equals: string;                 description: string }
  | { kind: "textContains"; selector: string; contains: string;               description: string }
  | { kind: "attr";         selector: string; name: string; equals: string;   description: string }
  | { kind: "attrExists";   selector: string; name: string;                   description: string };

// Union — what gets passed into a runner.
export type Test = IoTest | HtmlAssertion;

export interface TestResult {
  description: string;
  passed: boolean;
  expected: string;
  actual: string;
}

export interface RunResult {
  output: string;
  error: string | null;
  tests: TestResult[];
}

export interface CodeRunner {
  run(code: string, tests: Test[]): Promise<RunResult>;
  destroy(): void;
}
