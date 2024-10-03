//filtri per jhipster
import type {EApiFilters} from "~/services/api/core/models/enum/EApiFilters";
import type {IApiFilterBuilder} from "~/services/api/core/models/interface/IApiFilterBuilder";

export class ApiFilterBuilder<T = {}> implements IApiFilterBuilder {
    private filters: Record<string, string> = {};

    addFilter(key: string, operator: EApiFilters, value: string | number | boolean | object |Array<any>): this {
        const formattedValue = Array.isArray(value) ? value.join(',') : value;
        this.filters[`${key}.${operator}`] = String(formattedValue);
        return this;
    }

    build(returnType: 'string' | 'json' = 'json'): string | Record<string, string> {
        if (returnType === 'json') {
            return { ...this.filters };
        }

        return Object.entries(this.filters)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
    }

    reset(): this {
        this.filters = {};
        return this;
    }
}


//esempio
// const ApiFilterBuilder = new ApiFilterBuilder();
//
// const query = ApiFilterBuilder
//     .addFilter('id', EApiFilters.EQUALS, 1)
//     .addFilter('name', EApiFilters.CONTAINS, 'John')
//     .addFilter('status', EApiFilters.IN, ['ACTIVE', 'PENDING'])
//     .build();
// await httpService.get(`/api/servizio?${query}`);