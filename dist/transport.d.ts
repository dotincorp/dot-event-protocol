import type { DotEvent } from "./types.js";
import type { EventSink } from "./client.js";
/**
 * Reference HTTP transport.
 *
 * This is not part of the contract — it is reachable only as
 * `@dot/event-protocol/transport`, and a product is free to write its own. It
 * exists so the four rules the routing policy puts on producers are implemented
 * once rather than copied into every app: batch, retry, keep a bounded offline
 * queue, and never let delivery failure surface into the product.
 *
 * Platform-specific queues (IndexedDB, AsyncStorage, WorkManager, BackgroundTasks)
 * still belong in the product. This covers the common case of "POST a batch and
 * do not break anything if it fails".
 */
export interface HttpBatchSinkOptions {
    /** Collection endpoint, e.g. `https://gateway.example/v1/events`. */
    readonly endpoint: string;
    readonly fetchImpl?: typeof fetch;
    /** Events per request. */
    readonly maxBatchSize?: number;
    /** How long an event may wait before it is sent anyway. */
    readonly flushIntervalMs?: number;
    /**
     * Hard ceiling on the queue. The oldest events are dropped first: losing the
     * start of a long offline session is better than growing without bound on a
     * device that never reconnects.
     */
    readonly maxQueueSize?: number;
    /**
     * Key the gateway accepts for this product, sent as a bearer token.
     *
     * It is bound to one app there, so a key cannot file events under another
     * product's name. Omit it and the request carries no key: a gateway that
     * requires one answers 401 and the batch is retried, not lost.
     *
     * A key shipped to a browser is not a secret -- anyone can read it from the
     * network tab. It raises the bar from "anyone who finds the URL" to "anyone
     * who opens the app", which is worth having and is not authentication. A
     * product whose events pass through a server of its own should keep the key
     * there and leave this unset in the browser.
     */
    readonly ingestKey?: string;
    /** Called for delivery failures and drops. Never rethrown into the product. */
    readonly onError?: (error: unknown) => void;
    /** Injected for tests. */
    readonly setTimeoutImpl?: typeof setTimeout;
    readonly clearTimeoutImpl?: typeof clearTimeout;
}
export declare class HttpBatchEventSink implements EventSink {
    private readonly queue;
    private timer;
    private inFlight;
    private closed;
    private droppedCount;
    private readonly endpoint;
    private readonly fetchImpl;
    private readonly maxBatchSize;
    private readonly flushIntervalMs;
    private readonly maxQueueSize;
    private readonly headers;
    private readonly onError;
    private readonly setTimeoutImpl;
    private readonly clearTimeoutImpl;
    constructor(options: HttpBatchSinkOptions);
    /** How many events were dropped because the queue was full. */
    get dropped(): number;
    get pending(): number;
    /**
     * Queue one event. Returns immediately and never throws: a product action must
     * not be able to fail because analytics did.
     */
    emit(event: DotEvent): void;
    private schedule;
    /** Send what is queued. Safe to call at any time; failures stay inside. */
    flush(): Promise<void>;
    private send;
    /** Stop accepting events and try once more to deliver what is queued. */
    close(): Promise<void>;
}
/**
 * Build a transport, or nothing at all.
 *
 * An unset endpoint yields `undefined` rather than a sink pointed at a guessed
 * URL, so a product that has not configured collection sends nothing instead of
 * failing requests in the background.
 */
export declare function createHttpSink(endpoint: string | null | undefined, options?: Omit<HttpBatchSinkOptions, "endpoint">): HttpBatchEventSink | undefined;
//# sourceMappingURL=transport.d.ts.map