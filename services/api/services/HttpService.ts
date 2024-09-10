import { ApiClient} from "~/services/api/ApiClient";
import type {IBaseService} from "~/services/api/interfaces/IBaseService";

export class HttpService implements IBaseService {
    protected apiClient: ApiClient;

    constructor() {
        this.apiClient = ApiClient.getInstance();
    }

   protected get<T>(endpoint: string, queryParams?: Record<string, any>, cached: boolean = false, useAuth: boolean = true): Promise<T> {
        const queryString = queryParams ? new URLSearchParams(queryParams).toString() : '';
        return this.apiClient.request<T>({
            method: 'GET',
            url: `${endpoint}?${queryString}`,
            cached: cached,
            useAuth: useAuth
        }).then(response => response.data);
    }

    protected post<T>(endpoint: string, data?: any, useAuth: boolean = true): Promise<T> {
        return this.apiClient.request<T>({
            method: 'POST',
            url: endpoint,
            data: data,
            useAuth: useAuth
        }).then(response => response.data);
    }

    protected put<T>(endpoint: string, data?: any, useAuth: boolean = true): Promise<T> {
        return this.apiClient.request<T>({
            method: 'PUT',
            url: endpoint,
            data: data,
            useAuth: useAuth
        }).then(response => response.data);
    }

    protected patch<T>(endpoint: string, data?: any, useAuth: boolean = true): Promise<T> {
        return this.apiClient.request<T>({
            method: 'PATCH',
            url: endpoint,
            data: data,
            useAuth: useAuth
        }).then(response => response.data);
    }

    protected delete<T>(endpoint: string, useAuth: boolean = true): Promise<T> {
        return this.apiClient.request<T>({
            method: 'DELETE',
            url: endpoint,
            useAuth: useAuth
        }).then(response => response.data);
    }
}




/*
export class HttpService implements IBaseService{
    protected apiClient: ApiClient;

    constructor() {
        this.apiClient = ApiClient.getInstance();
    }

    protected get<T>(endpoint: string, queryParams?: Record<string, any>, cached: boolean, useAuth: boolean): Promise<T> {
        return this.apiClient.get<T>(endpoint, queryParams, useAuth).then(response => response.data);
    }

    protected post<T>(endpoint: string, data?: any, useAuth: boolean): Promise<T> {
        return this.apiClient.post<T>(endpoint, data, useAuth).then(response => response.data);
    }

    protected put<T>(endpoint: string, data?: any, useAuth: boolean): Promise<T> {
        return this.apiClient.put<T>(endpoint, data, useAuth).then(response => response.data);
    }

    protected patch<T>(endpoint: string, data?: any, useAuth: boolean): Promise<T> {
        return this.apiClient.patch<T>(endpoint, data, useAuth).then(response => response.data);
    }

    protected delete<T>(endpoint: string, useAuth: boolean): Promise<T> {
        return this.apiClient.delete<T>(endpoint, useAuth).then(response => response.data);
    }
}
*/
