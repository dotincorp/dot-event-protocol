import type { EventDefinition } from "./types.js";
export declare const eventCatalog: {
    readonly "com.dot.app.session.started.v1": {
        readonly version: 1;
        readonly profile: "lifecycle";
        readonly lane: "product";
        readonly privacyClass: "pseudonymous";
        readonly description: "A user-visible application session started.";
        readonly highVolume: false;
    };
    readonly "com.dot.app.session.ended.v1": {
        readonly version: 1;
        readonly profile: "lifecycle";
        readonly lane: "product";
        readonly privacyClass: "pseudonymous";
        readonly description: "A user-visible application session ended.";
        readonly highVolume: false;
    };
    readonly "com.dot.resource.opened.v1": {
        readonly version: 1;
        readonly profile: "content";
        readonly lane: "product";
        readonly privacyClass: "pseudonymous";
        readonly description: "A content resource was opened for viewing or editing.";
        readonly highVolume: false;
    };
    readonly "com.dot.resource.created.v1": {
        readonly version: 1;
        readonly profile: "content";
        readonly lane: "product";
        readonly privacyClass: "pseudonymous";
        readonly description: "A content resource was created.";
        readonly highVolume: false;
    };
    readonly "com.dot.operation.completed.v1": {
        readonly version: 1;
        readonly profile: "interaction";
        readonly lane: "product";
        readonly privacyClass: "pseudonymous";
        readonly description: "A meaningful user operation completed successfully.";
        readonly highVolume: true;
    };
    readonly "com.dot.operation.failed.v1": {
        readonly version: 1;
        readonly profile: "operational";
        readonly lane: "operational";
        readonly privacyClass: "non_personal";
        readonly description: "An operation failed with a classified error type.";
        readonly highVolume: false;
    };
    readonly "com.dot.activity.started.v1": {
        readonly version: 1;
        readonly profile: "activity";
        readonly lane: "product";
        readonly privacyClass: "pseudonymous";
        readonly description: "A game, exercise, workflow, or other activity started.";
        readonly highVolume: false;
    };
    readonly "com.dot.activity.completed.v1": {
        readonly version: 1;
        readonly profile: "activity";
        readonly lane: "product";
        readonly privacyClass: "pseudonymous";
        readonly description: "A game, exercise, workflow, or other activity completed.";
        readonly highVolume: false;
    };
    readonly "com.dot.assessment.attempt.completed.v1": {
        readonly version: 1;
        readonly profile: "assessment";
        readonly lane: "learning";
        readonly privacyClass: "learning_record";
        readonly description: "An assessment attempt completed and produced a learning record.";
        readonly highVolume: false;
    };
    readonly "com.dot.collaboration.member.joined.v1": {
        readonly version: 1;
        readonly profile: "collaboration";
        readonly lane: "realtime";
        readonly privacyClass: "pseudonymous";
        readonly description: "A member joined a class, room, or collaborative session.";
        readonly highVolume: false;
    };
    readonly "com.dot.storage.sync.completed.v1": {
        readonly version: 1;
        readonly profile: "storage";
        readonly lane: "operational";
        readonly privacyClass: "pseudonymous";
        readonly description: "A storage synchronization operation completed.";
        readonly highVolume: false;
    };
    readonly "com.dot.media.playback.started.v1": {
        readonly version: 1;
        readonly profile: "media";
        readonly lane: "product";
        readonly privacyClass: "pseudonymous";
        readonly description: "Playback of music, audio, or video started.";
        readonly highVolume: false;
    };
    readonly "com.dot.device.connection.changed.v1": {
        readonly version: 1;
        readonly profile: "device";
        readonly lane: "operational";
        readonly privacyClass: "non_personal";
        readonly description: "A Dot device connection state changed.";
        readonly highVolume: false;
    };
    readonly "com.dot.accessibility.mode.changed.v1": {
        readonly version: 1;
        readonly profile: "accessibility";
        readonly lane: "product";
        readonly privacyClass: "pseudonymous";
        readonly description: "An accessibility-related UI mode changed without inferring disability.";
        readonly highVolume: false;
    };
};
export type DotEventName = keyof typeof eventCatalog;
export declare function getEventDefinition(name: string): EventDefinition | undefined;
export declare function listEventDefinitions(): readonly Readonly<{
    name: DotEventName;
    definition: EventDefinition;
}>[];
//# sourceMappingURL=catalog.d.ts.map