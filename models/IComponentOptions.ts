import type {IComponentAttributes} from "~/models/IComponentAttributes";
import type {IComponentFactory} from "~/models/interfaces/IComponentFactory";

export interface IComponentOptions {
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
    attributes?: IComponentAttributes;
    parentId: number;
    fileId: number;
    order: number;
}