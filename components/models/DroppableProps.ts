import type {DroppableAttrs} from "~/components/models/DroppableAttrs";
export interface DroppableProps {
    class: string,
    id: string,
    style: string,
    [key: string]: any,
    attrs: DroppableAttrs
}