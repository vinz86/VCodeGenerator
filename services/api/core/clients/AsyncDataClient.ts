import { useAsyncData } from '#app';
import type { IHttpClient } from "~/models/interfaces/IHttpClient";
import type { IApiRequest } from "~/services/api/core/models/interface/IApiRequest";
import type { IApiResponse } from "~/services/api/core/models/interface/IApiResponse";
import { ConfigurationManager } from "~/manager/ConfigurationManager/ConfigurationManager";
import type { IApiError } from "~/services/api/services/interfaces/IApiError";

export class AsyncDataClient implements IHttpClient {

    private convertToIApiError(errorObject: any): IApiError {
        const errorKey = errorObject?._key;
        const errorDetails = errorObject?._object[errorKey];

        if (!errorKey || !errorDetails) return;

        return {
            message: errorDetails?.message || 'Errore http generico',
            statusCode: errorDetails?.statusCode || 500,
            originalError: errorObject || {},
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
            const { data: responseData, error } = await useAsyncData<T>(
                apiUrl,
                () => fetch(apiUrl, fetchConfig).then(async (res) => {
                    if (res.ok) {
                        switch (responseType) {
                            case 'json':
                                return res.status !== 204 ? await res.json() : {};
                            case 'text':
                                return await res.text();
                            case 'blob':
                                return await res.blob();
                            case 'formData':
                                return await res.formData();
                            case 'arrayBuffer':
                                return await res.arrayBuffer();
                            default:
                                return res.status !== 204 ? await res.json() : {};
                        }
                    } else {
                        throw createError({
                            statusCode: res?.status,
                            statusMessage: `${res?.status} - ${res?.statusText}: ${res?.url}`,
                        });
                    }
                })
            );

            // controllo se in error c'è una key corrispondente a quella della request
            if (error && !!error?._object && !!error?._key && error._object.hasOwnProperty(error._key) && !!error._object[error._key]) {
                throw error;
            }

            return {
                data: responseData.value,
                status: 200,
                statusText: 'OK',
                headers: new Headers()
            };
        } catch (e) {
            throw this.convertToIApiError(e);
        }
    }
}

function isIApiError(obj: any): obj is IApiError {
    return (
        obj &&
        typeof obj === 'object' &&
        typeof obj.message === 'string' &&
        typeof obj.statusCode === 'number' &&
        'originalError' in obj
    );
}
