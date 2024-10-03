import { useConfirm } from 'primevue/useconfirm';
import type { ConfirmationOptions } from 'primevue/confirmationoptions';

export enum EConfirmDialogPosition {
    CENTER = 'center',
    TOP = 'top',
    BOTTOM = 'bottom',
    LEFT = 'left',
    RIGHT = 'right',
    TOPLEFT = 'topleft',
    TOPRIGHT = 'topright',
    BOTTOMLEFT = 'bottomleft',
    BOTTOMRIGHT = 'bottomright',
}

export enum EConfirmType {
    DIALOG = 'dialog',
    POPUP = 'popup',
}

export default class ConfirmManager {
    private ConfirmService: { require: (options: ConfirmationOptions) => void };
    private defaultConfirmOptions: ConfirmationOptions;
    private confirmOptions: ConfirmationOptions;
    private confirmType: EConfirmType;

    constructor(type: EConfirmType = EConfirmType.DIALOG) {
        this.ConfirmService = useConfirm();
        this.confirmType = type;
        this.confirmOptions = this.defaultConfirmOptions = {
            header: 'Conferma azione',
            message: 'Sei sicuro di voler procedere?',
            icon: 'pi pi-exclamation-triangle',
            position: EConfirmDialogPosition.CENTER,
            blockScroll: false,
            acceptLabel: 'Conferma',
            rejectLabel: 'Annulla',
            acceptClass: 'p-button-danger',
            rejectClass: 'p-button-secondary',
            acceptProps: { label: 'Conferma' },
            rejectProps: { label: 'Annulla', severity: 'secondary', outlined: true },
            reject: () => {
                console.log('Azione rifiutata');
            },
        };
    }

    setType(type: EConfirmType): this {
        this.confirmType = type;
        return this;
    }

    setMessage(message: string): this {
        this.confirmOptions.message = message;
        return this;
    }

    setHeader(header: string): this {
        this.confirmOptions.header = header;
        return this;
    }

    setIcon(icon: string): this {
        this.confirmOptions.icon = icon;
        return this;
    }

    setPosition(position: EConfirmDialogPosition): this {
        this.confirmOptions.position = position;
        return this;
    }

    setBlockScroll(blockScroll: boolean): this {
        this.confirmOptions.blockScroll = blockScroll;
        return this;
    }

    setAcceptLabel(label: string): this {
        this.confirmOptions.acceptLabel = label;
        return this;
    }

    setRejectLabel(label: string): this {
        this.confirmOptions.rejectLabel = label;
        return this;
    }

    setAcceptClass(acceptClass: string): this {
        this.confirmOptions.acceptClass = acceptClass;
        return this;
    }

    setRejectClass(rejectClass: string): this {
        this.confirmOptions.rejectClass = rejectClass;
        return this;
    }

    setAcceptIcon(icon: string): this {
        this.confirmOptions.acceptIcon = icon;
        return this;
    }

    setRejectIcon(icon: string): this {
        this.confirmOptions.rejectIcon = icon;
        return this;
    }

    setAcceptCallback(callback: () => Promise<void> | void): this {
        this.confirmOptions.accept = callback;
        return this;
    }

    setRejectCallback(callback: () => void): this {
        this.confirmOptions.reject = callback;
        return this;
    }

    setOnShow(callback: () => void): this {
        this.confirmOptions.onShow = callback;
        return this;
    }

    setOnHide(callback: () => void): this {
        this.confirmOptions.onHide = callback;
        return this;
    }

    open(target: HTMLElement): void {
        const options = { ...this.confirmOptions };

        if (this.confirmType === EConfirmType.POPUP) {
            options.target = target;
            delete options.position;
        }

        this.ConfirmService.require(options);

        this.confirmOptions = { ...this.defaultConfirmOptions };
    }
}