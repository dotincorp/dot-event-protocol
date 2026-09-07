export interface RegionDefinition {
    /** ISO 3166-2 code matching the Natural Earth admin-1 geometry. */
    readonly code: string;
    /** Korean display label returned by the aggregation API. */
    readonly label: string;
}
/**
 * Demo-market subdivisions.
 *
 * This is configured account geography, never an IP or device-location lookup.
 * Codes are deliberately shared by the seed, metrics and the admin-1 map join.
 */
export declare const regionsByCountry: Readonly<Record<string, readonly RegionDefinition[]>>;
export declare function regionLabel(regionCode: string): string;
//# sourceMappingURL=regions.d.ts.map