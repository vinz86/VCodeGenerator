import type {IApiFilterBuilder} from "~/services/api/core/models/interface/IApiFilterBuilder";
import type {EApiFilters} from "~/services/api/core/models/enum/EApiFilters";

export class ApiFilterBuilder<TFilters = Record<string, any>> implements IApiFilterBuilder{
    private filters: Partial<TFilters> = {};

    addFilter<K extends keyof TFilters>(key: K, value: TFilters[K], operator: EApiFilters = EApiFilters.EQUALS): this {
        this.filters[`${String(key)}.${operator}`] = value;
        return this;
    }

    addFilters(filters: Array<{ key: keyof TFilters; value: TFilters[keyof TFilters]; filter: EApiFilters }>): this {
        filters.forEach(({ key, value, filter }) => {
            this.addFilter(key, value, filter);
        });
        return this;
    }

    addKeyValueFilters(params: Record<string, any>, defaultFilter: EApiFilters = EApiFilters.EQUALS, defaultArrayFilter: EApiFilters = EApiFilters.IN): this {
        const filters = Object.entries(params)
            .filter(([_, value]) => !!value) // rimuobo null undefined
            .map(([key, value]) => {
                if (Array.isArray(value)) {
                    return { key: key as keyof TFilters, value, filter: defaultArrayFilter };
                } else {
                    return { key: key as keyof TFilters, value, filter: defaultFilter };
                }
            });
        return this.addFilters(filters);
    }

    build(autoReset: boolean = true): Partial<TFilters> {
        const builtFilters = { ...this.filters };
        if (autoReset) {
            this.reset();
        }
        return builtFilters;
    }

    buildString(autoReset: boolean = true): string {
        const filterString: string = Object.entries(this.filters)
            .map(([key, value]) => {
                if (Array.isArray(value)) {
                    return `${encodeURIComponent(key)}=${encodeURIComponent(value.join(','))}`;
                } else if (typeof value === 'object' && value !== null) {
                    return `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`;
                } else {
                    return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
                }
            })
            .join('&');

        if (autoReset) {
            this.reset();
        }
        return filterString;
    }

    buildFromUrlParams(hashMode: boolean = true, autoReset: boolean = true, defaultFilter: EApiFilters = EApiFilters.EQUALS, defaultArrayFilter: EApiFilters = EApiFilters.IN): Partial<TFilters> {
        let routeParams: URLSearchParams;
        if (hashMode) {
            const hash = window.location.hash.substring(1); // Rimuove il simbolo #
            routeParams = new URLSearchParams(hash);
        } else {
            routeParams = new URLSearchParams(window.location.search);
        }

        const paramsObj: Record<string, any> = {};
        for (const [key, value] of routeParams.entries()) {
            paramsObj[key] = value;
        }

        if (autoReset) {
            this.reset();
        }

        this.addKeyValueFilters(paramsObj, defaultFilter, defaultArrayFilter)

        return this.build();
    }

    reset(): this {
        this.filters = {};
        return this;
    }
}

/* Esempio di utilizzo

const ApiFilterBuilder = new ApiFilterBuilder<RepaymentPlan>();
const queryString = ApiFilterBuilder
	.addFilter('id', 1)
	.addFilter('roles', ['admin', 'user'], EApiFilters.IN)
	.buildString();
-----------------------------
ApiFilterBuilder.reset(); // Reset dei filtri
-------------------
const jsonFilters = ApiFilterBuilder.addFilters([
	{ key: 'id', value: 2, filter: EApiFilters.EQUALS },
	{ key: 'roles', value: ['editor', 'user'], filter: EApiFilters.IN },
]).build();
--------------
const keyValueFilters = ApiFilterBuilder.addKeyValueFilters({id: 1, nome: 'Vincenzo'}).build()
--------------
const keyValueFilters = ApiFilterBuilder.buildFromRouteParams()

*/