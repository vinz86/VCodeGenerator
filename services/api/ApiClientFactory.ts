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

/*    private ClassRegistry: Record<string, new () => any> = {
        [EApiHttpClientType.Axios]: AxiosClient,
        [EApiHttpClientType.Fetch]: FetchClient,
        [EApiHttpClientType.AsyncData]: AsyncDataClient,
    };

    static createClient(type: EApiHttpClientType): IHttpClient {
        let ClassConstructor = this.ClassRegistry[type];
        if (!ClassConstructor) {
            console.error(`Client ${type} non valido. Utilizzo quello di default.`);
            return new AsyncDataClient();
        }
        return new ClassConstructor();
    }*/
}
