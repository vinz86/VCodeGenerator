import type {ENotifyMessageTypes} from "~/models/enum/ENotifyMessageTypes";

export type TNotifyParams = {
    type?: ENotifyMessageTypes,
    message: string,
    title?: string,
    life?: number,
}