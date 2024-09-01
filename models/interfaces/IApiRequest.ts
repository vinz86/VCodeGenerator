import type {EApiResponseType} from "~/models/enum/EApiResponseType";

export interface IApiRequest {
    method: string;
    endpoint: string;
    data?: any;
    queryParams?: Record<string, any>;
    pathParams?: Record<string, any>;
    headers?: HeadersInit;
    responseType?: EApiResponseType;
    cached?: boolean;
    useAuth?: boolean;
}