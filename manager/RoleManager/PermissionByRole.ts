import type {EUserRole} from "~/manager/RoleManager/models/EUserRole";
import type {TPermissionMap} from "~/manager/RoleManager/models/TPermissionMap";
import {EFeature} from "~/manager/RoleManager/models/EFeature";
import {EAccessLevel} from "~/manager/RoleManager/models/EAccessLevel";

export const permissionsByRole: Record<EUserRole, TPermissionMap> = {
    [EUserRole.ADMIN]: {
        [EFeature.FEATURE_1]: {
            [EAccessLevel.READ]: true,
            [EAccessLevel.EDIT]: true,
            [EAccessLevel.MANAGE]: true,
        },
        [EFeature.FEATURE_2]: {
            [EAccessLevel.READ]: true,
            [EAccessLevel.EDIT]: true,
            [EAccessLevel.MANAGE]: true,
        },
        [EFeature.FEATURE_3]: {
            [EAccessLevel.READ]: true,
        },
    },
    [EUserRole.MANAGER]: {
        [EFeature.FEATURE_1]: {
            [EAccessLevel.READ]: true,
            [EAccessLevel.EDIT]: true,
            [EAccessLevel.MANAGE]: false,
        },
        [EFeature.FEATURE_2]: {
            [EAccessLevel.READ]: true,
            [EAccessLevel.EDIT]: true,
        },
    },
    [EUserRole.USER]: {
        [EFeature.FEATURE_1]: {
            [EAccessLevel.READ]: true,
        },
    },
};
