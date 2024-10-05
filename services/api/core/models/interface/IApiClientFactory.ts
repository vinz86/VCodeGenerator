import type { IHttpClient } from "~/models/interfaces/IHttpClient";
import type { EApiHttpClientType } from "~/services/api/core/models/enum/EApiHttpClientType";

export interface IApiClientFactory {
    createClient(type: EApiHttpClientType): IHttpClient;
}
