import { describe, expect, it, vi } from "vitest";
import { HttpBatchEventSink, createHttpSink } from "../src/transport.js";
import { DotEventClient, MemoryEventSink, type DotEvent } from "../src/index.js";

/**
 * The gateway can require a key, and this is the only way a product has of
 * sending one. Without it, turning the requirement on rejects every product at
 * once, so the behaviour here is what decides whether that is possible at all.
 */
let counter = 0;

function event(): DotEvent {
  counter += 1;
  const client = new DotEventClient(
    {
      source: "dot://key-test/web",
      schemaBaseUrl: "https://schemas.dot/event/v0.1",
      producer: { app: "dot-mini-games", appVersion: "1.0.0", platform: "web" },
    },
    { createId: () => `key-${counter}`, now: () => "2026-08-20T12:00:00.000Z" },
    new MemoryEventSink(),
  );
  return client.create("com.dot.app.session.started.v1", {
    action: "completed",
    actor: { type: "student", id: "student-1" },
  });
}

function capture() {
  const calls: RequestInit[] = [];
  const fetchImpl = vi.fn(async (_url: unknown, init?: RequestInit) => {
    calls.push(init ?? {});
    return new Response(null, { status: 202 });
  }) as unknown as typeof fetch;
  return { calls, fetchImpl };
}

const headersOf = (init: RequestInit): Record<string, string> =>
  init.headers as Record<string, string>;

describe("ingest key", () => {
  it("sends the key as a bearer token", async () => {
    const { calls, fetchImpl } = capture();
    const sink = new HttpBatchEventSink({
      endpoint: "https://gateway.test/v1/events",
      fetchImpl,
      ingestKey: "test-only-key-0000000000000000000000",
    });

    sink.emit(event());
    await sink.flush();

    expect(calls).toHaveLength(1);
    expect(headersOf(calls[0]!).authorization).toBe("Bearer test-only-key-0000000000000000000000");
    expect(headersOf(calls[0]!)["content-type"]).toBe("application/json");
  });

  it("sends no authorization header when there is no key", async () => {
    const { calls, fetchImpl } = capture();
    const sink = new HttpBatchEventSink({ endpoint: "https://gateway.test/v1/events", fetchImpl });

    sink.emit(event());
    await sink.flush();

    expect(headersOf(calls[0]!)).not.toHaveProperty("authorization");
  });

  it.each(["", "   "])("treats a blank key as no key: %s", async (blank) => {
    // A half-configured product would otherwise send "Bearer " and get a 401
    // that reads like a wrong key rather than a missing one.
    const { calls, fetchImpl } = capture();
    const sink = new HttpBatchEventSink({
      endpoint: "https://gateway.test/v1/events",
      fetchImpl,
      ingestKey: blank,
    });

    sink.emit(event());
    await sink.flush();

    expect(headersOf(calls[0]!)).not.toHaveProperty("authorization");
  });

  it("trims a key that arrived with whitespace around it", async () => {
    // Environment variables collect trailing newlines; the gateway compares
    // exactly, so an untrimmed key fails for a reason nobody can see.
    const { calls, fetchImpl } = capture();
    const sink = new HttpBatchEventSink({
      endpoint: "https://gateway.test/v1/events",
      fetchImpl,
      ingestKey: "  test-only-key-0000000000000000000000\n",
    });

    sink.emit(event());
    await sink.flush();

    expect(headersOf(calls[0]!).authorization).toBe("Bearer test-only-key-0000000000000000000000");
  });

  it("passes the key through createHttpSink", async () => {
    const { calls, fetchImpl } = capture();
    const sink = createHttpSink("https://gateway.test/v1/events", {
      fetchImpl,
      ingestKey: "test-only-key-0000000000000000000000",
    });

    expect(sink).toBeDefined();
    sink!.emit(event());
    await sink!.flush();

    expect(headersOf(calls[0]!).authorization).toContain("Bearer ");
  });

  it("keeps the batch when the gateway rejects the key", async () => {
    // A 401 must not lose events: the key can be added and the same events
    // delivered, which is what makes rolling this out survivable.
    const fetchImpl = vi.fn(async () => new Response(null, { status: 401 })) as unknown as typeof fetch;
    const sink = new HttpBatchEventSink({
      endpoint: "https://gateway.test/v1/events",
      fetchImpl,
      onError: () => {},
    });

    sink.emit(event());
    await sink.flush();

    expect(sink.pending).toBe(1);
    expect(sink.dropped).toBe(0);
  });
});
