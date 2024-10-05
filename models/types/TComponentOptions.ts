import type {TComponentAttributes} from "~/models/types/TComponentAttributes";
import type {TFile} from "~/models/types/TFile";

export type TComponentOptions = {
    id?: number;
    type: string;
    name?: string;
    label?: string | null;
    cat?: string;
    style?: string | null;
    className?: string | null;
    tag: string;
    componentId?: string | null;
    attributes?: TComponentAttributes | null;
    templates?: any;
    order: number;
    inner?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    tUser?: number | null;
    parent?: TComponentOptions | null;
    file?: TFile | null;
    children?: TComponentOptions[];
    parentId: number | null;
    fileId: number;
}

/*
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
}*/
