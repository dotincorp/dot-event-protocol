import { describe, expect, it } from "vitest";
import {
  DOT_EVENT_TYPE_PATTERN,
  DotEventClient,
  MemoryEventSink,
  eventCatalog,
  listEventDefinitions,
  validateDotEvent,
} from "../src/index.js";

const runtime = {
  createId: () => "event-0001",
  now: () => "2026-08-11T12:00:00.000Z",
};

describe("Dot Event Protocol", () => {
  it("creates and emits a catalog-backed CloudEvent", async () => {
    const sink = new MemoryEventSink();
    const client = new DotEventClient(
      {
        source: "dot://mini-games/web",
        schemaBaseUrl: "https://schemas.dot/event/v0.1",
        producer: {
          app: "dot-mini-games",
          appVersion: "1.0.0",
          platform: "web",
        },
        countryCode: "KR",
        regionCode: "KR-11",
        tenantId: "tenant-01",
        sessionId: "session-01",
      },
      runtime,
      sink,
    );

    const event = await client.emit("com.dot.activity.completed.v1", {
      actor: { type: "user", id: "pseudonymous-user" },
      action: "completed",
      object: { type: "game.round", id: "round-01" },
      outcome: { status: "success", durationMs: 42_000, score: 850 },
    });

    expect(event.specversion).toBe("1.0");
    expect(event.dot.profile).toBe("activity");
    expect(event.dot.lane).toBe("product");
    expect(event.dot.countryCode).toBe("KR");
    expect(event.dot.regionCode).toBe("KR-11");
    expect(sink.events).toEqual([event]);
    expect(validateDotEvent(event)).toEqual([]);
  });

  it("rejects unregistered and malformed events", () => {
    const issues = validateDotEvent({
      specversion: "1.0",
      id: "event-1",
      source: "dot://unknown/web",
      type: "com.dot.unknown.dynamic-user.v1",
      time: "not-a-time",
      dot: {},
      data: { action: "" },
    });

    expect(issues.some((issue) => issue.path === "$.type")).toBe(true);
    expect(issues.some((issue) => issue.path === "$.time")).toBe(true);
    expect(issues.some((issue) => issue.path === "$.data.action")).toBe(true);
  });

  it("keeps catalog names versioned, stable, and unique", () => {
    const definitions = listEventDefinitions();
    const names = definitions.map(({ name }) => name);

    expect(new Set(names).size).toBe(names.length);
    expect(names).toEqual(Object.keys(eventCatalog));
    for (const name of names) {
      expect(DOT_EVENT_TYPE_PATTERN.test(name)).toBe(true);
      expect(name.endsWith(".v1")).toBe(true);
    }
  });

  it("rejects nested analytics attributes", async () => {
    const sink = new MemoryEventSink();
    const client = new DotEventClient(
      {
        source: "dot://document/web",
        schemaBaseUrl: "https://schemas.dot/event/v0.1",
        producer: { app: "dot-document", appVersion: "1.0.0", platform: "web" },
      },
      runtime,
      sink,
    );

    const event = client.create("com.dot.operation.completed.v1", {
      action: "exported",
      attributes: { format: "dtms-v2" },
    });
    const unsafe = {
      ...event,
      data: { ...event.data, attributes: { nested: { raw: "content" } } },
    };

    expect(validateDotEvent(event)).toEqual([]);
    expect(validateDotEvent(unsafe)).toContainEqual({
      path: "$.data.attributes.nested",
      message: "Attribute values must be scalar values.",
    });
  });

  it("rejects a country code that is not uppercase ISO alpha-2", () => {
    const client = new DotEventClient(
      {
        source: "dot://document/web",
        schemaBaseUrl: "https://schemas.dot/event/v0.1",
        producer: { app: "dot-document", appVersion: "1.0.0", platform: "web" },
        countryCode: "kr",
      },
      runtime,
      new MemoryEventSink(),
    );
    const event = client.create("com.dot.operation.completed.v1", { action: "exported" });

    expect(validateDotEvent(event)).toContainEqual({
      path: "$.dot.countryCode",
      message: "Country code must be uppercase ISO 3166-1 alpha-2.",
    });
  });

  it("rejects a malformed region or one outside the configured country", () => {
    const makeWithRegion = (regionCode: string) => new DotEventClient(
      {
        source: "dot://document/web",
        schemaBaseUrl: "https://schemas.dot/event/v0.1",
        producer: { app: "dot-document", appVersion: "1.0.0", platform: "web" },
        countryCode: "KR",
        regionCode,
      },
      runtime,
      new MemoryEventSink(),
    ).create("com.dot.operation.completed.v1", { action: "exported" });

    expect(validateDotEvent(makeWithRegion("kr-11"))).toContainEqual({
      path: "$.dot.regionCode",
      message: "Region code must be uppercase ISO 3166-2.",
    });
    expect(validateDotEvent(makeWithRegion("US-CA"))).toContainEqual({
      path: "$.dot.regionCode",
      message: "Region code must belong to the configured country code.",
    });
  });
});
