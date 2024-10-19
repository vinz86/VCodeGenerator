import type { EComponentTypes } from "~/models/enum/EComponentTypes";

export type TComponentFactory = {
    id?: number;
    label?: string;
    entityValue: EComponentFactory;
};
