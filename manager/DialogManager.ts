import { useDialog } from 'primevue/usedialog';
import type { DynamicDialogInstance, DynamicDialogOptions } from 'primevue/dynamicdialogoptions';
import type { Component } from 'vue';
import type { IDialogManager } from '~/models/interfaces/IDialogManager';

/*
- E' possibile passare dei dati al dialog tramite dialogManager.setData({...}) o tramite dialogManager.open(component, data)
- Per recuperare le props da dentro il modale: onBeforeMount(() => dialogData.value = dialog['value']['data'] );
 */
export default class DialogManager implements IDialogManager {
    private DialogService: { open: (content: any, options?: DynamicDialogOptions) => DynamicDialogInstance };
    private readonly defaultDialogOptions: DynamicDialogOptions;
    private dialogOptions: DynamicDialogOptions;
    private modalComponent: any | null = null;
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

    // E' possibile passare il componente direttamente al metodo .open(component, data);
    setComponent(component: Component): this {
        this.modalComponent = component;
        return this;
    }

    setOnClose(onClose: (event?: any) => void): this {
        this.dialogOptions.onClose = onClose;
        return this;
    }

    /* Il nome dell'evento non deve avere il prefisso "on" perché verrà aggiunto in automatico.
    Es. Per gestire l'evento 'save':
     - emettere l'evento dal dialog: emit('save', value);
     - impostare la callback "save" (in fase di apertura del dialog) per recuperare i dati dal componente: dialog.setCallback('save', (data) => console.log(data)).open(Component);
     */
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

    // E' possibile passare i dati direttamente al metodo .open(component, data);
    setData(data: any = {}): this {
        this.dialogOptions.data = data;
        return this;
    }

    private formatComponentName(componentName: string): string {
        return componentName
            .replace(/([a-z0-9])([A-Z])/g, '$1 $2') // spazio prima delle maiuscole
            .replaceAll(/[-_]/g, ' ')
            .trim();
    }

    open(component: Component | null = null, data: any = null): void {
        const ModalComponent: Component | null = component ? component : (this.modalComponent || {});

        if (!ModalComponent) {
            console.warn(`Modale non definito.`);
            return;
        }

        if (!this.dialogOptions.props.header) {
            const componentName = (ModalComponent as any)?.__name || (ModalComponent as any)?.name || 'Modale';
            this.dialogOptions.props.header = this.formatComponentName(componentName);
        }

        this.dialogOptions.props = {
            header: ' ',
            ...this.dialogOptions.props,
        };

        this.dialogOptions.data = data ? data : (this.dialogOptions.data || {});

        // TODO: da verificare
        const eventListeners = Object.entries(this.customCallbacks).reduce((events, [event, callback]) => {
            const eventKey = `on${event.charAt(0).toUpperCase() + event.slice(1)}`;
            console.log('Binding evento:', eventKey);
            events[eventKey] = callback;
            return events;
        }, {});

        const modalInstance: DynamicDialogInstance = this.DialogService.open(ModalComponent, {
            ...this.dialogOptions,
            ...eventListeners,
        });

        // console.log('modalInstance', modalInstance);

        this.dialogOptions = this.defaultDialogOptions;
        this.modalComponent = null;
        this.customCallbacks = {};
    }
}