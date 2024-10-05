import type {ApiKeys} from "~/services/api/ApiKeys";

export type EServiceEntry = {
    key: ApiKeys;
    service: new (...params: ServiceParams) => any;
    params?: any[];
};