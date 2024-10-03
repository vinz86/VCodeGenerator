import type { IComponentFactory } from '~/models/interfaces/IComponentFactory';
import type { IComponentOptions } from '~/models/IComponentOptions';

export class GenericHtmlElement implements IComponentFactory {
    public options: IComponentOptions;

    constructor(options: IComponentOptions) {
        this.options = options;
    }

    configure(options: Partial<IComponentOptions>): void {
        this.options = { ...this.options, ...options };
    }

    render(): string {
        const { tag } = this.options;
        return tag;
    }
}