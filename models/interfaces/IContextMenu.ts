import type {TItemContextMenu} from "~/models/types/TItemContextMenu";

export interface IContextMenu {
    build(): TItemContextMenu[];
}