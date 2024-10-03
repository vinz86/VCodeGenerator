import type { IComponentFactory } from '~/models/interfaces/IComponentFactory';
import type { IComponentOptions } from '~/models/IComponentOptions';
import type { IFlyweightComponent } from '~/models/interfaces/IFlyweightComponent';
import { DIContainer } from "~/DIContainer/DIContainer";
import type { FlyweightFactory } from "~/factory/FlyweightFactory/FlyweightFactory";
import { EServiceKeys } from "~/models/enum/EServiceKeys";
import Select from "primevue/select";

export class PrimeVueDropdown implements IComponentFactory {
    private flyweightFactory = DIContainer.getService<FlyweightFactory<IComponentOptions>>(EServiceKeys.FlyweightFactory);
    private flyweight: IFlyweightComponent<IComponentOptions>;
    public options: IComponentOptions = {} as IComponentOptions;

    constructor(options: IComponentOptions = {} as IComponentOptions) {
        this.configure(options);
    }

    configure(options: Partial<IComponentOptions> = {}): void {
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
