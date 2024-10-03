import { ApiClient} from "~/services/api/core/ApiClient";
import type {IHttpService} from "~/services/api/services/interfaces/IHttpService";

export class ApiHttpService implements IHttpService {
    protected apiClient: ApiClient;

    constructor() {
        this.apiClient = ApiClient.getInstance();
    }

   protected get<T>(endpoint: string, queryParams?: Record<string, any>, cached: boolean | number = false, useAuth: boolean = true): Promise<T> {
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