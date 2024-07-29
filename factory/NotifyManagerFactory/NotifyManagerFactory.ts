import type { INotifyManager } from "~/models/interfaces/INotifyManager";
import { PrimeVueToast } from "~/factory/NotifyManagerFactory/implementations/PrimeVueToast";
import { CustomMessage} from "~/factory/NotifyManagerFactory/implementations/CustomMessage";
import { ENotifyManagerTypes } from '@/models/enum/ENotifyManagerTypes'

export class NotifyManagerFactory {
    private static instance: INotifyManager | null = null;

    public static getInstance(type: ENotifyManagerTypes = ENotifyManagerTypes.PrimeVueToast): INotifyManager {
        if (!this.instance) {
            switch (type) {
                case ENotifyManagerTypes.Custom:
                    this.instance = new CustomMessage();
                    break;
                case ENotifyManagerTypes.PrimeVueToast:
                default:
                    this.instance = new PrimeVueToast();
                    break;
            }
        }
        return this.instance;
    }
}