import { useDialog } from 'primevue/usedialog';
import type { DynamicDialogInstance, DynamicDialogOptions } from 'primevue/dynamicdialogoptions';
import type { Component } from 'vue';
import type { IDialogManager } from '~/models/interfaces/IDialogManager';

export default class DialogManager implements IDialogManager {
    private DialogService: { open: (content: any, options?: DynamicDialogOptions) => DynamicDialogInstance };
    private readonly defaultDialogOptions: DynamicDialogOptions;
    private dialogOptions: DynamicDialogOptions;
    private modalComponent: Component | null = null;
    private customCallbacks: { [event: string]: (payload: any) => void } = {};

    constructor() {
        this.DialogService = useDialog();
        this.dialogOptions = this.defaultDialogOptions = {
            props: {
                style: { width: '90vw' },
                baseZIndex: 10000,
                modal: true,
                draggable: false,
                showHeader: true,
                blockScroll: true,
            },
            data: {},
            onClose: null,
        };
    }

    setComponent(component: Component): this {
        this.modalComponent = component;
        return this;
    }

    setOnClose(onClose: (event?: any) => void): this {
        this.dialogOptions.onClose = onClose;
        return this;
    }

    setCallback(eventName: string, callback: (payload: any) => void): this {
        this.customCallbacks[eventName] = callback;
        return this;
    }

    setProps(props: DynamicDialogOptions = {}): this {
        this.dialogOptions.props = { ...this.dialogOptions.props, ...props };
        return this;
    }

    setTitle(title: string): this {
        this.dialogOptions.props.header = title;
        return this;
    }

    setData(data: any = {}): this {
        this.dialogOptions.data = data;
        return this;
    }

    private formatComponentName(componentName: string): string {
        return componentName
            .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
            .replaceAll(/[-_]/g, ' ')
            .trim();
    }

    open(component: Component | null = null, data: any = null): void {
        const ModalComponent = component || this.modalComponent;

        if (!ModalComponent) {
            console.warn(`Modale non definito.`);
            return;
        }

        if (!this.dialogOptions.props.header) {
            const componentName = (ModalComponent as any).__name || (ModalComponent as any).name || 'Modale';
            this.dialogOptions.props.header = this.formatComponentName(componentName);
        }

        this.dialogOptions.props = { ...this.dialogOptions.props };

        if (data) {
            this.dialogOptions.data = data;
        }

        const eventListeners = Object.entries(this.customCallbacks).reduce((events, [event, callback]) => {
            //const eventKey = `on${event.charAt(0).toUpperCase() + event.slice(1)}`;
            //events[eventKey] = callback;
            events[event] = callback;  // Associamo l'evento direttamente senza `on` prefisso.
            return events;
        }, {});

        const modalInstance: DynamicDialogInstance = this.DialogService.open(ModalComponent, {
            ...this.dialogOptions,
            ...eventListeners,
        });

        this.reset();
    }

    private reset(): void {
        this.dialogOptions = { ...this.defaultDialogOptions };
        this.modalComponent = null;
        this.customCallbacks = {};
    }
}
