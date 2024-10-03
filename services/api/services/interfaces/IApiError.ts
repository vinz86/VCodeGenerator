export interface IApiError {
    message: string;
    statusCode: number;
    originalError: any;
}