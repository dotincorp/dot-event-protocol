import { describe, expect, it } from "vitest";
import invalidRawContent from "../fixtures/invalid/raw-content-in-attributes.json" with {
  type: "json",
};
import validActivity from "../fixtures/valid/activity-completed.v1.json" with {
  type: "json",
};
import validAssessment from "../fixtures/valid/assessment-attempt-completed.v1.json" with {
  type: "json",
};
import validDocument from "../fixtures/valid/document-export-completed.v1.json" with {
  type: "json",
};
import { validateDotEvent } from "../src/index.js";

describe("cross-platform conformance fixtures", () => {
  it.each([
    ["activity", validActivity],
    ["assessment", validAssessment],
    ["document", validDocument],
  ])("accepts the %s fixture", (_name, fixture) => {
    expect(validateDotEvent(fixture)).toEqual([]);
  });

  it("rejects nested raw content in flat analytics attributes", () => {
    expect(validateDotEvent(invalidRawContent)).toContainEqual({
      path: "$.data.attributes.rawDocument",
      message: "Attribute values must be scalar values.",
    });
  });
});

