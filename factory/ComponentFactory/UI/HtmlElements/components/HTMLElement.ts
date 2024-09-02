import type { IComponentFactory } from '~/models/interfaces/IComponentFactory';
import type { IDroppableComponent } from '~/models/IDroppableComponent';
import type {IFlyweightComponent} from "~/models/interfaces/IFlyweightComponent";
import {DIContainer} from "~/DIContainer/DIContainer";
import type {Flyweight} from "~/factory/FlyweightFactory/Flyweight";
import {EServiceKeys} from "~/models/enum/EServiceKeys";

export class HTMLElement implements IComponentFactory {
    private flyweight: IFlyweightComponent<IDroppableComponent> = {} as IFlyweightComponent<IDroppableComponent>;
    public options: IDroppableComponent = {} as IDroppableComponent;

    constructor() {
    }

    configure(options: IDroppableComponent): void {
        const flyweightFactory = DIContainer.getService<Flyweight<IDroppableComponent>>(EServiceKeys.FlyweightFactory);
        this.flyweight = flyweightFactory.getFlyweight('html_element', options);
        this.options = { ...this.options, ...this.flyweight.options, ...options };
        //this.flyweight.configure(this.options);
    }

    render(): string {
        return `div`;
    }
}
