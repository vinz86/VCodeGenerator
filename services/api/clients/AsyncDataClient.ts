import {useAsyncData} from '#app';
import {IHttpClient} from "~/models/interfaces/IHttpClient";
import {IApiRequest} from "~/models/interfaces/IApiRequest";
import type {IApiResponse} from "~/models/interfaces/IApiResponse";
import {ConfigurationManager} from "~/manager/ConfigurationManager/ConfigurationManager";
import {LocalStorageService} from "~/services/LocalStorageService";
import type {IApiError} from "~/services/api/interfaces/IApiError";

export class AsyncDataClient implements IHttpClient {
    private token: string | null = null;

    constructor() {
        const localStorageService = new LocalStorageService();
        const _token = localStorageService.load('authToken');
        if (_token) {
            this.token = _token;
        }
    }

    private convertToIApiError(errorObject: any): IApiError {
        const errorKey = errorObject._key;
        const errorDetails = errorObject._object[errorKey];

        debugger
        if (!errorDetails) {
            return {
                message: 'Unknown error occurred',
                statusCode: 500,
                originalError: errorObject
            };
        }

        return {
            message: errorDetails.message || 'Unknown error occurred',
            statusCode: errorDetails.statusCode || 500,
            originalError: errorDetails
        };
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

        try{

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
                throw this.convertToIApiError(error);
            }

            return {
                data: responseData.value,
                status: 200,
                statusText: 'OK',
                headers: new Headers()
            };
        }
        catch (e){
            throw this.convertToIApiError(e);
        }
    }
}
