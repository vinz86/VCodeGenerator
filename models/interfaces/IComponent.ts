import type {TComponentOptions} from "~/models/types/TComponentOptions";

export interface IComponent {
    id?: number,
    type: string,
    style?: object|string,
    file?: {
        id: number,
        name: string,
        type: File,
        projectId: number,
        parentId: number
    },
    options?: TComponentOptions
    fileId: number
}