import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { IHttpClient} from "~/models/interfaces/IHttpClient";
import {IApiRequest} from "~/models/interfaces/IApiRequest";
import type {IApiResponse} from "~/models/interfaces/IApiResponse";
import {ConfigurationManager} from "~/manager/ConfigurationManager/ConfigurationManager";
import {StateManager} from "~/store/StateManager";
import {LocalStorageService} from "~/services/LocalStorageService";

export class AxiosClient implements IHttpClient {
    private token: string | null = null;

    constructor() {
        const localStorageService = new LocalStorageService();
        const _token = localStorageService.load('authToken');
        if (_token){
            this.token = _token
        }
    }
    setAuthorizationToken(token: string | null) {
        this.token = token;
    }

    private axiosInstance = axios.create({
        timeout: 10000,
    });

    async request<T>(config: IApiRequest): Promise<IApiResponse<T>> {
        console.log(this.axiosInstance)
        const { method, url, data, headers, responseType } = config;

        let axiosConfig: AxiosRequestConfig = {
            method: method.toLowerCase(),
            url: ConfigurationManager.getInstance().getApiBase()+url,
            data,
            headers,
            responseType: responseType as any
        };
        debugger
        if(this.token){
            axiosConfig = {
                ...axiosConfig,
                headers: { 'Authorization': this.token ? `Bearer ${this.token}` : '' }
            };
        }

        const response: AxiosResponse<T> = await this.axiosInstance.request<T>(axiosConfig);

        return {
            data: response.data,
            status: response.status,
            statusText: response.statusText,
            headers: response.headers
        };
    }
}
