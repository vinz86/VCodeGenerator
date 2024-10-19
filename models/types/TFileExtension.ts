import type {EFileTypes} from "~/models/enum/EFileTypes";

export type TFileExtension = {
    id: number;
    label: string;
    entityValue: EFileTypes;
}