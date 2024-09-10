import type { IComponentFactory } from '~/models/interfaces/IComponentFactory';
import type { IDroppableComponent } from '~/models/IDroppableComponent';
import type { IFlyweightComponent } from '~/models/interfaces/IFlyweightComponent';
import {DIContainer} from "~/DIContainer/DIContainer";
import type {FlyweightFactory} from "~/factory/FlyweightFactory/FlyweightFactory";
import {EServiceKeys} from "~/models/enum/EServiceKeys";
import InputText from "primevue/inputtext";

export class PrimeVueInput implements IComponentFactory {
    private flyweightFactory = DIContainer.getService<FlyweightFactory<IDroppableComponent>>(EServiceKeys.FlyweightFactory);
    private flyweight: IFlyweightComponent<IDroppableComponent>[] = [] as IFlyweightComponent<IDroppableComponent>[];
    public options: IDroppableComponent = {} as IDroppableComponent;

    constructor(options: IDroppableComponent = {} as IDroppableComponent) {
        this.setFlyweights()
    }

    setFlyweights(): void {
        const flyweight = this.flyweightFactory.getFlyweight('input_PrimeVue', {
            cat: 'PrimeVue',
            className: '',
            inner: 'Inner',
            tag: 'input',
            attributes: {
                placeholder: "...inserisci il testo",
                unstyled: false,
                type:'text'
            },
        });
        this.flyweight.push(flyweight);
        console.log('Flyweight creato:', flyweight);
    }

    configure(options: IDroppableComponent): void {
        const flyweight = this.flyweightFactory.getFlyweight('input_PrimeVue');

        if (flyweight) {
            this.flyweight = [flyweight];
            this.options = { ...this.options, ...flyweight.options, ...options };
            console.log('PrimeVueInput creato con opzioni:', this.options);
        } else {
            console.error('Nessun flyweight trovato per "input_PrimeVue"');
        }
    }
    render(): string {
        return InputText;
    }
}
