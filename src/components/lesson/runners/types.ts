export interface Test {
  input: string;
  expected: string;
  description: string;
}

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
