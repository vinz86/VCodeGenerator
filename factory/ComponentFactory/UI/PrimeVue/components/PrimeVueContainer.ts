
import type { IComponent } from '~/models/interfaces/IComponent';
import type { IDroppableComponent } from '~/models/IDroppableComponent';
import type { IFlyweightComponent } from '~/models/interfaces/IFlyweightComponent';
import { DIContainer } from '~/DipendencyInjection/DIContainer';
import type { Flyweight } from '~/factory/FlyweightFactory/Flyweight';
import { EServiceKeys } from '~/models/enum/EServiceKeys';

export class PrimeVueContainer implements IComponent {
    private flyweight: IFlyweightComponent<IDroppableComponent> = {} as IFlyweightComponent<IDroppableComponent>;
    public options: IDroppableComponent = {} as IDroppableComponent;

    constructor() {}

    configure(options: IDroppableComponent): void {
        const flyweightFactory = DIContainer.getService<Flyweight<IDroppableComponent>>(EServiceKeys.FlyweightFactory);
        this.flyweight = flyweightFactory.getFlyweight('container_PrimeVue', options);
        this.options = { ...this.options, ...this.flyweight.options, ...options };
    }

    render(): string {
        return `<div class="${this.options.class}" style="${this.options.style}">${this.options.inner}</div>`;
    }
}