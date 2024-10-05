import type {TComponentAttributes} from "~/models/types/TComponentAttributes";
import type {IComponentFactory} from "~/models/interfaces/IComponentFactory";

export interface TComponentOptions {
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
    attributes?: TComponentAttributes;
    parentId: number;
    fileId: number;
    order: number;
}