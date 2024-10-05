import type {EComponentTypes} from "~/models/enum/EComponentTypes";

export type TOptionsPreset = {
    id: number;
    name: string;
    componentsType: EComponentTypes
    preset: string;
}