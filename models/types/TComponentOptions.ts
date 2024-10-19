import type {TComponentAttributes} from "~/models/types/TComponentAttributes";
import type {TFile} from "~/models/types/TFile";
import type {TUser} from "~/models/types/TUser";
import type {TComponentPreset} from "~/models/types/TComponentPreset";

export type TComponentOptions = {
    id: number;
    type: string;
    name: string;
    label: string;
    cat: string;
    style: string;
    className: string;
    tag: string;
    componentId: string;
    attributes: string;
    templates: string;
    order: number;
    inner: string;
    children: string[];
    user: TUser
    file: TFile;
    parent: string;
    userId: number;
    fileId: number;
    parentId: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    createdBy: number;
    updatedBy: number;
}