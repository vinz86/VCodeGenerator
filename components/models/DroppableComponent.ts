import type {DroppableProps} from "~/components/models/DroppableProps";

export interface DroppableComponent {
    id?: string,
    name: string,
    label?: string,
    cat: string,
    tag: string,
    fromEditor?: boolean,
    fromDroppableComponent?: boolean,
    locked: boolean,
    props: DroppableProps,
    slot: [ DroppableComponent ] | []
}