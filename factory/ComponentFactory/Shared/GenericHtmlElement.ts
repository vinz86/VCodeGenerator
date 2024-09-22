import type { IComponentFactory } from '~/models/interfaces/IComponentFactory';
import type { IDroppableComponent } from '~/models/IDroppableComponent';

export class GenericHtmlElement implements IComponentFactory {
    public options: IDroppableComponent;

    constructor(options: IDroppableComponent) {
        this.options = options;
    }

    configure(options: Partial<IDroppableComponent>): void {
        this.options = { ...this.options, ...options };
    }

    render(): string {
        const { tag } = this.options;
        return tag;
    }
}