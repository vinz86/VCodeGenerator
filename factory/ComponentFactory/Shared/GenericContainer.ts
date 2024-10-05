import type { IComponentFactory } from '~/models/interfaces/IComponentFactory';
import type { TComponentOptions } from '~/models/types/TComponentOptions';
import type { IFlyweightComponent } from '~/models/interfaces/IFlyweightComponent';
import { DIContainer } from "~/DIContainer/DIContainer";
import type { FlyweightFactory } from "~/factory/FlyweightFactory/FlyweightFactory";
import { EServiceKeys } from "~/models/enum/EServiceKeys";
import DroppableComponent from "~/components/DraggableComponents/Layout/DroppableComponent.vue";

export class GenericContainer implements IComponentFactory {
    private flyweightFactory = DIContainer.getService<FlyweightFactory<TComponentOptions>>(EServiceKeys.FlyweightFactory);
    private flyweight: IFlyweightComponent<TComponentOptions>;
    public options: TComponentOptions = {} as TComponentOptions;

    constructor(options: TComponentOptions = {} as TComponentOptions) {
        this.configure(options);
    }

    configure(options: Partial<TComponentOptions> = {}): void {
        this.flyweight = this.flyweightFactory.getFlyweight('generic_container', {
            name: 'DroppableComponent',
            cat: 'Layout',
            className: '',
            style: '',
            tag: 'div',
        });

        this.options = { ...this.flyweight.options, ...options };
    }

    render(): string {
        return DroppableComponent;
    }
}
