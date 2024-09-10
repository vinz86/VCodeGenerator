import { useDialog } from 'primevue/usedialog';
import type { DynamicDialogInstance, DynamicDialogOptions } from 'primevue/dynamicdialogoptions';
import type { Component } from 'vue';
import { EDialogManager } from '~/models/enum/EDialogManager';
import type { IDialogManager } from '~/models/interfaces/IDialogManager';
import type { TDialogComponentMap } from '~/models/types/TDialogComponentMap';

export default class DialogManager implements IDialogManager {
    private DialogService: { open: (content: any, options?: DynamicDialogOptions) => DynamicDialogInstance };
    private readonly modalComponents: TDialogComponentMap;
    private readonly defaultDialogOptions: DynamicDialogOptions;
    private dialogOptions: DynamicDialogOptions;
    private customComponent: any | null = null;
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
            },
            data: {},
            onClose: null,
        };
    }

    setComponent(component: Component): this {
        this.customComponent = component;
        return this;
    }

    setOnClose(onClose: (event?: any) => void): this {
        this.dialogOptions.onClose = onClose;
        return this;
    }

    setCallback(eventName: string, callback: (payload: any) => void): this {
        this.customCallbacks[eventName] = callback;
        // this.customCallbacks[eventName] = callback.bind(this.dialogOptions);
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

    open(data?: any): void {
        const ModalComponent: Component | null = this.customComponent ? this.customComponent : null;

        if (!ModalComponent) {
            console.warn(`Modale non valido.`);
            return;
        }

        this.dialogOptions.props = {
            //header: this.getHeader(type),
            ...this.dialogOptions.props,
        };

        this.dialogOptions.data = {
            ...(data || this.dialogOptions.data),
        };

        const eventListeners = Object.entries(this.customCallbacks).reduce((events, [event, callback]) => {
            events[`on${event.charAt(0).toUpperCase() + event.slice(1)}`] = callback;
            return events;
        }, {});

        const modalInstance: DynamicDialogInstance = this.DialogService.open(ModalComponent, {
            ...this.dialogOptions,
            ...eventListeners,
        });

        console.log('modalInstance', modalInstance);


        this.dialogOptions = this.defaultDialogOptions;
        this.customComponent = null;
        this.customCallbacks = {};
    }

    // private getHeader(type: EDialogManager): string {
    //     const header: string = this.camelCaseToSpaced(`${type.charAt(0).toUpperCase()}${type.slice(1)}`);
    //     return header !== EDialogManager.Instance ? header : ' ';
    // }
    //
    // private camelCaseToSpaced(str: string): string {
    //     return str.replace(/([A-Z])/g, ' $1').trim();
    // }
}

