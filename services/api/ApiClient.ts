import {ApiCacheManager} from '~/services/api/ApiCacheManager';
import type {IApiResponse} from "~/models/interfaces/IApiResponse";
import type {IApiRequest} from "~/models/interfaces/IApiRequest";
import {EApiHttpClientType} from "~/models/enum/EApiHttpClientType";
import type {IHttpClient} from "~/models/interfaces/IHttpClient";
import {ApiClientFactory} from "~/services/api/ApiClientFactory";
import type {IApiError} from "~/services/api/interfaces/IApiError";
import {LocalStorageService} from "~/services/LocalStorageService";

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

    private getToken(){
        try{
            const localStorageService = new LocalStorageService();
            const _token = localStorageService.load('authToken');

            return _token || null;
        }
        catch (e) {
            console.error(e);
        }
    }

    private async request<T>(config: IApiRequest): Promise<IApiResponse<T>> {
        const { method, url, data, headers, responseType, cached, useAuth } = config;

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
            const newHeaders =  {
                    'Authorization': this.getToken() && useAuth ? `Bearer ${this.getToken()}` : '',
            ...headers,
            }

            const response = await this.httpClient.request<T>({ method: method, url: url, data: data, headers: newHeaders, responseType: responseType });

            // Salva nella cache se il parametro cached è true
            if (cached) {
                const cacheKey = this.createCacheKey(config);
                this.cacheManager.set(cacheKey, response.data);
            }

            return response;
        } catch (error: IApiError) {
            if (!error?.statusCode) {
            } else if (error?.statusCode === 401) {
                navigateTo('/login');
            } else if (error?.statusCode === 403) {
                navigateTo('/error');
            } else {
                console.error(`Errore HTTP! Status: ${error.statusCode}`);
                error.message && console.error(error.message);
            }

            throw error;
        }
    }

    private createCacheKey(config: IApiRequest): string {
        const { url, data } = config;
        return `${url}:${JSON.stringify(data)}`;
    }

/*    public get<T>(url: string, queryParams?: Record<string, any>, cached: boolean = false, useAuth: boolean = true): Promise<IApiResponse<T>> {
        const queryString = queryParams ? new URLSearchParams(queryParams).toString() : '';
        return this.request<T>({ method: 'GET', url: `${url}?${queryString}`, cached: cached, useAuth: useAuth });
    }

    public post<T>(url: string, data?: any, useAuth: boolean = true): Promise<IApiResponse<T>> {
        return this.request<T>({ method: 'POST', url, data, useAuth: useAuth });
    }

    public put<T>(url: string, data?: any, useAuth: boolean = true): Promise<IApiResponse<T>> {
        return this.request<T>({ method: 'PUT', url, data, useAuth: useAuth });
    }

    public patch<T>(url: string, data?: any, useAuth: boolean = true): Promise<IApiResponse<T>> {
        return this.request<T>({ method: 'PATCH', url, data, useAuth: useAuth });
    }

    public delete<T>(url: string, useAuth: boolean = true): Promise<IApiResponse<T>> {
        return this.request<T>({ method: 'DELETE', url, useAuth: useAuth });
    }*/
}
