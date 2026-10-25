// A minimal Chrome DevTools Protocol client for the screenshot capture (PHASE-2.md step 8), after the Hanon fan
// site's scripts/perf/cdp.js: launches the installed Chrome headless with a debugging port and drives one page over
// Node's built-in WebSocket. No Puppeteer, no browser download.

import { spawn, type ChildProcess } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const CHROME =
  process.env.CHROME ??
  (process.platform === "win32" ? "C:/Program Files/Google/Chrome/Application/chrome.exe" : "/usr/bin/google-chrome");

type Message = { id?: number; method?: string; params?: Record<string, unknown>; result?: Record<string, unknown>; error?: { message: string } };

export type Page = {
  send: <T = Record<string, unknown>>(method: string, params?: Record<string, unknown>) => Promise<T>;
  /** Evaluates an expression in the page (awaits promises) and returns its value. */
  eval: <T = unknown>(expression: string) => Promise<T>;
  /** Waits until an expression is truthy, checking every 200 ms. */
  waitFor: (expression: string, timeoutMs?: number) => Promise<void>;
  on: (method: string, handler: (params: Record<string, unknown>) => void) => void;
  close: () => void;
};

export async function launchChrome(): Promise<{ newPage: () => Promise<Page>; close: () => Promise<void> }> {
  const profile = mkdtempSync(join(tmpdir(), "tabane-chrome-"));
  const port = 9400 + Math.floor(Math.random() * 400);
  const chrome: ChildProcess = spawn(
    CHROME,
    [
      "--headless=new",
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profile}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--hide-scrollbars",
      "--mute-audio",
      "--disable-extensions",
      "about:blank",
    ],
    { stdio: "ignore" },
  );
  const base = `http://127.0.0.1:${port}`;
  for (let i = 0; ; i++) {
    try {
      await (await fetch(`${base}/json/version`)).json();
      break;
    } catch {
      if (i > 50) throw new Error(`Chrome didn't start (${CHROME}); set CHROME to its path`);
      await sleep(200);
    }
  }

  async function newPage(): Promise<Page> {
    const target = (await (await fetch(`${base}/json/new?about:blank`, { method: "PUT" })).json()) as { webSocketDebuggerUrl: string };
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise<void>((resolve, reject) => {
      ws.onopen = () => resolve();
      ws.onerror = () => reject(new Error("could not connect to the page"));
    });
    let nextId = 0;
    const pending = new Map<number, { resolve: (v: unknown) => void; reject: (e: Error) => void }>();
    const handlers = new Map<string, ((params: Record<string, unknown>) => void)[]>();
    ws.onmessage = (event) => {
      const msg = JSON.parse(String(event.data)) as Message;
      if (msg.id !== undefined) {
        const p = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) p?.reject(new Error(msg.error.message));
        else p?.resolve(msg.result);
      } else if (msg.method) handlers.get(msg.method)?.forEach((h) => h(msg.params ?? {}));
    };
    const send = <T,>(method: string, params: Record<string, unknown> = {}) =>
      new Promise<T>((resolve, reject) => {
        const id = ++nextId;
        pending.set(id, { resolve: resolve as (v: unknown) => void, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });
    const evaluate = async <T,>(expression: string) => {
      const r = await send<{ result: { value?: T }; exceptionDetails?: { exception?: { description?: string }; text: string } }>("Runtime.evaluate", {
        expression,
        awaitPromise: true,
        returnByValue: true,
      });
      if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text);
      return r.result.value as T;
    };
    await Promise.all([send("Page.enable"), send("Runtime.enable"), send("Network.enable")]);
    return {
      send,
      eval: evaluate,
      async waitFor(expression, timeoutMs = 20_000) {
        const until = Date.now() + timeoutMs;
        while (!(await evaluate<boolean>(`Boolean(${expression})`))) {
          if (Date.now() > until) throw new Error(`timed out waiting for ${expression}`);
          await sleep(200);
        }
      },
      on(method, handler) {
        handlers.set(method, [...(handlers.get(method) ?? []), handler]);
      },
      close: () => ws.close(),
    };
  }

  return {
    newPage,
    async close() {
      chrome.kill();
      await sleep(300);
      try {
        rmSync(profile, { recursive: true, force: true });
      } catch {
        /* Chrome may still hold the folder on Windows; it's in the temp directory */
      }
    },
  };
}
