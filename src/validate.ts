import { getEventDefinition } from "./catalog.js";
import {
  CLOUD_EVENTS_SPEC_VERSION,
  DOT_EVENT_PROTOCOL_VERSION,
  DOT_EVENT_TYPE_PATTERN,
  ISO_COUNTRY_CODE_PATTERN,
  ISO_REGION_CODE_PATTERN,
  type AttributeValue,
  type DotEvent,
} from "./types.js";

export interface ValidationIssue {
  readonly path: string;
  readonly message: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isAttributeValue(value: unknown): value is AttributeValue {
  return (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

/**
 * The JSON Schema declares `additionalProperties: false` at every level, so the
 * SDK validator has to reject unknown keys too or the two disagree.
 */
function collectUnknownKeys(
  record: Readonly<Record<string, unknown>>,
  allowed: readonly string[],
  path: string,
): readonly ValidationIssue[] {
  return Object.keys(record)
    .filter((key) => !allowed.includes(key))
    .map((key) => ({ path: `${path}.${key}`, message: "Unknown field is not allowed." }));
}

const ENVELOPE_KEYS = [
  "specversion",
  "id",
  "source",
  "type",
  "time",
  "subject",
  "dataschema",
  "dot",
  "data",
] as const;

const METADATA_KEYS = [
  "protocolVersion",
  "eventVersion",
  "lane",
  "privacyClass",
  "profile",
  "producer",
  "countryCode",
  "regionCode",
  "tenantId",
  "sessionId",
  "correlationId",
  "causationId",
] as const;

const PRODUCER_KEYS = ["app", "appVersion", "platform", "deviceModel", "osVersion"] as const;

const DATA_KEYS = [
  "actor",
  "action",
  "object",
  "context",
  "outcome",
  "attributes",
  "details",
] as const;

export function validateDotEvent(value: unknown): readonly ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!isRecord(value)) {
    return [{ path: "$", message: "Event must be an object." }];
  }

  if (value.specversion !== CLOUD_EVENTS_SPEC_VERSION) {
    issues.push({ path: "$.specversion", message: "CloudEvents specversion must be 1.0." });
  }

  if (typeof value.id !== "string" || value.id.length === 0) {
    issues.push({ path: "$.id", message: "Event id must be a non-empty string." });
  }

  if (typeof value.source !== "string" || value.source.length === 0) {
    issues.push({ path: "$.source", message: "Event source must be a non-empty string." });
  }

  if (typeof value.type !== "string" || !DOT_EVENT_TYPE_PATTERN.test(value.type)) {
    issues.push({ path: "$.type", message: "Event type must use the com.dot.*.vN convention." });
  }

  if (typeof value.time !== "string" || Number.isNaN(Date.parse(value.time))) {
    issues.push({ path: "$.time", message: "Event time must be an ISO-8601 timestamp." });
  }

  if (!isNonEmptyString(value.dataschema)) {
    issues.push({ path: "$.dataschema", message: "Event dataschema must be a non-empty URI." });
  }

  if (value.subject !== undefined && !isNonEmptyString(value.subject)) {
    issues.push({ path: "$.subject", message: "Event subject must be a non-empty string." });
  }

  issues.push(...collectUnknownKeys(value, ENVELOPE_KEYS, "$"));

  const definition = typeof value.type === "string" ? getEventDefinition(value.type) : undefined;
  if (!definition) {
    issues.push({ path: "$.type", message: "Event type is not registered in the catalog." });
  }

  if (!isRecord(value.dot)) {
    issues.push({ path: "$.dot", message: "Dot metadata must be an object." });
  } else {
    if (value.dot.protocolVersion !== DOT_EVENT_PROTOCOL_VERSION) {
      issues.push({ path: "$.dot.protocolVersion", message: "Unsupported protocol version." });
    }

    if (definition && value.dot.eventVersion !== definition.version) {
      issues.push({ path: "$.dot.eventVersion", message: "Event version does not match catalog." });
    }

    if (definition && value.dot.lane !== definition.lane) {
      issues.push({ path: "$.dot.lane", message: "Telemetry lane does not match catalog." });
    }

    if (definition && value.dot.privacyClass !== definition.privacyClass) {
      issues.push({ path: "$.dot.privacyClass", message: "Privacy class does not match catalog." });
    }

    if (definition && value.dot.profile !== definition.profile) {
      issues.push({ path: "$.dot.profile", message: "Profile does not match catalog." });
    }

    if (!isRecord(value.dot.producer)) {
      issues.push({ path: "$.dot.producer", message: "Producer metadata must be an object." });
    } else {
      for (const field of ["app", "appVersion", "platform"] as const) {
        if (!isNonEmptyString(value.dot.producer[field])) {
          issues.push({
            path: `$.dot.producer.${field}`,
            message: "Producer field must be a non-empty string.",
          });
        }
      }

      issues.push(...collectUnknownKeys(value.dot.producer, PRODUCER_KEYS, "$.dot.producer"));
    }

    if (
      value.dot.countryCode !== undefined &&
      (typeof value.dot.countryCode !== "string" || !ISO_COUNTRY_CODE_PATTERN.test(value.dot.countryCode))
    ) {
      issues.push({
        path: "$.dot.countryCode",
        message: "Country code must be uppercase ISO 3166-1 alpha-2.",
      });
    }

    if (
      value.dot.regionCode !== undefined &&
      (typeof value.dot.regionCode !== "string" || !ISO_REGION_CODE_PATTERN.test(value.dot.regionCode))
    ) {
      issues.push({
        path: "$.dot.regionCode",
        message: "Region code must be uppercase ISO 3166-2.",
      });
    } else if (
      typeof value.dot.regionCode === "string" &&
      typeof value.dot.countryCode === "string" &&
      !value.dot.regionCode.startsWith(`${value.dot.countryCode}-`)
    ) {
      issues.push({
        path: "$.dot.regionCode",
        message: "Region code must belong to the configured country code.",
      });
    }

    issues.push(...collectUnknownKeys(value.dot, METADATA_KEYS, "$.dot"));
  }

  if (!isRecord(value.data)) {
    issues.push({ path: "$.data", message: "Event data must be an object." });
  } else {
    if (typeof value.data.action !== "string" || value.data.action.length === 0) {
      issues.push({ path: "$.data.action", message: "Action must be a non-empty string." });
    }

    if (value.data.attributes !== undefined) {
      if (!isRecord(value.data.attributes)) {
        issues.push({ path: "$.data.attributes", message: "Attributes must be an object." });
      } else {
        for (const [name, attributeValue] of Object.entries(value.data.attributes)) {
          if (!isAttributeValue(attributeValue)) {
            issues.push({
              path: `$.data.attributes.${name}`,
              message: "Attribute values must be scalar values.",
            });
          }
        }
      }
    }

    issues.push(...collectUnknownKeys(value.data, DATA_KEYS, "$.data"));
  }

  return issues;
}

export function assertDotEvent(value: unknown): asserts value is DotEvent {
  const issues = validateDotEvent(value);
  if (issues.length > 0) {
    const summary = issues.map((issue) => `${issue.path}: ${issue.message}`).join("; ");
    throw new Error(`Invalid Dot event: ${summary}`);
  }
}
