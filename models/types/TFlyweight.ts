import type {IFlyweightComponent} from "~/models/interfaces/IFlyweightComponent";

export type TFlyweight<T> = Map<string, Partial<IFlyweightComponent<T>>>;