import type { INotifyManager } from "~/models/interfaces/INotifyManager";
import { useToast } from 'primevue/usetoast';
import type {TNotifyParams} from "~/models/types/TNotifyParams";

export class PrimeVueToast implements INotifyManager {
    private toast = useToast();
    private defaultLife: number = 3000;

    show(params: TNotifyParams): void {
        this.toast.add({ severity: params.type as "info" | "success" | "warn" | "error" | "secondary" | "contrast" | undefined || 'info', summary: params.title || 'Info' , detail: params.message, life: params.life || this.defaultLife });
    }

    success(message: string, title: string, life: number): void {
        this.toast.add({ severity: 'success', summary: title || 'Successo', detail: message, life: life || this.defaultLife });
    }

    error(message: string, title: string, life: number): void {
        this.toast.add({ severity: 'error', summary: title || 'Errore', detail: message, life: life || this.defaultLife });
    }

    info(message: string, title: string, life: number): void {
        this.toast.add({ severity: 'info', summary: title || 'Info', detail: message, life: life || this.defaultLife });
    }

    warning(message: string, title: string, life: number): void {
        this.toast.add({ severity: 'warn', summary: title || 'Attenzione', detail: message, life: life || this.defaultLife });
    }
}