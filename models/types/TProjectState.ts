import type { EProjectStatus } from "~/models/enum/EProjectStatus";

export type TProjectState = {
    id?: number;
    label?: string;
    entityValue: EProjectStatus;
};