import type { IContextMenu } from '~/models/interfaces/IContextMenu';

export class ContextMenuBuilder {
    public static build<T extends IContextMenu>(ContextMenuClass: new (handlers: any) => T, handlers: any): T {
        return new ContextMenuClass(handlers);
    }
}
