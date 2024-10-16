import type {EComponentTypes} from "~/models/enum/EComponentTypes";

export type TComponentPreset = {
    id: number;
    name: string;
    componentsType: EComponentTypes
    preset: string;
}