import type { Component } from '~/models/interfaces/Component';
import type { DroppableComponent } from '~/models/DroppableComponent';
import type { Flyweight } from '~/models/interfaces/Flyweight';
import {DIContainer} from "~/services/DipendencyInjection/DIContainer";
import type {FlyweightFactory} from "~/factories/flyweight/FlyweightFactory";
import {ServiceKeys} from "~/models/enum/ServiceKeys";

export class PrimeVueButton implements Component {
    private flyweight: Flyweight<DroppableComponent>;
    public options: DroppableComponent = {} as DroppableComponent;

    constructor() {
    }

    configure(options: Partial<DroppableComponent>): void {
        const flyweightFactory = DIContainer.getService<FlyweightFactory<DroppableComponent>>(ServiceKeys.FlyweightFactory);
        this.flyweight = flyweightFactory.getFlyweight('button_PrimeVue');

        this.options = { ...this.options, ...this.flyweight.options, ...options };
        // this.flyweight.configure(this.options);
    }

    render(): string {
        return `Button`;
    }
}
