import type {EComponentTypes} from "~/models/enum/EComponentTypes";

export type ComponentTypeModel = {
    name: string,
    code: EComponentTypes
}

export type ComponentsTypesModel = ComponentTypeModel[]