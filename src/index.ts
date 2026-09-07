export {
  eventCatalog,
  getEventDefinition,
  listEventDefinitions,
  type DotEventName,
} from "./catalog.js";
export {
  DotEventClient,
  MemoryEventSink,
  NoopEventSink,
  type EmitOptions,
  type EventClientContext,
  type EventRuntime,
  type EventSink,
} from "./client.js";
export {
  assertDotEvent,
  validateDotEvent,
  type ValidationIssue,
} from "./validate.js";
export * from "./types.js";
export {
  featureCatalog,
  getFeatureDefinition,
  productLabel,
  productLabels,
  type FeatureDefinition,
  type FeatureKey,
} from "./features.js";
export {
  regionLabel,
  regionsByCountry,
  type RegionDefinition,
} from "./regions.js";
