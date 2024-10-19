import type {IComponentFactory} from '~/models/interfaces/IComponentFactory';
import type {TComponentOptions} from '~/models/types/TComponentOptions';
import type {IFlyweightComponent} from '~/models/interfaces/IFlyweightComponent';
import {DIContainer} from "~/DIContainer/DIContainer";
import type {FlyweightFactory} from "~/factory/FlyweightFactory/FlyweightFactory";
import {EServiceKeys} from "~/models/enum/EServiceKeys";
import Button from "primevue/button";
import {h} from 'vue';

export class PrimeVueButton implements IComponentFactory {
    private flyweightFactory = DIContainer.getService<FlyweightFactory<TComponentOptions>>(EServiceKeys.FlyweightFactory);
    private flyweight: IFlyweightComponent<TComponentOptions>;
    public options: TComponentOptions = {} as TComponentOptions;

    constructor(options: TComponentOptions = {} as TComponentOptions) {
        this.configure(options);
    }

    configure(options: Partial<TComponentOptions> = {}): void {
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
            templates:''
        });

        this.options = { ...this.flyweight.options, ...options };
    }
    render(): string {
        return Button;
    }
/*    render(options: TComponentOptions): string {
        debugger
        return h(
            Button, //tipo componente
            options?.attributes ? options?.attributes : null, //attributi, i listeners vengono passati con gli attributi es onClick: () => {}
            ''//options?.templates ? [options?.templates] : ''// templates e inner
        );
    }*/

/*

     render (options: TComponentOptions, templates: string|string[] = '') {
        if (options) {
            return h(Button, {
                // Assicurati che gli attributi siano passati correttamente
                id: options?.id,
                class: options?.className,
                style: options?.style,
            }, templates);
        } else {
            return null;
        }
    };
*/

}
