import type { EApiFilters } from "~/services/api/core/models/enum/EApiFilters";

export interface IApiFilterBuilder {
    addFilter<K extends keyof TFilters>(key: K, value: TFilters[K], operator: EApiFilters): this;
    addFilters(filters: Array<{ key: keyof TFilters; value: TFilters[keyof TFilters]; filter: EApiFilters }>): this;
    addKeyValueFilters(params: Record<string, any>, defaultFilter: EApiFilters, defaultArrayFilter: EApiFilters): this
    build(autoReset: boolean = true): Partial<TFilters>
    buildString(autoReset: boolean = true): string
    buildFromUrlParams(hashMode: boolean = true, autoReset: boolean = true, defaultFilter: EApiFilters, defaultArrayFilter: EApiFilters): Partial<TFilters>;
    reset(): this;
}