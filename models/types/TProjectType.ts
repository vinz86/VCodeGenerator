import type {EProjectTypes} from "~/models/enum/EProjectTypes";
import type {EFileTypes} from "~/models/enum/EFileTypes";

export type TProjectType = {
    id?: number;
    label: string;
    entityValue: EFileTypes;
}