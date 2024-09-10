import type {EComponentTypes} from "~/models/enum/EComponentTypes";
import type {IComponentFactory} from "~/models/interfaces/IComponentFactory";

export interface IComponentFactoryProvider {
    getFactory(type: EComponentTypes): IComponentFactory;
}