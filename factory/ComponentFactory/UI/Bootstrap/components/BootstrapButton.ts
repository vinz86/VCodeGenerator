import type { IComponentFactory } from '~/models/interfaces/IComponentFactory';
import type { TComponentOptions } from '~/models/types/TComponentOptions';
import type { IFlyweightComponent } from '~/models/interfaces/IFlyweightComponent';
import {DIContainer} from "~/DIContainer/DIContainer";
import type {FlyweightFactory} from "~/factory/FlyweightFactory/FlyweightFactory";
import {EServiceKeys} from "~/models/enum/EServiceKeys";

export class BootstrapButton implements IComponentFactory {
    private flyweight: IFlyweightComponent<TComponentOptions> = {} as IFlyweightComponent<TComponentOptions>;
    public options: TComponentOptions = {} as TComponentOptions;

    constructor() {
    }

    configure(options: TComponentOptions): void {
        const flyweightFactory = DIContainer.getService<FlyweightFactory<TComponentOptions>>(EServiceKeys.FlyweightFactory);
        this.flyweight = flyweightFactory.getFlyweight('button_Bootstrap', options);
        this.options = { ...this.options, ...this.flyweight.options, ...options };
        //this.flyweight.configure(this.options);
    }

    render(): string {
        return `Button`;
    }
}
