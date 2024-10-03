import type {EUserRole} from "~/manager/RoleManager/models/EUserRole";
import type {EAccessLevel} from "~/manager/RoleManager/models/EAccessLevel";
import type {EFeature} from "~/manager/RoleManager/models/EFeature";
import {permissionsByRole} from "~/manager/RoleManager/PermissionByRole";

class RoleManager {
    private readonly roles: EUserRole[];
    private permissionCache: Map<string, boolean>;

    constructor(roles: EUserRole[]) {
        this.roles = roles;
        this.permissionCache = new Map();
    }

    can(feature: EFeature, level: EAccessLevel): boolean {
        const cacheKey = `${feature}_${level}`;

        if (this.permissionCache.has(cacheKey)) {
            return this.permissionCache.get(cacheKey) as boolean;
        }

        for (const role of this.roles) {
            const permissions = permissionsByRole[role];
            if (permissions && permissions[feature] && permissions[feature][level] !== undefined) {
                const result = permissions[feature][level] as boolean;

                this.permissionCache.set(cacheKey, result);
                return result;
            }
        }

        this.permissionCache.set(cacheKey, false);
        return false;
    }

    getUserPermissions(): Record<EFeature, Record<EAccessLevel, boolean>> {
        const userPermissions: Record<EFeature, Record<EAccessLevel, boolean>> = {};

        for (const feature of Object.values(EFeature)) {
            userPermissions[feature] = {};
            for (const level of Object.values(EAccessLevel)) {
                userPermissions[feature][level] = this.can(feature, level);
            }
        }

        return userPermissions;
    }
}

// const userRoles = [EUserRole.MANAGER, EUserRole.USER];
// const roleManager = new RoleManager(userRoles)
// console.log(roleManager.can(EFeature.FEATURE_1, EAccessLevel.READ));
// console.log(roleManager.getUserPermissions());
