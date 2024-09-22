import type { IComponentFactory } from '~/models/interfaces/IComponentFactory';
import type { IDroppableComponent } from '~/models/IDroppableComponent';
import type { IFlyweightComponent } from '~/models/interfaces/IFlyweightComponent';
import { DIContainer } from "~/DIContainer/DIContainer";
import type { FlyweightFactory } from "~/factory/FlyweightFactory/FlyweightFactory";
import { EServiceKeys } from "~/models/enum/EServiceKeys";
import InputText from "primevue/inputtext";

export class PrimeVueInput implements IComponentFactory {
    private flyweightFactory = DIContainer.getService<FlyweightFactory<IDroppableComponent>>(EServiceKeys.FlyweightFactory);
    private flyweight: IFlyweightComponent<IDroppableComponent>;
    public options: IDroppableComponent = {} as IDroppableComponent;

    constructor(options: IDroppableComponent = {} as IDroppableComponent) {
        this.configure(options);
    }

    configure(options: Partial<IDroppableComponent> = {}): void {
        this.flyweight = this.flyweightFactory.getFlyweight('input_PrimeVue', {
            cat: 'PrimeVue',
            className: '',
            tag: 'input',
            attributes: {
                placeholder: "...inserisci il testo",
                unstyled: false,
                type:'text'
            },
        });

        this.options = { ...this.flyweight.options, ...options };
    }

    render(): string {
        return InputText;
    }
}
