import type { IComponentFactory } from '~/models/interfaces/IComponentFactory';
import type { IComponentOptions } from '~/models/IComponentOptions';
import type { IFlyweightComponent } from '~/models/interfaces/IFlyweightComponent';
import { DIContainer } from "~/DIContainer/DIContainer";
import type { FlyweightFactory } from "~/factory/FlyweightFactory/FlyweightFactory";
import { EServiceKeys } from "~/models/enum/EServiceKeys";
import InputText from "primevue/inputtext";

export class PrimeVueInput implements IComponentFactory {
    private flyweightFactory = DIContainer.getService<FlyweightFactory<IComponentOptions>>(EServiceKeys.FlyweightFactory);
    private flyweight: IFlyweightComponent<IComponentOptions>;
    public options: IComponentOptions = {} as IComponentOptions;

    constructor(options: IComponentOptions = {} as IComponentOptions) {
        this.configure(options);
    }

    configure(options: Partial<IComponentOptions> = {}): void {
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
