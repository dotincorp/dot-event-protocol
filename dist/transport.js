const DEFAULTS = {
    maxBatchSize: 20,
    flushIntervalMs: 5_000,
    maxQueueSize: 500,
};
export class HttpBatchEventSink {
    queue = [];
    timer;
    inFlight;
    closed = false;
    droppedCount = 0;
    endpoint;
    fetchImpl;
    maxBatchSize;
    flushIntervalMs;
    maxQueueSize;
    headers;
    onError;
    setTimeoutImpl;
    clearTimeoutImpl;
    constructor(options) {
        this.endpoint = options.endpoint;
        this.fetchImpl = options.fetchImpl ?? globalThis.fetch.bind(globalThis);
        this.maxBatchSize = options.maxBatchSize ?? DEFAULTS.maxBatchSize;
        this.flushIntervalMs = options.flushIntervalMs ?? DEFAULTS.flushIntervalMs;
        this.maxQueueSize = options.maxQueueSize ?? DEFAULTS.maxQueueSize;
        // Built once: an empty or blank key is the same as no key, so a
        // half-configured product does not send `Bearer ` and get a confusing 401.
        const key = options.ingestKey?.trim();
        this.headers = {
            "content-type": "application/json",
            ...(key ? { authorization: `Bearer ${key}` } : {}),
        };
        this.onError = options.onError;
        this.setTimeoutImpl = options.setTimeoutImpl ?? setTimeout;
        this.clearTimeoutImpl = options.clearTimeoutImpl ?? clearTimeout;
    }
    /** How many events were dropped because the queue was full. */
    get dropped() {
        return this.droppedCount;
    }
    get pending() {
        return this.queue.length;
    }
    /**
     * Queue one event. Returns immediately and never throws: a product action must
     * not be able to fail because analytics did.
     */
    emit(event) {
        if (this.closed)
            return;
        this.queue.push(event);
        while (this.queue.length > this.maxQueueSize) {
            this.queue.shift();
            this.droppedCount += 1;
        }
        if (this.queue.length >= this.maxBatchSize) {
            void this.flush();
            return;
        }
        this.schedule();
    }
    schedule() {
        if (this.timer !== undefined)
            return;
        this.timer = this.setTimeoutImpl(() => {
            this.timer = undefined;
            void this.flush();
        }, this.flushIntervalMs);
    }
    /** Send what is queued. Safe to call at any time; failures stay inside. */
    async flush() {
        if (this.timer !== undefined) {
            this.clearTimeoutImpl(this.timer);
            this.timer = undefined;
        }
        // Serialised so a retry cannot race a later batch and reorder delivery.
        this.inFlight = (this.inFlight ?? Promise.resolve()).then(() => this.send());
        await this.inFlight;
    }
    async send() {
        if (this.queue.length === 0)
            return;
        const batch = this.queue.splice(0, this.maxBatchSize);
        try {
            const response = await this.fetchImpl(this.endpoint, {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify({ events: batch }),
                credentials: "omit",
                keepalive: true,
            });
            if (!response.ok) {
                throw new Error(`event gateway returned ${response.status}`);
            }
        }
        catch (error) {
            // Put the batch back at the front so the retry keeps the same source+id,
            // which is what makes at-least-once delivery idempotent at the gateway.
            this.queue.unshift(...batch);
            while (this.queue.length > this.maxQueueSize) {
                this.queue.pop();
                this.droppedCount += 1;
            }
            this.onError?.(error);
        }
    }
    /** Stop accepting events and try once more to deliver what is queued. */
    async close() {
        this.closed = true;
        await this.flush();
    }
}
/**
 * Build a transport, or nothing at all.
 *
 * An unset endpoint yields `undefined` rather than a sink pointed at a guessed
 * URL, so a product that has not configured collection sends nothing instead of
 * failing requests in the background.
 */
export function createHttpSink(endpoint, options = {}) {
    const normalized = endpoint?.trim();
    if (!normalized)
        return undefined;
    return new HttpBatchEventSink({ endpoint: normalized, ...options });
}
//# sourceMappingURL=transport.js.map