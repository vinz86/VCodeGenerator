import type {DroppableProps} from "~/models/DroppableProps";
import type {IComponentFactory} from "~/models/interfaces/IComponentFactory";

export interface IDroppableComponent {
    id?: string,
    name?: string,
    label?: string,
    cat?: string,
    tag: string,
    fromEditor?: boolean,
    fromDroppableComponent?: boolean,
    locked?: boolean,
    slot?: IComponentFactory[],
    style?: string
    className?: string;
    inner?: string;
    attributes?: DroppableProps;
    parentId: number;
    fileId: number;
    order: number;
}