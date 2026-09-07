import { type DotEventName } from "./catalog.js";
import { type DomainEventData, type DotEvent, type DotProducer } from "./types.js";
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
export declare class DotEventClient {
    private readonly context;
    private readonly runtime;
    private readonly sink;
    constructor(context: EventClientContext, runtime: EventRuntime, sink: EventSink);
    create<TData extends DomainEventData>(type: DotEventName, data: TData, options?: EmitOptions): DotEvent<TData>;
    emit<TData extends DomainEventData>(type: DotEventName, data: TData, options?: EmitOptions): Promise<DotEvent<TData>>;
}
export declare class NoopEventSink implements EventSink {
    emit(_event: DotEvent): void;
}
export declare class MemoryEventSink implements EventSink {
    readonly events: DotEvent[];
    emit(event: DotEvent): void;
}
//# sourceMappingURL=client.d.ts.map