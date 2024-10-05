import type { IComponentFactory } from '~/models/interfaces/IComponentFactory';
import type { TComponentOptions } from '~/models/types/TComponentOptions';

export class GenericHtmlElement implements IComponentFactory {
    public options: TComponentOptions;

    constructor(options: TComponentOptions) {
        this.options = options;
    }

    configure(options: Partial<TComponentOptions>): void {
        this.options = { ...this.options, ...options };
    }

    render(): string {
        const { tag } = this.options;
        return tag;
    }
}