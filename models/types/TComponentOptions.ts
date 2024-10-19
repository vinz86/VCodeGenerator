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
    attributes: TComponentAttributes;
    templates: string;
    order: number;
    inner: string;
    createdAt: string;
    updatedAt: string;
    createdBy: number;
    updatedBy: number;
    deletedAt: string;
    parents: string[];
    user: TUser;
    file: TFile;
    preset: TComponentPreset;
    children: string;
    userId: number;
    fileId: number;
    childrenId: number;
}