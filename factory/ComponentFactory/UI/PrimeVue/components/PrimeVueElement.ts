import type { IComponentFactory } from '~/models/interfaces/IComponentFactory';
import type { IDroppableComponent } from '~/models/IDroppableComponent';
import type { IFlyweightComponent } from '~/models/interfaces/IFlyweightComponent';
import { DIContainer } from "~/DIContainer/DIContainer";
import type { FlyweightFactory } from "~/factory/FlyweightFactory/FlyweightFactory";
import { EServiceKeys } from "~/models/enum/EServiceKeys";
import DroppableComponent from "~/components/DraggableComponents/Layout/DroppableComponent.vue";

export class PrimeVueElement implements IComponentFactory {
    private flyweightFactory = DIContainer.getService<FlyweightFactory<IDroppableComponent>>(EServiceKeys.FlyweightFactory);
    private flyweight: IFlyweightComponent<IDroppableComponent>;
    public options: IDroppableComponent = {} as IDroppableComponent;

    constructor(options: IDroppableComponent = {} as IDroppableComponent) {
        this.configure(options);
    }

    configure(options: Partial<IDroppableComponent> = {}): void {
        this.flyweight = this.flyweightFactory.getFlyweight('element_PrimeVue', {
            cat: 'PrimeVue',
            className: '',
            tag: 'div',
        });

        this.options = { ...this.flyweight.options, ...options };
    }

    render(): string {
        return DroppableComponent;
    }
}
