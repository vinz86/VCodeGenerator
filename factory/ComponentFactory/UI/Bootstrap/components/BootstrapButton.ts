import type { IComponent } from '~/models/interfaces/IComponent';
import type { DroppableComponent } from '~/models/DroppableComponent';
import type { IFlyweightComponent } from '~/models/interfaces/IFlyweightComponent';
import {DIContainer} from "~/services/DipendencyInjection/DIContainer";
import type {Flyweight} from "~/factory/FlyweightFactory/Flyweight";
import {EServiceKeys} from "~/models/enum/EServiceKeys";

export class BootstrapButton implements IComponent {
    private flyweight: IFlyweightComponent<DroppableComponent> = {} as IFlyweightComponent<DroppableComponent>;
    public options: DroppableComponent = {} as DroppableComponent;

    constructor() {
    }

    configure(options: DroppableComponent): void {
        const flyweightFactory = DIContainer.getService<Flyweight<DroppableComponent>>(EServiceKeys.FlyweightFactory);
        this.flyweight = flyweightFactory.getFlyweight('button_Bootstrap', options);
        this.options = { ...this.options, ...this.flyweight.options, ...options };
        //this.flyweight.configure(this.options);
    }

    render(): string {
        return `Button`;
    }
}
