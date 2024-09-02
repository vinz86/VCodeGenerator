import type {IDroppableComponent} from "~/models/IDroppableComponent";

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
    options?: IDroppableComponent
    fileId: number
}