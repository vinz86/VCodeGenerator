import type {EFileTypes} from "~/models/enum/EFileTypes";
import type {IComponent} from "~/models/interfaces/IComponent";
import type {TProject} from "~/models/interfaces/TProject";

export type TFile = {
    id: number;
    name: string;
    type: EFileTypes;
    extension: string | null;
    mimeType: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    tUser: number | null;
    contents: IComponent[];
    children: TFile[];
    projectId: number;
    parentId: number | null;
    parent: TFile | null;
    project: TProject;
}