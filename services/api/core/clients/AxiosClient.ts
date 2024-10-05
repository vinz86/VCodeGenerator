import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import type { IHttpClient } from "~/models/interfaces/IHttpClient";
import type { IApiRequest } from "~/services/api/core/models/interface/IApiRequest";
import type { IApiResponse } from "~/services/api/core/models/interface/IApiResponse";
import { ConfigurationManager } from "~/manager/ConfigurationManager/ConfigurationManager";
import type { IApiError } from "~/services/api/services/interfaces/IApiError";

export class AxiosClient implements IHttpClient {

    private convertToIApiError(error: any): IApiError {
        const statusCode = error?.response?.status || 500;
        const message = error?.response?.statusText || 'Errore http generico';
        const originalError = error?.response?.data || error;

        return {
            message: message,
            statusCode: statusCode,
            originalError: originalError,
        };
    }

    async request<T>(config: IApiRequest): Promise<IApiResponse<T> | IApiError> {
        const { method, url, data, headers, responseType } = config;
        const apiUrl = ConfigurationManager.getInstance().getApiBase() + url;

        const axiosConfig: AxiosRequestConfig = {
            method: method as AxiosRequestConfig['method'],
            url: apiUrl,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            data: data,
            responseType: responseType as AxiosRequestConfig['responseType']
        };

        try {
            const response: AxiosResponse<T> = await axios(axiosConfig);

            return {
                data: response.data,
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
            };
        } catch (error) {
            return this.convertToIApiError(error);
        }
    }
}