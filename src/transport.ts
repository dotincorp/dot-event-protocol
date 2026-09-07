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
  /** Called for delivery failures and drops. Never rethrown into the product. */
  readonly onError?: (error: unknown) => void;
  /** Injected for tests. */
  readonly setTimeoutImpl?: typeof setTimeout;
  readonly clearTimeoutImpl?: typeof clearTimeout;
}

const DEFAULTS = {
  maxBatchSize: 20,
  flushIntervalMs: 5_000,
  maxQueueSize: 500,
} as const;

export class HttpBatchEventSink implements EventSink {
  private readonly queue: DotEvent[] = [];
  private timer: ReturnType<typeof setTimeout> | undefined;
  private inFlight: Promise<void> | undefined;
  private closed = false;
  private droppedCount = 0;

  private readonly endpoint: string;
  private readonly fetchImpl: typeof fetch;
  private readonly maxBatchSize: number;
  private readonly flushIntervalMs: number;
  private readonly maxQueueSize: number;
  private readonly onError: ((error: unknown) => void) | undefined;
  private readonly setTimeoutImpl: typeof setTimeout;
  private readonly clearTimeoutImpl: typeof clearTimeout;

  public constructor(options: HttpBatchSinkOptions) {
    this.endpoint = options.endpoint;
    this.fetchImpl = options.fetchImpl ?? globalThis.fetch.bind(globalThis);
    this.maxBatchSize = options.maxBatchSize ?? DEFAULTS.maxBatchSize;
    this.flushIntervalMs = options.flushIntervalMs ?? DEFAULTS.flushIntervalMs;
    this.maxQueueSize = options.maxQueueSize ?? DEFAULTS.maxQueueSize;
    this.onError = options.onError;
    this.setTimeoutImpl = options.setTimeoutImpl ?? setTimeout;
    this.clearTimeoutImpl = options.clearTimeoutImpl ?? clearTimeout;
  }

  /** How many events were dropped because the queue was full. */
  public get dropped(): number {
    return this.droppedCount;
  }

  public get pending(): number {
    return this.queue.length;
  }

  /**
   * Queue one event. Returns immediately and never throws: a product action must
   * not be able to fail because analytics did.
   */
  public emit(event: DotEvent): void {
    if (this.closed) return;

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

  private schedule(): void {
    if (this.timer !== undefined) return;
    this.timer = this.setTimeoutImpl(() => {
      this.timer = undefined;
      void this.flush();
    }, this.flushIntervalMs);
  }

  /** Send what is queued. Safe to call at any time; failures stay inside. */
  public async flush(): Promise<void> {
    if (this.timer !== undefined) {
      this.clearTimeoutImpl(this.timer);
      this.timer = undefined;
    }

    // Serialised so a retry cannot race a later batch and reorder delivery.
    this.inFlight = (this.inFlight ?? Promise.resolve()).then(() => this.send());
    await this.inFlight;
  }

  private async send(): Promise<void> {
    if (this.queue.length === 0) return;

    const batch = this.queue.splice(0, this.maxBatchSize);

    try {
      const response = await this.fetchImpl(this.endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ events: batch }),
        credentials: "omit",
        keepalive: true,
      });

      if (!response.ok) {
        throw new Error(`event gateway returned ${response.status}`);
      }
    } catch (error) {
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
  public async close(): Promise<void> {
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
export function createHttpSink(
  endpoint: string | null | undefined,
  options: Omit<HttpBatchSinkOptions, "endpoint"> = {},
): HttpBatchEventSink | undefined {
  const normalized = endpoint?.trim();
  if (!normalized) return undefined;
  return new HttpBatchEventSink({ endpoint: normalized, ...options });
}
