import { useAsyncData } from '#app';
import { IHttpClient } from "~/models/interfaces/IHttpClient";
import { IApiRequest } from "~/models/interfaces/IApiRequest";
import type { IApiResponse } from "~/models/interfaces/IApiResponse";
import { ConfigurationManager } from "~/manager/ConfigurationManager/ConfigurationManager";
import { LocalStorageService } from "~/services/LocalStorageService";

export class AsyncDataClient implements IHttpClient {
    private token: string | null = null;

    constructor() {
        const localStorageService = new LocalStorageService();
        const _token = localStorageService.load('authToken');
        if (_token) {
            this.token = _token;
        }
    }

    setAuthorizationToken(token: string | null) {
        this.token = token;
    }

    async request<T>(config: IApiRequest): Promise<IApiResponse<T>> {
        const { method, url, data, headers, responseType } = config;
        const apiUrl = ConfigurationManager.getInstance().getApiBase() + url;

        // Prepare the fetch configuration
        const fetchConfig: RequestInit = {
            method: method.toUpperCase(),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.token ? `Bearer ${this.token}` : '',
                ...headers,
            },
            ...(data && { body: JSON.stringify(data) })
        };

        // Using useAsyncData to handle the request
        const { data: responseData, error } = await useAsyncData<T>(
            apiUrl,
            () => fetch(apiUrl, fetchConfig).then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
        );

        if (error.value) {
            throw new Error(`Error fetching data: ${error.value}`);
        }

        // Mocking IApiResponse structure, adjust if needed
        return {
            data: responseData.value,
            status: 200, // use status code from actual fetch response if needed
            statusText: 'OK', // use status text from actual fetch response if needed
            headers: new Headers() // mock or adjust according to actual response
        };
    }
}
