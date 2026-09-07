export const eventCatalog = {
    "com.dot.app.session.started.v1": {
        version: 1,
        profile: "lifecycle",
        lane: "product",
        privacyClass: "pseudonymous",
        description: "A user-visible application session started.",
        highVolume: false,
    },
    "com.dot.app.session.ended.v1": {
        version: 1,
        profile: "lifecycle",
        lane: "product",
        privacyClass: "pseudonymous",
        description: "A user-visible application session ended.",
        highVolume: false,
    },
    "com.dot.resource.opened.v1": {
        version: 1,
        profile: "content",
        lane: "product",
        privacyClass: "pseudonymous",
        description: "A content resource was opened for viewing or editing.",
        highVolume: false,
    },
    "com.dot.resource.created.v1": {
        version: 1,
        profile: "content",
        lane: "product",
        privacyClass: "pseudonymous",
        description: "A content resource was created.",
        highVolume: false,
    },
    "com.dot.operation.completed.v1": {
        version: 1,
        profile: "interaction",
        lane: "product",
        privacyClass: "pseudonymous",
        description: "A meaningful user operation completed successfully.",
        highVolume: true,
    },
    "com.dot.operation.failed.v1": {
        version: 1,
        profile: "operational",
        lane: "operational",
        privacyClass: "non_personal",
        description: "An operation failed with a classified error type.",
        highVolume: false,
    },
    "com.dot.activity.started.v1": {
        version: 1,
        profile: "activity",
        lane: "product",
        privacyClass: "pseudonymous",
        description: "A game, exercise, workflow, or other activity started.",
        highVolume: false,
    },
    "com.dot.activity.completed.v1": {
        version: 1,
        profile: "activity",
        lane: "product",
        privacyClass: "pseudonymous",
        description: "A game, exercise, workflow, or other activity completed.",
        highVolume: false,
    },
    "com.dot.assessment.attempt.completed.v1": {
        version: 1,
        profile: "assessment",
        lane: "learning",
        privacyClass: "learning_record",
        description: "An assessment attempt completed and produced a learning record.",
        highVolume: false,
    },
    "com.dot.collaboration.member.joined.v1": {
        version: 1,
        profile: "collaboration",
        lane: "realtime",
        privacyClass: "pseudonymous",
        description: "A member joined a class, room, or collaborative session.",
        highVolume: false,
    },
    "com.dot.storage.sync.completed.v1": {
        version: 1,
        profile: "storage",
        lane: "operational",
        privacyClass: "pseudonymous",
        description: "A storage synchronization operation completed.",
        highVolume: false,
    },
    "com.dot.media.playback.started.v1": {
        version: 1,
        profile: "media",
        lane: "product",
        privacyClass: "pseudonymous",
        description: "Playback of music, audio, or video started.",
        highVolume: false,
    },
    "com.dot.device.connection.changed.v1": {
        version: 1,
        profile: "device",
        lane: "operational",
        privacyClass: "non_personal",
        description: "A Dot device connection state changed.",
        highVolume: false,
    },
    "com.dot.accessibility.mode.changed.v1": {
        version: 1,
        profile: "accessibility",
        lane: "product",
        privacyClass: "pseudonymous",
        description: "An accessibility-related UI mode changed without inferring disability.",
        highVolume: false,
    },
};
export function getEventDefinition(name) {
    return eventCatalog[name];
}
export function listEventDefinitions() {
    return Object.entries(eventCatalog).map(([name, definition]) => ({
        name: name,
        definition,
    }));
}
//# sourceMappingURL=catalog.js.map