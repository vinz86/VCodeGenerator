import { IHttpClient } from "~/models/interfaces/IHttpClient";
import { EApiHttpClientType } from "~/services/api/core/models/enum/EApiHttpClientType";

export interface IApiClientFactory {
    createClient(type: EApiHttpClientType): IHttpClient;
}
