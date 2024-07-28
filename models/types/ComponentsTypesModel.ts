import type {ComponentTypes} from "~/models/enum/ComponentTypes";

export type ComponentTypeModel = {
    name: string,
    code: ComponentTypes
}

export type ComponentsTypesModel = ComponentTypeModel[]