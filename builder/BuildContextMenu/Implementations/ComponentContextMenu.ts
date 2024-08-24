import type { IContextMenu } from '~/models/interfaces/IContextMenu';
import type { TItemContextMenu } from "~/models/types/TItemContextMenu";

export class ComponentContextMenu implements IContextMenu {
    private handlers: any;

    constructor(handlers: any) {
        this.handlers = handlers;
    }

    public build(): TItemContextMenu[] {
        return [
            { label: 'Modifica', icon: 'fa fa-pencil', command: this.handlers.handleComponentClick },
            { label: 'Duplica', icon: 'fa fa-copy', command: this.handlers.duplicateComponent },
            { label: 'Cancella', icon: 'fa fa-trash', command: this.handlers.removeComponent },
        ];
    }
}