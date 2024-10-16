import type { EComponentTypes } from "~/models/enum/EComponentTypes";

export type TComponentFactory = {
    id: number;
    name: string;
    value: EComponentTypes;
};
