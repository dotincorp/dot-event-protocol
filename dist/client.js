import { getEventDefinition } from "./catalog.js";
import { CLOUD_EVENTS_SPEC_VERSION, DOT_EVENT_PROTOCOL_VERSION, } from "./types.js";
export class DotEventClient {
    context;
    runtime;
    sink;
    constructor(context, runtime, sink) {
        this.context = context;
        this.runtime = runtime;
        this.sink = sink;
    }
    create(type, data, options = {}) {
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
    async emit(type, data, options = {}) {
        const event = this.create(type, data, options);
        await this.sink.emit(event);
        return event;
    }
}
export class NoopEventSink {
    emit(_event) { }
}
export class MemoryEventSink {
    events = [];
    emit(event) {
        this.events.push(event);
    }
}
//# sourceMappingURL=client.js.map