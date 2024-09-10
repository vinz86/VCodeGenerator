import type {EComponentTypes} from "~/models/enum/EComponentTypes";

export type ComponentAttribute<T> = {
    name: string;
    type?: EComponentTypes,
    value: T;
}