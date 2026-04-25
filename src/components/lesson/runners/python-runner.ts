import type { CodeRunner, Test, RunResult } from "./types";

export type PyodideLoadingStatus = "loading" | "ready" | "error";

let statusCallback: ((status: PyodideLoadingStatus) => void) | null = null;

export function onPyodideLoadingStatus(cb: (status: PyodideLoadingStatus) => void) {
  statusCallback = cb;
}

interface PendingRequest {
  resolve: (r: RunResult) => void;
  reject: (e: Error) => void;
}

export class PythonRunner implements CodeRunner {
  private worker: Worker | null = null;
  private pending = new Map<number, PendingRequest>();
  private nextId = 0;

  private getWorker(): Worker {
    if (this.worker) return this.worker;

    statusCallback?.("loading");

    const worker = new Worker(
      // Webpack / Turbopack bundles this as a separate chunk.
      new URL("./python-worker.ts", import.meta.url),
      { type: "module" },
    );

    worker.onmessage = (event: MessageEvent<{ id: number; result: RunResult }>) => {
      const { id, result } = event.data;
      const req = this.pending.get(id);
      if (!req) return;
      this.pending.delete(id);
      statusCallback?.("ready");
      req.resolve(result);
    };

    worker.onerror = (event: ErrorEvent) => {
      statusCallback?.("error");
      const err = new Error(event.message ?? "Python worker crashed");
      for (const req of this.pending.values()) req.reject(err);
      this.pending.clear();
      this.worker = null;
    };

    this.worker = worker;
    return worker;
  }

  async run(code: string, tests: Test[]): Promise<RunResult> {
    const worker = this.getWorker();
    const id = this.nextId++;

    return new Promise<RunResult>((resolve, reject) => {
      let timer: ReturnType<typeof setTimeout>;

      this.pending.set(id, {
        resolve: (r) => { clearTimeout(timer); resolve(r); },
        reject:  (e) => { clearTimeout(timer); reject(e); },
      });

      timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error("Pyodide загружается слишком долго. Попробуйте ещё раз."));
      }, 30_000);

      worker.postMessage({ id, code, tests });
    });
  }

  destroy() {
    this.worker?.terminate();
    this.worker = null;
    const err = new Error("Runner destroyed");
    for (const req of this.pending.values()) req.reject(err);
    this.pending.clear();
  }
}
