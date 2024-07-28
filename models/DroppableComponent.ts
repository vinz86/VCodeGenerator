import type {DroppableProps} from "~/models/DroppableProps";
import type {Component} from "~/models/interfaces/Component";

export interface DroppableComponent {
    id?: string,
    name?: string,
    label?: string,
    cat?: string,
    tag?: string,
    fromEditor?: boolean,
    fromDroppableComponent?: boolean,
    locked?: boolean,
    slot?: Component,
    style?: string
    class?: string;
    inner?: string;
    attributes?: DroppableProps;
}