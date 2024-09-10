import type { IFlyweightComponent } from '~/models/interfaces/IFlyweightComponent';
import type { FlyweightFactory } from '~/factory/FlyweightFactory/FlyweightFactory';
import type { IDroppableComponent } from '~/models/IDroppableComponent';

export class PrimeVueFlyweightManager {
    private flyweight: IFlyweightComponent<any>[] = [];
    private readonly flyweightFactory: FlyweightFactory<Partial<IDroppableComponent>>;

    constructor(flyweightFactory: FlyweightFactory<Partial<IDroppableComponent>>) {
        this.flyweightFactory = flyweightFactory;
    }

    // Funzione per configurare i flyweight
    setFlyweights(): void {
        const commonOptions = {
            cat: 'PrimeVue',
            style: '',
            class: '',
            inner: '',
            attributes: {},
        };

        this.flyweight.push(this.flyweightFactory.getFlyweight('button_Bootstrap', {
            ...commonOptions,
            class: '',
            inner: 'Button',
            tag: 'Button',
            attributes: { type: 'button' },
        }));

        this.flyweight.push(this.flyweightFactory.getFlyweight('input_Bootstrap', {
            ...commonOptions,
            class: '',
            attributes: {
                type: 'text',
                placeholder: 'inserisci il testo...',
            },
        }));

        this.flyweight.push(this.flyweightFactory.getFlyweight('element_Bootstrap', {
            ...commonOptions,
        }));
    }

    getFlyweights(): IFlyweightComponent<any>[] {
        return this.flyweight;
    }
}
