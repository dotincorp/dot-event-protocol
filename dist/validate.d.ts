import { type DotEvent } from "./types.js";
export interface ValidationIssue {
    readonly path: string;
    readonly message: string;
}
export declare function validateDotEvent(value: unknown): readonly ValidationIssue[];
export declare function assertDotEvent(value: unknown): asserts value is DotEvent;
//# sourceMappingURL=validate.d.ts.map