import type {EFeature} from "~/manager/RoleManager/models/EFeature";

export type TPermissionMap = Record<EFeature, Partial<Record<EPermissionLevel, boolean>>>;