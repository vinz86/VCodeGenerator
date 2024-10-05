import type { IHttpClient} from "~/models/interfaces/IHttpClient";
import { FetchClient} from "~/services/api/core/clients/FetchClient";
import { AxiosClient} from "~/services/api/core/clients/AxiosClient";
import {EApiHttpClientType} from "~/services/api/core/models/enum/EApiHttpClientType";
import {AsyncDataClient} from "~/services/api/core/clients/AsyncDataClient";
import type {IApiClientFactory} from "~/services/api/core/models/interface/IApiClientFactory";

export class ApiClientFactory implements IApiClientFactory{
    static createClient(type: EApiHttpClientType): IHttpClient {
        let client: IHttpClient;
        switch (type) {
            case EApiHttpClientType.Axios:
                client = new AxiosClient();
                break;
            case EApiHttpClientType.AsyncData:
                client = new AsyncDataClient();
                break;
            case EApiHttpClientType.Fetch:
            default:
                client = new FetchClient();
                break;
        }
        return client;
    }
}