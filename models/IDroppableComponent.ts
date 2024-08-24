import type {DroppableProps} from "~/models/DroppableProps";
import type {IComponent} from "~/models/interfaces/IComponent";

export interface IDroppableComponent {
    id?: string,
    name?: string,
    label?: string,
    cat?: string,
    tag?: string,
    fromEditor?: boolean,
    fromDroppableComponent?: boolean,
    locked?: boolean,
    slot?: IComponent[],
    style?: string
    class?: string;
    inner?: string;
    attributes?: DroppableProps;
}