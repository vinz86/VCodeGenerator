import type {IComponentFactory} from '~/models/interfaces/IComponentFactory';
import type {IComponentOptions} from '~/models/IComponentOptions';
import type {IFlyweightComponent} from '~/models/interfaces/IFlyweightComponent';
import {DIContainer} from "~/DIContainer/DIContainer";
import type {FlyweightFactory} from "~/factory/FlyweightFactory/FlyweightFactory";
import {EServiceKeys} from "~/models/enum/EServiceKeys";
import Button from "primevue/button";

export class PrimeVueButton implements IComponentFactory {
    private flyweightFactory = DIContainer.getService<FlyweightFactory<IComponentOptions>>(EServiceKeys.FlyweightFactory);
    private flyweight: IFlyweightComponent<IComponentOptions>;
    public options: IComponentOptions = {} as IComponentOptions;

    constructor(options: IComponentOptions = {} as IComponentOptions) {
        this.configure(options);
    }

    configure(options: Partial<IComponentOptions> = {}): void {
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
            templates:{
                option: ''
            }
        });

        this.options = { ...this.flyweight.options, ...options };
    }

    render(): string {
        return Button;
    }
/*
    render(type: string, options: IComponentOptions): string {
        return h(
            type, //tipo componente
            options.attributes, //attributi, i listeners vengono passati con gli attributi es onClick: () => {}
            [options.templates] // templates e inner
        );
    }*/
}
