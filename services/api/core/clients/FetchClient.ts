import type { IHttpClient } from "~/models/interfaces/IHttpClient";
import type { IApiRequest } from "~/services/api/core/models/interface/IApiRequest";
import type { IApiResponse } from "~/services/api/core/models/interface/IApiResponse";
import { ConfigurationManager } from "~/manager/ConfigurationManager/ConfigurationManager";
import type { IApiError } from "~/services/api/services/interfaces/IApiError";

export class FetchClient implements IHttpClient {

    private convertToIApiError(response: Response, message: string): IApiError {
        return {
            message: message || 'Errore http generico',
            statusCode: response.status,
            originalError: response,
        };
    }

    async request<T>(config: IApiRequest): Promise<IApiResponse<T> | IApiError> {
        const { method, url, data, headers, responseType } = config;
        const apiUrl = ConfigurationManager.getInstance().getApiBase() + url;

        const fetchConfig: RequestInit = {
            method: method.toUpperCase(),
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            ...(data && { body: JSON.stringify(data) })
        };

        try {
            const res = await fetch(apiUrl, fetchConfig);

            if (!res.ok) {
                const errorMessage = `${res.status} - ${res.statusText}: ${res.url}`;
                throw this.convertToIApiError(res, errorMessage);
            }

            let responseData: any;
            switch (responseType) {
                case 'json':
                    responseData = res.status !== 204 ? await res.json() : {};
                    break;
                case 'text':
                    responseData = await res.text();
                    break;
                case 'blob':
                    responseData = await res.blob();
                    break;
                case 'formData':
                    responseData = await res.formData();
                    break;
                case 'arrayBuffer':
                    responseData = await res.arrayBuffer();
                    break;
                default:
                    responseData = res.status !== 204 ? await res.json() : {};
                    break;
            }

            return {
                data: responseData,
                status: res.status,
                statusText: res.statusText,
                headers: res.headers
            };

        } catch (e) {
            throw e;
        }
    }
}
