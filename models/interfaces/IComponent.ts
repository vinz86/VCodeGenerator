import type {IComponentOptions} from "~/models/IComponentOptions";

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
    options?: IComponentOptions
    fileId: number
}