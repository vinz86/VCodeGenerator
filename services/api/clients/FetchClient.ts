import { IHttpClient, IRequestConfig, IResponse } from './IHttpClient';
import {ConfigurationManager} from "~/manager/ConfigurationManager/ConfigurationManager";
import {LocalStorageService} from "~/services/LocalStorageService";

export class FetchClient implements IHttpClient {
    private token: string | null = null;

    constructor() {
        const localStorageService = new LocalStorageService();
        const _token = localStorageService.load('authToken');
        if (_token){
            this.token = _token
        }
    }
    setAuthorizationToken(token: string | null) {
        this.token = token;
    }

    async request<T>(config: IRequestConfig): Promise<IResponse<T>> {
        const { method, url, data, headers, responseType } = config;

        const fetchOptions: RequestInit = {
            method: method.toUpperCase(),
            headers: {
                'Content-Type': 'application/json',
                ...headers,
                'Authorization': this.token ? `Bearer ${this.token}` : ''

            },
            body: data ? JSON.stringify(data) : undefined
        };

        const response = await fetch(ConfigurationManager.getInstance().getApiBase()+url, fetchOptions);

        let responseData: any;
        switch (responseType) {
            case 'json':
                responseData = await response.json();
                break;
            case 'text':
                responseData = await response.text();
                break;
            case 'arraybuffer':
                responseData = await response.arrayBuffer();
                break;
            case 'blob':
                responseData = await response.blob();
                break;
            case 'formdata':
                responseData = await response.formData();
                break;
            default:
                responseData = await response.json();
        }

        if (!response.ok) {
            throw new Error(responseData.message || 'Errore durante la richiesta API');
        }

        return {
            data: responseData,
            status: response.status,
            statusText: response.statusText,
            headers: response.headers
        };
    }
}
