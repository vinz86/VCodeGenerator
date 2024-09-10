import type { IFlyweightComponent } from "~/models/interfaces/IFlyweightComponent";

export class ComponentFlyweight<T> implements IFlyweightComponent<T> {
    private readonly sharedState: string;
    public options: T;

    constructor(private uniqueState: string, initialOptions: T) {
        this.sharedState = 'common-state';
        this.options = initialOptions;
    }

    configure(options: T): void {
        this.options = { ...this.options, ...options };
    }

    render(): string {
        return `<p>${this.sharedState} - ${this.uniqueState}</p>`;
    }
}