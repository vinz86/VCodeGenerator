import type {INotifyManager} from "~/models/interfaces/INotifyManager";
import type {TNotifyParams} from "~/models/types/TNotifyParams";
import {ENotifyMessageTypes} from "~/models/enum/ENotifyMessageTypes";

export class CustomMessage implements INotifyManager {

    show(params: TNotifyParams): void {
        console.log(
            'type: ', params?.type,
            '\ntitle: ', params?.title,
            '\nmessage: ', params?.message,
            '\nlife: ', params?.life
        );
    }

    success(message: string, title: string, life: number): void {
        this.show({type: ENotifyMessageTypes.Success, title: title, message: message, life: life});
    }

    info(message: string, title: string, life: number): void {
        this.show({type: ENotifyMessageTypes.Info,title: title, message: message, life: life});
    }

    warning(message: string, title: string, life: number): void {
        this.show({type: ENotifyMessageTypes.Warning,title: title, message: message, life: life});
    }

    error(message: string, title: string, life: number): void {
        this.show({type: ENotifyMessageTypes.Error,title: title, message: message, life: life});
    }
}