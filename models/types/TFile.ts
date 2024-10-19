import type {TProject} from "~/models/types/TProject";
import type {TUser} from "~/models/types/TUser";
import type {TFileType} from "~/models/types/TFileType";
import type {TFileExtension} from "~/models/types/TFileExtension";

export type TFile = {
    id?: number;
    name: string;
    mimeType?: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: number;
    updatedBy?: number;
    deletedAt?: string;
    user: TUser;
    type?: TFileType;
    extension?: TFileExtension;
    project?: TProject;
    parent?: TFile;
}