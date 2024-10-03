import type { IComponentFactory } from '~/models/interfaces/IComponentFactory';
import type { IComponentOptions } from '~/models/IComponentOptions';
import type {IFlyweightComponent} from "~/models/interfaces/IFlyweightComponent";
import {DIContainer} from "~/DIContainer/DIContainer";
import type {FlyweightFactory} from "~/factory/FlyweightFactory/FlyweightFactory";
import {EServiceKeys} from "~/models/enum/EServiceKeys";

export class BootstrapInput implements IComponentFactory {
    private flyweight: IFlyweightComponent<IComponentOptions> = {} as IFlyweightComponent<IComponentOptions>;
    public options: IComponentOptions = {} as IComponentOptions;

    constructor() {
    }

    configure(options: IComponentOptions): void {
        const flyweightFactory = DIContainer.getService<FlyweightFactory<IComponentOptions>>(EServiceKeys.FlyweightFactory);
        this.flyweight = flyweightFactory.getFlyweight('input_Bootstrap', options);
        this.options = { ...this.options, ...this.flyweight.options, ...options };
        //this.flyweight.configure(this.options);
    }

    render(): string {
        return `input`;
    }
}
