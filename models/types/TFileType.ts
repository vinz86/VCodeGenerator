import type { EFileTypes } from "~/models/enum/EFileTypes";

export type TFileType = {
    id: number;
    name: string;
    value: EFileTypes;
};
