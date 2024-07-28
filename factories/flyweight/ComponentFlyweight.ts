import type {Flyweight} from "~/models/interfaces/Flyweight";

export class ComponentFlyweight<T> implements Flyweight<T> {
    private sharedState: string;
    public options: T;

    constructor(private uniqueState: string, initialOptions: T) {
        this.sharedState = 'common-state'; // Stato condiviso tra i flyweight
        this.options = initialOptions;
    }

    configure(options: T): void {
        this.options = { ...this.options, ...options };
    }

    render(): string {
        return `<div>${this.sharedState} - ${this.uniqueState}</div>`;
    }
}
