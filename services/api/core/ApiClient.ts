import type {IApiRequest} from "~/services/api/core/models/interface/IApiRequest";
import type {IApiError} from "~/services/api/services/interfaces/IApiError";
import type {EApiHttpClientType} from "~/services/api/core/models/enum/EApiHttpClientType";
import {ApiCacheManager} from "~/services/api/core/ApiCacheManager";
import {ApiClientFactory} from "~/services/api/core/ApiClientFactory";
import type {IHttpClient} from "~/models/interfaces/IHttpClient";
import type {IApiResponse} from "~/services/api/core/models/interface/IApiResponse";
import {DIContainer} from "~/DIContainer/DIContainer";
import {EServiceKeys} from "~/models/enum/EServiceKeys";
import type {LocalStorageService} from "~/services/LocalStorageService";
import type {EApiAuthType} from "~/services/api/core/models/enum/EApiAuthType";
import type {IApiClient} from "~/services/api/core/models/interface/IApiClient";
import type {CookieService} from "~/services/CookieService";

export class ApiClient implements IApiClient{
    private static instance: ApiClient;
    private cacheManager: ApiCacheManager;
    private httpClient: IHttpClient;
    private readonly autType: EApiAuthType;

    private constructor(clientType: EApiHttpClientType, cacheDuration: number, autType: EApiAuthType = EApiAuthType.LOCALSTORAGE) {
        this.cacheManager = ApiCacheManager.getInstance(cacheDuration);
        this.httpClient = ApiClientFactory.createClient(clientType);
        this.autType = autType;
    }

    public static getInstance(clientType: EApiHttpClientType, cacheDuration: number, autType: EApiAuthType): ApiClient {
        if (!ApiClient.instance) {
            ApiClient.instance = new ApiClient(clientType,cacheDuration, autType);
        }
        return ApiClient.instance;
    }

    private getToken(){
        try{
            const localStorageService: LocalStorageService = DIContainer.getService<LocalStorageService>(EServiceKeys.LocalStorageService);
            const _token = localStorageService.load('authToken');

            return _token || null;
        }
        catch (e) {
            console.error(e);
        }
    }

    private getCookie(){
        try{
            const cookieService: CookieService = DIContainer.getService<CookieService>(EServiceKeys.CookieService);
            const _cookie = cookieService.load('authToken');

            return _cookie || null;
        }
        catch (e) {
            console.error(e);
        }
    }

    private async request<T>(config: IApiRequest): Promise<IApiResponse<T>> {
        const { method, url, data, headers, responseType, cached, useAuth } = config;

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

            const newHeaders = (this.autType === 'cookie') ? headers : {
                'Authorization': this.getToken() && useAuth ? `Bearer ${this.getToken()}` : '',
                ...headers,
            }

            const response = await this.httpClient.request<T>({ method, url, data, headers: newHeaders, responseType });

            if (cached) {
                const cacheKey = this.createCacheKey(config);
                this.cacheManager.set(cacheKey, response.data, Number.isInteger(cached) ? cached : undefined);
            }

            return response;
        } catch (error: IApiError) {
            this.handleError(error);
            throw error;
        }
    }

    private handleError(error: IApiError): void {
        switch (error.statusCode) {
            case 401: navigateTo('/login');
                break;
            case 403: navigateTo('/error');
                break;
            default:
                console.error(`Errore HTTP! Status: ${error.statusCode}`);
                error.message && console.error(error.message);
        }
    }

    private createCacheKey(config: IApiRequest): string {
        if(!config?.url) return;

        const url = (typeof config.data !== 'object' && config.url?.endsWith('?')) ? config.url.substring(0, config.url.length -1) : config.url;
        const data = (typeof config.data === 'object') ? `:${JSON.stringify(config.data)}` : '';

        return `${url}${data}`;
    }
}
