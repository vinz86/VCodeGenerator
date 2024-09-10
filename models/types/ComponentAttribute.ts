import {ECustomAttributesType} from "~/models/enum/ECustomAttributesType";

export type ComponentAttribute<T> = {
    name: string;
    type?: ECustomAttributesType,
    value: T;
}