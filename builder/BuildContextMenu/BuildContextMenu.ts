import type { TItemContextMenu } from "~/models/types/TItemContextMenu";

// Funzione per creare un menu contestuale
export function buildContextMenu(type: string, handlers: any): TItemContextMenu[] {
    switch(type) {
        case 'component':
            return [
                { label: 'Modifica', icon: 'fa fa-pencil', command: handlers.handleComponentClick },
                { label: 'Duplica', icon: 'fa fa-copy', command: handlers.duplicateComponent },
                { label: 'Cancella', icon: 'fa fa-trash', command: handlers.removeComponent },
            ];
        case 'editor':
            return [
                { label: 'Annulla', icon: 'fa fa-undo', command: handlers.undo },
                { label: 'Ripeti', icon: 'fa fa-redo', command: handlers.redo },
            ];
        default:
            return [];
    }
}
