import { describe, expect, it, vi } from "vitest";
import { HttpBatchEventSink, createHttpSink } from "../src/transport.js";
import { DotEventClient, MemoryEventSink, type DotEvent } from "../src/index.js";

const runtime = { createId: () => "event-0001", now: () => "2026-08-20T12:00:00.000Z" };

function event(id: string): DotEvent {
  const client = new DotEventClient(
    {
      source: "dot://mini-games/web",
      schemaBaseUrl: "https://schemas.dot/event/v0.1",
      producer: { app: "dot-mini-games", appVersion: "1.0.0", platform: "web" },
    },
    { ...runtime, createId: () => id },
    new MemoryEventSink(),
  );
  return client.create("com.dot.activity.completed.v1", {
    action: "completed",
    outcome: { status: "success" },
  });
}

function okFetch() {
  const calls: { events: DotEvent[] }[] = [];
  const impl = vi.fn(async (_url: unknown, init?: RequestInit) => {
    calls.push(JSON.parse(String(init?.body)) as { events: DotEvent[] });
    return new Response(null, { status: 202 });
  }) as unknown as typeof fetch;
  return { impl, calls };
}

describe("reference HTTP transport", () => {
  it("batches instead of one request per event", async () => {
    const { impl, calls } = okFetch();
    const sink = new HttpBatchEventSink({ endpoint: "http://x/v1/events", fetchImpl: impl, maxBatchSize: 3 });

    for (const id of ["a", "b", "c"]) sink.emit(event(id));
    await sink.flush();

    expect(calls).toHaveLength(1);
    expect(calls[0]?.events).toHaveLength(3);
  });

  it("sends the wire shape the gateway accepts", async () => {
    const { impl, calls } = okFetch();
    const sink = new HttpBatchEventSink({ endpoint: "http://x/v1/events", fetchImpl: impl });

    sink.emit(event("a"));
    await sink.flush();

    expect(Object.keys(calls[0] ?? {})).toEqual(["events"]);
  });

  it("never throws into the product when delivery fails", async () => {
    const failing = vi.fn(async () => {
      throw new Error("offline");
    }) as unknown as typeof fetch;
    const errors: unknown[] = [];
    const sink = new HttpBatchEventSink({
      endpoint: "http://x/v1/events",
      fetchImpl: failing,
      onError: (error) => errors.push(error),
    });

    expect(() => sink.emit(event("a"))).not.toThrow();
    await expect(sink.flush()).resolves.toBeUndefined();
    expect(errors).toHaveLength(1);
  });

  it("keeps failed events for a retry with the same id", async () => {
    let attempt = 0;
    const flaky = vi.fn(async (_url: unknown, init?: RequestInit) => {
      attempt += 1;
      if (attempt === 1) throw new Error("offline");
      return new Response(String(init?.body), { status: 202 });
    }) as unknown as typeof fetch;

    const sink = new HttpBatchEventSink({ endpoint: "http://x/v1/events", fetchImpl: flaky });
    sink.emit(event("a"));

    await sink.flush();
    expect(sink.pending).toBe(1);

    await sink.flush();
    // Same source+id on the retry is what lets the gateway de-duplicate.
    expect(sink.pending).toBe(0);
  });

  it("treats a gateway error status as a failure worth retrying", async () => {
    const rejecting = vi.fn(async () => new Response(null, { status: 500 })) as unknown as typeof fetch;
    const sink = new HttpBatchEventSink({ endpoint: "http://x/v1/events", fetchImpl: rejecting });

    sink.emit(event("a"));
    await sink.flush();

    expect(sink.pending).toBe(1);
  });

  it("bounds the queue instead of growing forever offline", async () => {
    const failing = vi.fn(async () => {
      throw new Error("offline");
    }) as unknown as typeof fetch;
    const sink = new HttpBatchEventSink({
      endpoint: "http://x/v1/events",
      fetchImpl: failing,
      maxQueueSize: 5,
      maxBatchSize: 100,
    });

    for (let index = 0; index < 20; index += 1) sink.emit(event(`e${index}`));

    // A device that never reconnects must not accumulate without limit.
    expect(sink.pending).toBeLessThanOrEqual(5);
    expect(sink.dropped).toBeGreaterThan(0);
  });

  it("stops accepting events once closed", async () => {
    const { impl, calls } = okFetch();
    const sink = new HttpBatchEventSink({ endpoint: "http://x/v1/events", fetchImpl: impl });

    sink.emit(event("a"));
    await sink.close();
    sink.emit(event("b"));
    await sink.flush();

    expect(calls.flatMap((call) => call.events)).toHaveLength(1);
  });

  it("builds nothing when no endpoint is configured", () => {
    // A product without collection configured should send nothing, not guess.
    expect(createHttpSink(undefined)).toBeUndefined();
    expect(createHttpSink("   ")).toBeUndefined();
    expect(createHttpSink("http://x/v1/events")).toBeInstanceOf(HttpBatchEventSink);
  });
});
