import {ApiCacheManager} from '~/services/api/ApiCacheManager';
import type {IApiResponse} from "~/models/interfaces/IApiResponse";
import type {IApiRequest} from "~/models/interfaces/IApiRequest";
import {EApiHttpClientType} from "~/models/enum/EApiHttpClientType";
import type {IHttpClient} from "~/models/interfaces/IHttpClient";
import {ApiClientFactory} from "~/services/api/ApiClientFactory";
import type {IApiError} from "~/services/api/interfaces/IApiError";

export class ApiClient {
    private static instance: ApiClient;
    private cacheManager: ApiCacheManager;
    private httpClient: IHttpClient;

    private constructor(clientType: EApiHttpClientType) {
        this.cacheManager = ApiCacheManager.getInstance();
        this.httpClient = ApiClientFactory.createClient(clientType);
    }

    public static getInstance(clientType: EApiHttpClientType): ApiClient {
        if (!ApiClient.instance) {
            ApiClient.instance = new ApiClient(clientType);
        }
        return ApiClient.instance;
    }

    private async request<T>(config: IApiRequest): Promise<IApiResponse<T>> {
        const { method, url, data, headers, responseType, cached } = config;

        // Gestione della cache
        if (cached) {
            const cacheKey = this.createCacheKey(config);
            const cachedData = this.cacheManager.get(cacheKey);
            if (cachedData) {
                return {
                    data: cachedData,
                    status: 200,
                    statusText: 'OK',
                    headers: new Headers()
                };
            }
        }


        try {
            const response = await this.httpClient.request<T>({ method, url, data, headers, responseType });

            // Salva nella cache se il parametro cached è true
            if (cached) {
                const cacheKey = this.createCacheKey(config);
                this.cacheManager.set(cacheKey, response.data);
            }

            return response;
        } catch (error: IApiError) {
            if (error.statusCode === 401) {
                navigateTo('/login');
            } else {
                console.error(`Errore HTTP! Status: ${error.statusCode}`, error.message);
            }

            throw error;
        }
    }

    private createCacheKey(config: IApiRequest): string {
        const { url, data } = config;
        return `${url}:${JSON.stringify(data)}`;
    }

    public get<T>(url: string, queryParams?: Record<string, any>, cached: boolean = false): Promise<IApiResponse<T>> {
        const queryString = queryParams ? new URLSearchParams(queryParams).toString() : '';
        return this.request<T>({ method: 'GET', url: `${url}?${queryString}`, cached });
    }

    public post<T>(url: string, data?: any, cached: boolean = false): Promise<IApiResponse<T>> {
        return this.request<T>({ method: 'POST', url, data, cached });
    }

    public put<T>(url: string, data?: any, cached: boolean = false): Promise<IApiResponse<T>> {
        return this.request<T>({ method: 'PUT', url, data, cached });
    }

    public patch<T>(url: string, data?: any, cached: boolean = false): Promise<IApiResponse<T>> {
        return this.request<T>({ method: 'PATCH', url, data, cached });
    }

    public delete<T>(url: string, cached: boolean = false): Promise<IApiResponse<T>> {
        return this.request<T>({ method: 'DELETE', url, cached });
    }
}
