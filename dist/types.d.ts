export declare const DOT_EVENT_PROTOCOL_VERSION: "0.1";
export declare const CLOUD_EVENTS_SPEC_VERSION: "1.0";
export declare const DOT_EVENT_TYPE_PATTERN: RegExp;
/** ISO 3166-1 alpha-2, uppercase. */
export declare const ISO_COUNTRY_CODE_PATTERN: RegExp;
/** ISO 3166-2 subdivision, uppercase; Natural Earth also uses a trailing `~`. */
export declare const ISO_REGION_CODE_PATTERN: RegExp;
export type TelemetryLane = "product" | "learning" | "audit" | "operational" | "realtime";
export type PrivacyClass = "non_personal" | "anonymous" | "pseudonymous" | "personal" | "learning_record" | "sensitive" | "security";
export type EventProfile = "lifecycle" | "interaction" | "content" | "activity" | "assessment" | "collaboration" | "storage" | "media" | "device" | "accessibility" | "ai" | "operational";
export type ProducerPlatform = "web" | "android" | "ios" | "windows" | "macos" | "server" | "device";
export type ActorType = "anonymous" | "user" | "teacher" | "student" | "admin" | "system" | "device";
export type OutcomeStatus = "success" | "failure" | "cancelled" | "partial";
export type AttributeValue = string | number | boolean | null;
export interface DotProducer {
    readonly app: string;
    readonly appVersion: string;
    readonly platform: ProducerPlatform;
    readonly deviceModel?: string;
    readonly osVersion?: string;
}
export interface ActorRef {
    readonly type: ActorType;
    readonly id?: string;
}
export interface EntityRef {
    readonly type: string;
    readonly id?: string;
    readonly version?: string;
}
export interface DomainContext {
    readonly references?: readonly EntityRef[];
    readonly locale?: string;
    readonly mode?: string;
    readonly inputMethod?: string;
}
export interface EventOutcome {
    readonly status: OutcomeStatus;
    readonly durationMs?: number;
    readonly count?: number;
    readonly score?: number;
    readonly errorType?: string;
}
export interface DomainEventData<TDetails extends Readonly<Record<string, unknown>> = Readonly<Record<string, unknown>>> {
    readonly actor?: ActorRef;
    readonly action: string;
    readonly object?: EntityRef;
    readonly context?: DomainContext;
    readonly outcome?: EventOutcome;
    readonly attributes?: Readonly<Record<string, AttributeValue>>;
    readonly details?: TDetails;
}
export interface DotEventMetadata {
    readonly protocolVersion: typeof DOT_EVENT_PROTOCOL_VERSION;
    readonly eventVersion: number;
    readonly lane: TelemetryLane;
    readonly privacyClass: PrivacyClass;
    readonly profile: EventProfile;
    readonly producer: DotProducer;
    /**
     * Customer account or tenant country as ISO 3166-1 alpha-2.
     *
     * Producers provide this from configured account data. Event libraries must
     * never infer it from an IP address or a device's live location.
     */
    readonly countryCode?: string;
    /**
     * Configured customer account or tenant subdivision as ISO 3166-2.
     *
     * Like countryCode, this is never inferred from IP or live device location.
     */
    readonly regionCode?: string;
    readonly tenantId?: string;
    readonly sessionId?: string;
    readonly correlationId?: string;
    readonly causationId?: string;
}
export interface DotEvent<TData extends DomainEventData = DomainEventData> {
    readonly specversion: typeof CLOUD_EVENTS_SPEC_VERSION;
    readonly id: string;
    readonly source: string;
    readonly type: string;
    readonly time: string;
    readonly subject?: string;
    readonly dataschema: string;
    readonly dot: DotEventMetadata;
    readonly data: TData;
}
export interface EventDefinition {
    readonly version: number;
    readonly profile: EventProfile;
    readonly lane: TelemetryLane;
    readonly privacyClass: PrivacyClass;
    readonly description: string;
    readonly highVolume: boolean;
}
//# sourceMappingURL=types.d.ts.map