import { ApiClient} from "~/services/api/ApiClient";
import type {IBaseService} from "~/services/api/interfaces/IBaseService";

export class ApiHttpService implements IBaseService{
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
