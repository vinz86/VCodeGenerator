export interface IHttpClient {
    request<T>(config: IRequestConfig): Promise<IResponse<T>>;
}