import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import _Ajv2020 from "ajv/dist/2020.js";
import _addFormats from "ajv-formats";
import { describe, expect, it } from "vitest";
import { validateDotEvent } from "../src/index.js";

// ajv ships CommonJS, so the default export has to be unwrapped under NodeNext.
const Ajv2020 = _Ajv2020 as unknown as typeof _Ajv2020.default;
const addFormats = _addFormats as unknown as typeof _addFormats.default;

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const schemaPath = join(repoRoot, "schemas/v0.1/dot-event-envelope.schema.json");
const envelopeSchema = JSON.parse(readFileSync(schemaPath, "utf8")) as object;

// `attributes` intentionally declares a scalar union, which strict mode flags by default.
const ajv = new Ajv2020({ allErrors: true, strict: true, allowUnionTypes: true });
addFormats(ajv);
const validateEnvelope = ajv.compile(envelopeSchema);

function loadFixtures(kind: "valid" | "invalid"): readonly (readonly [string, unknown])[] {
  const dir = join(repoRoot, "fixtures", kind);
  return readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => [name, JSON.parse(readFileSync(join(dir, name), "utf8")) as unknown] as const);
}

const validFixtures = loadFixtures("valid");
const invalidFixtures = loadFixtures("invalid");

describe("JSON Schema is the authoritative contract", () => {
  it("compiles the published envelope schema", () => {
    expect(validateEnvelope).toBeTypeOf("function");
  });

  it.each(validFixtures)("accepts %s against the JSON Schema", (_name, fixture) => {
    const ok = validateEnvelope(fixture);
    expect(validateEnvelope.errors ?? []).toEqual([]);
    expect(ok).toBe(true);
  });

  it.each(invalidFixtures)("rejects %s against the JSON Schema", (_name, fixture) => {
    expect(validateEnvelope(fixture)).toBe(false);
  });
});

describe("SDK validator agrees with the JSON Schema", () => {
  it.each([...validFixtures, ...invalidFixtures])(
    "reaches the same verdict for %s",
    (_name, fixture) => {
      const schemaAccepts = validateEnvelope(fixture);
      const sdkAccepts = validateDotEvent(fixture).length === 0;
      expect(sdkAccepts).toBe(schemaAccepts);
    },
  );

  it("rejects envelope fields the schema does not allow", () => {
    const [, base] = validFixtures[0]!;
    const withUnknownField = { ...(base as Record<string, unknown>), unexpected: "value" };

    expect(validateEnvelope(withUnknownField)).toBe(false);
    expect(validateDotEvent(withUnknownField).length).toBeGreaterThan(0);
  });

  it("rejects a producer that is missing required fields", () => {
    const [, base] = validFixtures[0]!;
    const event = base as Record<string, unknown>;
    const dot = event.dot as Record<string, unknown>;
    const broken = { ...event, dot: { ...dot, producer: { app: "dot-canvas" } } };

    expect(validateEnvelope(broken)).toBe(false);
    expect(validateDotEvent(broken).length).toBeGreaterThan(0);
  });

  it("rejects a missing dataschema", () => {
    const [, base] = validFixtures[0]!;
    const { dataschema: _dropped, ...withoutSchema } = base as Record<string, unknown>;

    expect(validateEnvelope(withoutSchema)).toBe(false);
    expect(validateDotEvent(withoutSchema).length).toBeGreaterThan(0);
  });

  it("rejects a profile that contradicts the catalog", () => {
    const [, base] = validFixtures[0]!;
    const event = base as Record<string, unknown>;
    const dot = event.dot as Record<string, unknown>;
    const mismatched = { ...event, dot: { ...dot, profile: "operational" } };

    expect(validateDotEvent(mismatched).length).toBeGreaterThan(0);
  });

  it("accepts uppercase country codes and rejects lowercase ones", () => {
    const [, base] = validFixtures[0]!;
    const event = base as Record<string, unknown>;
    const dot = event.dot as Record<string, unknown>;
    const valid = { ...event, dot: { ...dot, countryCode: "KR" } };
    const invalid = { ...event, dot: { ...dot, countryCode: "kr" } };

    expect(validateEnvelope(valid)).toBe(true);
    expect(validateDotEvent(valid)).toEqual([]);
    expect(validateEnvelope(invalid)).toBe(false);
    expect(validateDotEvent(invalid).length).toBeGreaterThan(0);
  });

  it("accepts uppercase subdivision codes and rejects lowercase ones", () => {
    const [, base] = validFixtures[0]!;
    const event = base as Record<string, unknown>;
    const dot = event.dot as Record<string, unknown>;
    const valid = { ...event, dot: { ...dot, countryCode: "KR", regionCode: "KR-11" } };
    const invalid = { ...event, dot: { ...dot, countryCode: "KR", regionCode: "kr-11" } };

    expect(validateEnvelope(valid)).toBe(true);
    expect(validateDotEvent(valid)).toEqual([]);
    expect(validateEnvelope(invalid)).toBe(false);
    expect(validateDotEvent(invalid).length).toBeGreaterThan(0);
  });
});
