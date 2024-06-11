import type {DroppableAttrs} from "~/models/DroppableAttrs";
export interface DroppableProps {
    class: string,
    id: string,
    style: string,
    [key: string]: any,
    attrs: DroppableAttrs
}