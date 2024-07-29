import type {TNotifyParams} from "~/models/types/TNotifyParams";

export interface INotifyManager {
    show?(params: TNotifyParams): void;
    success(message: string, title?: string, life?: number): void;
    error(message: string, title?: string, life?: number): void;
    info(message: string, title?: string, life?: number): void;
    warning(message: string, title?: string, life?: number): void;
}