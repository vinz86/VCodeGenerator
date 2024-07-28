import type {FilesTypes} from "~/models/enum/FilesTypes";
import type {Component} from "~/models/interfaces/Component";

export interface FileModel {
    id: string;
    name: string;
    type: FilesTypes;
    content?: Component[];
    children?: FileModel[];
}
