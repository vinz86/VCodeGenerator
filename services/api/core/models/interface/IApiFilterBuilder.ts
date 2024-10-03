import type { EApiFilters } from "~/services/api/core/models/enum/EApiFilters";

export interface IApiFilterBuilder {
    addFilter(key: string, operator: EApiFilters, value: string | number | boolean | Array<any>): this;
    build(returnType?: 'string' | 'json'): string | Record<string, string>;
    reset(): this;
}
