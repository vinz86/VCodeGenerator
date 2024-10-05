import type {ECustomAttributesType} from "~/models/enum/ECustomAttributesType";

export type TComponentAttribute<T> = {
    name: string;
    type?: ECustomAttributesType,
    value: T | any;
}