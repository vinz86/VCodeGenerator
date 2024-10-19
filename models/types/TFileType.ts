import type { EFileTypes } from "~/models/enum/EFileTypes";

export type TFileType = {
    id?: number;
    label: string;
    entityValue: EFileTypes;
};