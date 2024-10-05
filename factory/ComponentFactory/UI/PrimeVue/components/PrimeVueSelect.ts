import type { IComponentFactory } from '~/models/interfaces/IComponentFactory';
import type { TComponentOptions } from '~/models/types/TComponentOptions';
import type { IFlyweightComponent } from '~/models/interfaces/IFlyweightComponent';
import { DIContainer } from "~/DIContainer/DIContainer";
import type { FlyweightFactory } from "~/factory/FlyweightFactory/FlyweightFactory";
import { EServiceKeys } from "~/models/enum/EServiceKeys";
import Select from "primevue/select";

export class PrimeVueSelect implements IComponentFactory {
    private flyweightFactory = DIContainer.getService<FlyweightFactory<TComponentOptions>>(EServiceKeys.FlyweightFactory);
    private flyweight: IFlyweightComponent<TComponentOptions>;
    public options: TComponentOptions = {} as TComponentOptions;

    constructor(options: TComponentOptions = {} as TComponentOptions) {
        this.configure(options);
    }

    configure(options: Partial<TComponentOptions> = {}): void {
        this.flyweight = this.flyweightFactory.getFlyweight('dropdown_PrimeVue', {
            cat: 'PrimeVue',
            className: '',
            tag: 'Dropdown',
            attributes: {
                options: [],
                optionLabel: 'label',
                optionValue: 'value',
                placeholder: 'Select an option',
                disabled: false,
                editable: false,
                filter: false,
                filterPlaceholder: '',
                filterBy: '',
                emptyMessage: 'No available options',
                appendTo: null,
                style: '',
                class: '',
            },
        });

        this.options = { ...this.flyweight.options, ...options };
    }

    render(): string {
        return Select;
    }
}
