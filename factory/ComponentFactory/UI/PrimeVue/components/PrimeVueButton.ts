import type { IComponentFactory } from '~/models/interfaces/IComponentFactory';
import type { IDroppableComponent } from '~/models/IDroppableComponent';
import type { IFlyweightComponent } from '~/models/interfaces/IFlyweightComponent';
import { DIContainer } from "~/DIContainer/DIContainer";
import type { FlyweightFactory } from "~/factory/FlyweightFactory/FlyweightFactory";
import { EServiceKeys } from "~/models/enum/EServiceKeys";
import Button from "primevue/button";

export class PrimeVueButton implements IComponentFactory {
    private flyweightFactory = DIContainer.getService<FlyweightFactory<IDroppableComponent>>(EServiceKeys.FlyweightFactory);
    private flyweight: IFlyweightComponent<IDroppableComponent>;
    public options: IDroppableComponent = {} as IDroppableComponent;

    constructor(options: IDroppableComponent = {} as IDroppableComponent) {
        this.configure(options);
    }

    configure(options: Partial<IDroppableComponent> = {}): void {
        this.flyweight = this.flyweightFactory.getFlyweight('button_PrimeVue', {
            cat: 'PrimeVue',
            className: '',
            tag: 'Button',
            attributes: {
                label: "Label",
                text: false,
                rounded: false,
                outlined: false,
                severity: 'primary',
                icon: '',
                size: '',
                loading: false,
                unstyled: false,
            },
        });

        this.options = { ...this.flyweight.options, ...options };
    }

    render(): string {
        return Button;
    }
}
