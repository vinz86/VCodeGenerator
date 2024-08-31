import { IHttpClient} from "~/models/interfaces/IHttpClient";
import { FetchClient} from "~/services/api/clients/FetchClient";
import { AxiosClient} from "~/services/api/clients/AxiosClient";
import {EApiHttpClientType} from "~/models/enum/EApiHttpClientType";
import {AsyncDataClient} from "~/services/api/clients/AsyncDataClient";

export class ApiClientFactory {
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