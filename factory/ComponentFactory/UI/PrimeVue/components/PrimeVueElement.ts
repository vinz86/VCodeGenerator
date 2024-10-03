import type { IComponentFactory } from '~/models/interfaces/IComponentFactory';
import type { IComponentOptions } from '~/models/IComponentOptions';
import type { IFlyweightComponent } from '~/models/interfaces/IFlyweightComponent';
import { DIContainer } from "~/DIContainer/DIContainer";
import type { FlyweightFactory } from "~/factory/FlyweightFactory/FlyweightFactory";
import { EServiceKeys } from "~/models/enum/EServiceKeys";
import DroppableComponent from "~/components/DraggableComponents/Layout/DroppableComponent.vue";

export class PrimeVueElement implements IComponentFactory {
    private flyweightFactory = DIContainer.getService<FlyweightFactory<IComponentOptions>>(EServiceKeys.FlyweightFactory);
    private flyweight: IFlyweightComponent<IComponentOptions>;
    public options: IComponentOptions = {} as IComponentOptions;

    constructor(options: IComponentOptions = {} as IComponentOptions) {
        this.configure(options);
    }

    configure(options: Partial<IComponentOptions> = {}): void {
        this.flyweight = this.flyweightFactory.getFlyweight('element_PrimeVue', {
            cat: 'PrimeVue',
            name: 'DroppableComponent',
            className: '',
            tag: 'div',
        });

        this.options = { ...this.flyweight.options, ...options };
    }

    render(): string {
        return DroppableComponent;
    }
}
