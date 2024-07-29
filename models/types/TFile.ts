import type {EFileTypes} from "~/models/enum/EFileTypes";
import type {IComponent} from "~/models/interfaces/IComponent";

export interface TFile {
    id: string;
    name: string;
    type: EFileTypes;
    content?: IComponent[];
    children?: TFile[];
}
