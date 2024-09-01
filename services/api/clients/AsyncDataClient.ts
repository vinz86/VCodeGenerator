import {useAsyncData} from '#app';
import {IHttpClient} from "~/models/interfaces/IHttpClient";
import {IApiRequest} from "~/models/interfaces/IApiRequest";
import type {IApiResponse} from "~/models/interfaces/IApiResponse";
import {ConfigurationManager} from "~/manager/ConfigurationManager/ConfigurationManager";
import type {IApiError} from "~/services/api/interfaces/IApiError";

export class AsyncDataClient implements IHttpClient {

    constructor() {
    }

    private convertToIApiError(errorObject: any): IApiError {
        if(!errorObject?._key || !errorObject?._object[errorObject?._key]) return;

        const errorKey = errorObject?._key;
        const errorDetails = errorObject?._object[errorKey];
        const error = {
            message: errorDetails?.message || 'Errore http generico',
            statusCode: errorDetails?.statusCode || 500,
            originalError: errorObject
        };
        return error;
    }

    async request<T>(config: IApiRequest): Promise<IApiResponse<T>|IApiError> {
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

        try{
            const { data: responseData, error } = await useAsyncData<T>(
                apiUrl,
                () => fetch(apiUrl, fetchConfig).then(res => {
                    if (res.ok) {
                        return res.status !== 204 ? res?.json() : {};
                    } else {
                        throw createError({
                            statusCode: res?.status,
                            statusMessage: `${res?.status} - ${res?.statusText}: ${res?.url}`,
                        })
                    }
                })
            );

            //controllo se in error c'è una key corrispondente a quella della request
            if (error && !!error?._object && !!error?._key && error._object.hasOwnProperty(error._key) && !!error._object[error._key]) {
                throw error
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
function isIApiError(obj: any): obj is IApiError {
    return (
        obj &&
        typeof obj === 'object' &&
        typeof obj.message === 'string' &&
        typeof obj.statusCode === 'number' &&
        'originalError' in obj // Check if 'originalError' property exists
    );
}