import { getEventDefinition, type DotEventName } from "./catalog.js";
import {
  CLOUD_EVENTS_SPEC_VERSION,
  DOT_EVENT_PROTOCOL_VERSION,
  type DomainEventData,
  type DotEvent,
  type DotProducer,
} from "./types.js";

export interface EventRuntime {
  createId(): string;
  now(): string;
}

export interface EventSink {
  emit(event: DotEvent): void | Promise<void>;
}

export interface EventClientContext {
  readonly source: string;
  readonly schemaBaseUrl: string;
  readonly producer: DotProducer;
  readonly countryCode?: string;
  readonly regionCode?: string;
  readonly tenantId?: string;
  readonly sessionId?: string;
  readonly correlationId?: string;
}

export interface EmitOptions {
  readonly subject?: string;
  readonly causationId?: string;
}

export class DotEventClient {
  public constructor(
    private readonly context: EventClientContext,
    private readonly runtime: EventRuntime,
    private readonly sink: EventSink,
  ) {}

  public create<TData extends DomainEventData>(
    type: DotEventName,
    data: TData,
    options: EmitOptions = {},
  ): DotEvent<TData> {
    const definition = getEventDefinition(type);

    if (!definition) {
      throw new Error(`Unknown Dot event type: ${type}`);
    }

    const optionalEnvelope = options.subject === undefined ? {} : { subject: options.subject };
    const optionalMetadata = {
      ...(this.context.countryCode === undefined ? {} : { countryCode: this.context.countryCode }),
      ...(this.context.regionCode === undefined ? {} : { regionCode: this.context.regionCode }),
      ...(this.context.tenantId === undefined ? {} : { tenantId: this.context.tenantId }),
      ...(this.context.sessionId === undefined ? {} : { sessionId: this.context.sessionId }),
      ...(this.context.correlationId === undefined
        ? {}
        : { correlationId: this.context.correlationId }),
      ...(options.causationId === undefined ? {} : { causationId: options.causationId }),
    };

    return {
      specversion: CLOUD_EVENTS_SPEC_VERSION,
      id: this.runtime.createId(),
      source: this.context.source,
      type,
      time: this.runtime.now(),
      ...optionalEnvelope,
      dataschema: `${this.context.schemaBaseUrl}/${type}.schema.json`,
      dot: {
        protocolVersion: DOT_EVENT_PROTOCOL_VERSION,
        eventVersion: definition.version,
        lane: definition.lane,
        privacyClass: definition.privacyClass,
        profile: definition.profile,
        producer: this.context.producer,
        ...optionalMetadata,
      },
      data,
    };
  }

  public async emit<TData extends DomainEventData>(
    type: DotEventName,
    data: TData,
    options: EmitOptions = {},
  ): Promise<DotEvent<TData>> {
    const event = this.create(type, data, options);
    await this.sink.emit(event);
    return event;
  }
}

export class NoopEventSink implements EventSink {
  public emit(_event: DotEvent): void {}
}

export class MemoryEventSink implements EventSink {
  public readonly events: DotEvent[] = [];

  public emit(event: DotEvent): void {
    this.events.push(event);
  }
}
