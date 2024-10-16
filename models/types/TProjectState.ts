import type { EProjectStatus } from "~/models/enum/EProjectStatus";

export type TProjectState = {
    id: number;
    name: string;
    value: EProjectStatus;
};
