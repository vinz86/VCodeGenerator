import type { IComponentFactory } from '~/models/interfaces/IComponentFactory';
import type { TComponentOptions } from '~/models/types/TComponentOptions';
import type { IFlyweightComponent } from '~/models/interfaces/IFlyweightComponent';
import { DIContainer } from "~/DIContainer/DIContainer";
import type { FlyweightFactory } from "~/factory/FlyweightFactory/FlyweightFactory";
import { EServiceKeys } from "~/models/enum/EServiceKeys";
import InputText from "primevue/inputtext";

export class PrimeVueInput implements IComponentFactory {
    private flyweightFactory = DIContainer.getService<FlyweightFactory<TComponentOptions>>(EServiceKeys.FlyweightFactory);
    private flyweight: IFlyweightComponent<TComponentOptions>;
    public options: TComponentOptions = {} as TComponentOptions;

    constructor(options: TComponentOptions = {} as TComponentOptions) {
        this.configure(options);
    }

    configure(options: Partial<TComponentOptions> = {}): void {
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

/*    render() {
        const attributes = this.attributes || {};
        const templates = this.templates || {};

        return h('InputText', { ...attributes }, templates.default ? templates.default() : []);
    }*/
}
